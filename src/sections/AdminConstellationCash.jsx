import { useEffect, useState } from 'react';
import { constellationDays, constellationDate, constellationTicketPrices } from '@/content/constellationDays';

const tickets = [
  { id: 'returning', label: 'Stellvertretung · Mitglieder', bucket: 'representative' },
  { id: 'new', label: 'Stellvertretung · neu dabei', bucket: 'representative' },
  { id: 'own', label: 'Eigene Aufstellung', bucket: 'own' },
];

async function request(url, options = {}) {
  const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store',
    headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}) }, ...options });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) throw new Error(result.error || 'unavailable');
  return result;
}

const initialForm = { day: constellationDays[0].id, kind: 'returning', name: '', email: '', note: '' };

export function AdminConstellationCash() {
  const [form, setForm] = useState(initialForm);
  const [bookings, setBookings] = useState([]);
  const [days, setDays] = useState({});
  const [state, setState] = useState('loading');
  const [notice, setNotice] = useState('');
  const [requestKey, setRequestKey] = useState(() => crypto.randomUUID());
  const selected = tickets.find(ticket => ticket.id === form.kind);

  const refresh = async () => {
    const result = await request('/api/admin/aufstellungen/barbuchungen');
    setBookings(result.bookings);
    setDays(result.days);
    setState('ready');
  };

  useEffect(() => {
    request('/api/admin/aufstellungen/barbuchungen').then(result => {
      setBookings(result.bookings);
      setDays(result.days);
      setState('ready');
    }).catch(() => setState('error'));
  }, []);

  const submit = async event => {
    event.preventDefault();
    setState('saving');
    setNotice('');
    try {
      await request('/api/admin/aufstellungen/barbuchungen', {
        method: 'POST', body: JSON.stringify({ ...form, requestKey }),
      });
      setRequestKey(crypto.randomUUID());
      setForm(current => ({ ...current, name: '', email: '', note: '' }));
      await refresh();
      setNotice('Der Platz ist als Barbuchung reserviert und wird bei den freien Plätzen abgezogen.');
    } catch (error) {
      setState('ready');
      setNotice(error.message === 'full' ? 'Für diese Teilnahmeart ist kein Platz mehr frei.'
        : 'Die Buchung konnte nicht gespeichert werden. Bitte prüfe die Angaben und versuche es erneut.');
    }
  };

  const cancel = async booking => {
    if (!window.confirm(`Barreservierung für ${booking.name} am ${constellationDate(booking.day)} stornieren?`)) return;
    setState('saving');
    setNotice('');
    try {
      await request(`/api/admin/aufstellungen/barbuchungen/${booking.id}/stornieren`, { method: 'POST', body: '{}' });
      await refresh();
      setNotice('Die Reservierung wurde storniert. Der Platz ist wieder frei.');
    } catch {
      setState('ready');
      setNotice('Die Stornierung konnte nicht gespeichert werden.');
    }
  };

  return <div className="space-y-6">
    <section className="rounded-[2rem] bg-[#fffaf2] p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-bold">Barbuchungen für die Aufstellungstage</h1>
      <p className="mt-3 max-w-3xl leading-7 text-[#4e6d6e]">Hier trägst du verbindlich zugesagte Plätze ein, die erst vor Ort bar bezahlt werden. Eine Reservierung zählt sofort beim freien Kontingent mit. Die Zahlung bleibt bis zum Veranstaltungstag offen.</p>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#7b4a20]">Wichtig: Die bisherigen Stripe-Links haben eigene Verkaufslimits. Passe das Limit des passenden Links vor jeder Barreservierung an, damit derselbe Platz nicht zusätzlich online verkauft wird.</p>
      {notice && <p role="status" className="mt-4 rounded-2xl bg-[#eaf4f1] p-4 text-sm font-semibold">{notice}</p>}
      {state === 'error' ? <p role="alert" className="mt-5 text-red-800">Die Buchungen sind gerade nicht erreichbar.</p> : <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">Tag
          <select value={form.day} onChange={event => setForm(current => ({ ...current, day: event.target.value }))} className="min-h-12 rounded-xl border border-[#bdd2ca] bg-white px-4">
            {constellationDays.map(day => <option key={day.id} value={day.id}>{constellationDate(day.date)} · {day.language === 'tr' ? 'Türkisch' : 'Deutsch'}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold">Teilnahmeart
          <select value={form.kind} onChange={event => setForm(current => ({ ...current, kind: event.target.value }))} className="min-h-12 rounded-xl border border-[#bdd2ca] bg-white px-4">
            {tickets.map(ticket => <option key={ticket.id} value={ticket.id}>{ticket.label} · {constellationTicketPrices[ticket.id]} €</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold">Name
          <input required maxLength={100} value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} className="min-h-12 rounded-xl border border-[#bdd2ca] bg-white px-4"/>
        </label>
        <label className="grid gap-2 text-sm font-bold">E-Mail, falls bekannt
          <input type="email" maxLength={254} value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} className="min-h-12 rounded-xl border border-[#bdd2ca] bg-white px-4"/>
        </label>
        <label className="grid gap-2 text-sm font-bold md:col-span-2">Interne Notiz, falls nötig
          <input maxLength={500} value={form.note} onChange={event => setForm(current => ({ ...current, note: event.target.value }))} className="min-h-12 rounded-xl border border-[#bdd2ca] bg-white px-4"/>
        </label>
        <div className="flex flex-wrap items-center gap-4 md:col-span-2"><button disabled={state !== 'ready'} className="min-h-12 rounded-full bg-[#0f8b8d] px-6 font-bold text-white disabled:opacity-50">Barbuchung reservieren</button>
          <span className="text-sm text-[#4e6d6e]">Aktuell frei: {days[form.day]?.[selected.bucket] ?? '–'} {selected.bucket === 'own' ? 'eigene Aufstellungen' : 'Stellvertretungen'}</span></div>
      </form>}
    </section>
    <section className="rounded-[2rem] bg-[#fffaf2] p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold">Erfasste Barbuchungen</h2>
      {!bookings.length ? <p className="mt-4 text-[#4e6d6e]">Noch keine Barbuchungen erfasst.</p> : <ul className="mt-5 space-y-3">{bookings.map(booking => <li key={booking.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#d5e3dc] p-4">
        <div><strong>{booking.name}</strong><p className="mt-1 text-sm text-[#4e6d6e]">{constellationDate(booking.day)} · {booking.ticket === 'own' ? 'Eigene Aufstellung' : 'Stellvertretung'} · {(booking.priceCents / 100).toFixed(0)} € · {booking.status === 'reserved' ? 'reserviert, bar vor Ort' : 'storniert'}</p>{booking.note && <p className="mt-1 text-sm text-[#4e6d6e]">{booking.note}</p>}</div>
        {booking.status === 'reserved' && <button type="button" onClick={() => cancel(booking)} disabled={state !== 'ready'} className="rounded-full border border-[#a26c5c] px-4 py-2 text-sm font-bold text-[#8d3f30] disabled:opacity-50">Stornieren</button>}
      </li>)}</ul>}
    </section>
  </div>;
}
