export const LiveAttributionConsent = ({ sourceCode, deletionLabel = "18. Januar 2027" }) => sourceCode ? <div className="mt-4 rounded-xl border border-[#b9cec7] p-4 text-sm leading-6">
    <label className="flex gap-3"><input type="checkbox" name="measurement" className="mt-1 h-4 w-4 shrink-0" />
        <span>Ich erlaube Spirit Healing, die Quelle dieses Einladungslinks zusammen mit meiner Anmeldung für die eigene Werbeauswertung zu speichern. Freiwillig und ohne Einfluss auf meine Teilnahme.</span>
    </label>
    <details className="mt-3"><summary className="cursor-pointer underline">Was wird gespeichert? Wie kann ich widerrufen?</summary>
        <p className="mt-3">Wir speichern nur eine feste Kennung der Anzeige, E-Mail oder Einladung und den Zeitpunkt dieser Einwilligung zu deiner neuen Anmeldung. Dafür setzen wir keine Cookies und senden diese Angaben nicht an Meta. Verantwortlich ist Spirit Healing; Kontakt: info@spirit-healing.tr. Rechtsgrundlage ist deine freiwillige Einwilligung. Die Zuordnung wird spätestens am {deletionLabel} zusammen mit den Anmeldedaten gelöscht.</p>
        <p className="mt-3">Du kannst die Zuordnung jederzeit über deinen persönlichen Zugangslink in der Bestätigungs-E-Mail oder per E-Mail löschen lassen. Das beendet weder deine Teilnahme noch einen separat bestellten Newsletter. Der Widerruf gilt für die Zukunft. Bei einer schon bestehenden Anmeldung wird keine neue Zuordnung gespeichert.</p>
    </details>
</div> : null;
