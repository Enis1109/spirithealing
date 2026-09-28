import express from 'express';
import { ExperienceValidationError } from './experiencePolicy.js';

export const registerExperienceRoutes = (app, { service, getMember, sameOrigin, enabled, reminders }) => {
    const identify = async (req, res, admin = false) => {
        res.set('Cache-Control', 'no-store');
        if (!enabled) { res.status(404).json({ ok: false, error: 'not_available' }); return null; }
        const member = await getMember(req);
        if (!member) { res.status(401).json({ ok: false, error: 'unauthorized' }); return null; }
        if (admin && member.role !== 'admin') { res.status(403).json({ ok: false, error: 'forbidden' }); return null; }
        return member;
    };
    const id = value => {
        if (!/^[1-9]\d{0,14}$/.test(String(value))) throw new ExperienceValidationError('id');
        return Number(value);
    };
    const guarded = handler => async (req, res) => {
        try { await handler(req, res); }
        catch (error) {
            if (error instanceof ExperienceValidationError) return res.status(400).json({ ok: false, error: error.field });
            console.error('Experience group operation failed', error?.code || error?.name);
            return res.status(500).json({ ok: false, error: 'server' });
        }
    };
    app.get('/api/members/experience', guarded(async (req, res) => {
        const member = await identify(req, res); if (!member) return;
        res.json({ ok: true, ...await service.overview(member) });
    }));
    app.get('/api/members/experience/live', guarded(async (req, res) => {
        const member = await identify(req, res); if (!member) return;
        const url = await service.live(member);
        if (!url) return res.status(404).json({ ok: false, error: 'not_available' });
        res.set('Referrer-Policy', 'no-referrer').redirect(302, url);
    }));
    app.get('/api/members/experience/sessions/:id/recording', guarded(async (req, res) => {
        const member = await identify(req, res); if (!member) return;
        const embedUrl = await service.recording(member, id(req.params.id));
        if (!embedUrl) return res.status(404).json({ ok: false, error: 'not_available' });
        res.json({ ok: true, embedUrl });
    }));
    app.get('/api/members/experience/handouts/:id', guarded(async (req, res) => {
        const member = await identify(req, res); if (!member) return;
        const file = await service.handout(member, id(req.params.id));
        if (!file) return res.status(404).json({ ok: false, error: 'not_available' });
        res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="handout-${id(req.params.id)}.pdf"`,
            'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "sandbox; default-src 'none'" }).send(file);
    }));
    app.post('/api/admin/experience/sessions', sameOrigin, guarded(async (req, res) => {
        const member = await identify(req, res, true); if (!member) return;
        const sessionId = req.body?.id ? id(req.body.id) : null;
        res.json({ ok: true, id: await service.saveSession(member, sessionId, req.body) });
    }));
    app.post('/api/admin/experience/import', sameOrigin, guarded(async (req, res) => {
        const member = await identify(req, res, true); if (!member) return;
        res.json({ ok: true, sessions: await service.importSessions(member, req.body?.sessions) });
    }));
    app.post('/api/admin/experience/grant', sameOrigin, guarded(async (req, res) => {
        const member = await identify(req, res, true); if (!member) return;
        res.json({ ok: true, access: await service.grant(member, req.body) });
    }));
    app.post('/api/admin/experience/sessions/:id/handouts', sameOrigin,
        express.raw({ type: 'application/pdf', limit: '8mb' }), guarded(async (req, res) => {
            const member = await identify(req, res, true); if (!member) return;
            res.json({ ok: true, id: await service.uploadHandout(member, id(req.params.id), String(req.query.title || '').trim(), req.body) });
        }));
    app.get('/api/admin/experience/reminders', guarded(async (req, res) => {
        const member = await identify(req, res, true); if (!member) return;
        res.json({ ok: true, ...(reminders ? await reminders.overview() : { sendingEnabled: false, jobs: [] }),
            reminders: await service.reminderPreview() });
    }));
};
