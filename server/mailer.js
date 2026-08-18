import nodemailer from "nodemailer";

const requiredVariables = ["SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM"];
const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
    throw new Error(`Missing mail configuration: ${missingVariables.join(", ")}`);
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE ?? "true") !== "false",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const notificationRecipient = process.env.CONTACT_NOTIFICATION_TO || "info@spirit-healing.tr";

const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const sendContactNotification = async ({ id, name, email, phone, topic, message, newsletterConsent }) => {
    const lines = [
        `Neue Kontaktanfrage #${id}`,
        "",
        `Name: ${name}`,
        `E-Mail: ${email}`,
        `Telefon: ${phone || "–"}`,
        `Anliegen: ${topic}`,
        `Newsletter gewünscht: ${newsletterConsent ? "Ja – Bestätigung ausstehend" : "Nein"}`,
        "",
        "Nachricht:",
        message,
    ];

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: notificationRecipient,
        replyTo: email,
        subject: `Kontaktanfrage: ${topic}`,
        text: lines.join("\n"),
    });
};

const getZepterBankDetails = () => {
    const required = ["ZEPTER_BANK_ACCOUNT_NAME", "ZEPTER_BANK_IBAN", "ZEPTER_BANK_BIC"];
    const missing = required.filter((name) => !String(process.env[name] || "").trim());
    if (missing.length > 0) {
        throw new Error(`Missing Zepter bank configuration: ${missing.join(", ")}`);
    }

    return {
        accountName: process.env.ZEPTER_BANK_ACCOUNT_NAME.trim(),
        iban: process.env.ZEPTER_BANK_IBAN.trim(),
        bic: process.env.ZEPTER_BANK_BIC.trim(),
    };
};

export const sendZepterBankTransferConfirmation = async ({ name, email, paymentPlan }) => {
    const bank = getZepterBankDetails();
    const isInstallmentPlan = paymentPlan === "installments";
    const paymentLabel = isInstallmentPlan ? "Erste Rate: 355 €" : "Einmalzahlung: 690 €";
    const installmentNote = isInstallmentPlan
        ? "Die zweite und letzte Rate über 355 € wird 30 Tage nach der ersten Zahlung fällig."
        : "Mit dieser Überweisung ist dein Teilnahmebeitrag vollständig bezahlt.";
    const subject = "Schön, dass du mit uns auf den Weg gehst – deine Überweisungsdaten";
    const reference = `ZEPTER – ${name}`;
    const greeting = `Hallo ${name},`;
    const welcome = "wie schön, dass du dich mit uns auf den Weg machen möchtest und bei „Das Zepter übernehmen“ dabei sein willst.";
    const nextStep = "Bitte überweise den unten genannten Betrag. Sobald deine Zahlung bei uns eingegangen ist, ist dein Platz verbindlich gebucht.";
    const closing = "Wir freuen uns sehr auf diese gemeinsame Reise mit dir.";

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        replyTo: notificationRecipient,
        subject,
        text: [
            greeting,
            "",
            welcome,
            "",
            nextStep,
            "",
            paymentLabel,
            installmentNote,
            "",
            `Kontoinhaberin: ${bank.accountName}`,
            `IBAN: ${bank.iban}`,
            `BIC: ${bank.bic}`,
            `Verwendungszweck: ${reference}`,
            "",
            closing,
            "",
            "Von Herzen",
            "Sabine & Selcan",
            "Spirit Healing",
        ].join("\n"),
        html: `
            <div style="margin:0;background:#eaf3f1;padding:30px 12px;font-family:Arial,sans-serif;color:#163f41">
                <div style="max-width:640px;margin:0 auto;overflow:hidden;border-radius:28px;background:#fffaf2;box-shadow:0 16px 44px rgba(1,47,49,.16)">
                    <div style="background:linear-gradient(145deg,#054e51,#087478);padding:36px 28px;text-align:center;color:#fff">
                        <div style="font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#e8ca67">Spirit Healing</div>
                        <h1 style="margin:14px auto 0;max-width:520px;font-size:29px;line-height:1.22">Schön, dass du mit uns auf den Weg gehst</h1>
                    </div>
                    <div style="padding:34px 28px;line-height:1.65">
                        <p style="margin:0 0 14px;font-size:18px">${escapeHtml(greeting)}</p>
                        <p style="margin:0 0 15px">${escapeHtml(welcome)}</p>
                        <p style="margin:0 0 26px">${escapeHtml(nextStep)}</p>
                        <div style="border:1px solid #d8bd60;border-radius:20px;background:#f8f0d6;padding:22px">
                            <div style="font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6d5b20">Deine Buchung</div>
                            <div style="margin-top:7px;font-size:23px;font-weight:700;color:#075f62">${escapeHtml(paymentLabel)}</div>
                            <p style="margin:9px 0 0;color:#456668">${escapeHtml(installmentNote)}</p>
                        </div>
                        <div style="margin-top:24px;border-radius:20px;background:#eef6f3;padding:22px">
                            <div style="font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#557072">Kontodaten</div>
                            <table role="presentation" style="margin-top:12px;width:100%;border-collapse:collapse;font-size:15px;line-height:1.55">
                                <tr><td style="padding:5px 12px 5px 0;color:#557072;vertical-align:top">Kontoinhaberin</td><td style="padding:5px 0;font-weight:700">${escapeHtml(bank.accountName)}</td></tr>
                                <tr><td style="padding:5px 12px 5px 0;color:#557072;vertical-align:top">IBAN</td><td style="padding:5px 0;font-weight:700;word-break:break-all">${escapeHtml(bank.iban)}</td></tr>
                                <tr><td style="padding:5px 12px 5px 0;color:#557072;vertical-align:top">BIC</td><td style="padding:5px 0;font-weight:700">${escapeHtml(bank.bic)}</td></tr>
                                <tr><td style="padding:5px 12px 5px 0;color:#557072;vertical-align:top">Verwendungszweck</td><td style="padding:5px 0;font-weight:700">${escapeHtml(reference)}</td></tr>
                            </table>
                        </div>
                        <p style="margin:26px 0 0">${escapeHtml(closing)}</p>
                        <p style="margin:24px 0 0;color:#557072">Von Herzen<br><strong>Sabine &amp; Selcan</strong><br>Spirit Healing</p>
                        <p style="margin:24px 0 0;border-top:1px solid #d8e3df;padding-top:18px;font-size:13px;color:#607779">Du hast diese E-Mail erhalten, weil du auf unserer Zepter-Seite die Zahlung per Überweisung gewählt hast. Falls das nicht von dir war, antworte uns bitte kurz auf diese E-Mail.</p>
                    </div>
                </div>
            </div>
        `,
    });
};

export const sendMemberAccessEmail = async ({
    name,
    email,
    locale,
    accessUrl,
    newsletterConsent,
    newsletterOfferUrl,
}) => {
    const isTurkish = locale === "tr";
    const subject = isTurkish
        ? "Spirit Healing üye alanına erişimin"
        : "Dein Zugang zum Spirit Healing Mitgliederbereich";
    const greeting = isTurkish ? `Merhaba ${name},` : `Hallo ${name},`;
    const intro = isTurkish
        ? "Ücretsiz üye alanına giriş yapmak ve seminer kaydına erişmek için aşağıdaki düğmeye tıkla. Kişisel erişim bağlantın kalıcıdır ve daha sonra yeniden kullanılabilir."
        : "Klicke auf den folgenden Button, um den kostenlosen Mitgliederbereich zu öffnen. Dein persönlicher Zugangslink bleibt dauerhaft gültig und kann später erneut verwendet werden.";
    const accessButton = isTurkish ? "Üye alanını aç" : "Mitgliederbereich öffnen";
    const newsletterText = newsletterConsent
        ? (isTurkish
            ? "Bülten aboneliğini seçtin. Aboneliğini onaylaman için sana ayrı bir e-posta gönderdik."
            : "Du hast den Newsletter ausgewählt. Zur Bestätigung erhältst du eine separate E-Mail.")
        : (isTurkish
            ? "Yeni seminer ve eğitimlerden haberdar olmak istersen aşağıdaki düğmeyle bültene açıkça abone olabilirsin."
            : "Wenn du über neue Vorträge und Seminare informiert werden möchtest, kannst du den Newsletter mit dem folgenden Button ausdrücklich abonnieren.");
    const newsletterButton = isTurkish ? "Bültene abone ol" : "Newsletter abonnieren";
    const ignore = isTurkish
        ? "Bu erişimi sen istemediysen e-postayı görmezden gelebilirsin."
        : "Falls du diesen Zugang nicht angefordert hast, kannst du diese E-Mail ignorieren.";

    const textLines = [greeting, "", intro, "", accessUrl, "", newsletterText];
    if (!newsletterConsent) textLines.push(newsletterOfferUrl);
    textLines.push("", ignore);

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        replyTo: notificationRecipient,
        subject,
        text: textLines.join("\n"),
        html: `
            <div style="margin:0;background:#edf5f3;padding:28px 12px;font-family:Arial,sans-serif;color:#143b3d">
                <div style="max-width:640px;margin:0 auto;overflow:hidden;border-radius:26px;background:#fffaf2;box-shadow:0 16px 44px rgba(1,47,49,.16)">
                    <div style="background:#075f62;padding:34px 28px;text-align:center;color:#fff">
                        <div style="font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#e5c75c">Spirit Healing</div>
                        <h1 style="margin:14px 0 0;font-size:29px;line-height:1.2">${escapeHtml(subject)}</h1>
                    </div>
                    <div style="padding:32px 28px;line-height:1.65">
                        <p style="margin:0 0 14px;font-size:18px">${escapeHtml(greeting)}</p>
                        <p style="margin:0 0 26px">${escapeHtml(intro)}</p>
                        <p style="margin:0 0 30px;text-align:center">
                            <a href="${escapeHtml(accessUrl)}" style="display:inline-block;border-radius:999px;background:#d4af37;padding:14px 24px;color:#034f52;text-decoration:none;font-size:16px;font-weight:700">${escapeHtml(accessButton)}</a>
                        </p>
                        <div style="border-top:1px solid #d8e3df;padding-top:24px">
                            <p style="margin:0 0 16px">${escapeHtml(newsletterText)}</p>
                            ${newsletterConsent ? "" : `<p style="margin:0"><a href="${escapeHtml(newsletterOfferUrl)}" style="display:inline-block;border:1px solid #087478;border-radius:999px;padding:11px 18px;color:#075f62;text-decoration:none;font-weight:700">${escapeHtml(newsletterButton)}</a></p>`}
                        </div>
                        <p style="margin:26px 0 0;font-size:13px;color:#557072">${escapeHtml(ignore)}</p>
                        <p style="margin:24px 0 0;font-size:14px;color:#557072">Herzlich · Sevgiler<br><strong>Sabine &amp; Selcan</strong><br>Spirit Healing</p>
                    </div>
                </div>
            </div>
        `,
    });
};

export const sendMemberPasswordResetEmail = async ({ name, email, locale, resetUrl }) => {
    const isTurkish = locale === "tr";
    const subject = isTurkish
        ? "Spirit Healing şifreni yenile"
        : "Dein neues Passwort für Spirit Healing";
    const greeting = isTurkish ? `Merhaba ${name},` : `Hallo ${name},`;
    const intro = isTurkish
        ? "Üye alanın için yeni bir şifre belirlemek üzere aşağıdaki düğmeye tıkla. Bağlantı bir saat geçerlidir."
        : "Über den folgenden Button kannst du ein neues Passwort für deinen Mitgliederbereich festlegen. Der Link ist eine Stunde gültig.";
    const button = isTurkish ? "Yeni şifre belirle" : "Neues Passwort festlegen";
    const ignore = isTurkish
        ? "Bu isteği sen göndermediysen e-postayı görmezden gelebilirsin. Mevcut erişimin değişmez."
        : "Falls du das nicht angefordert hast, kannst du diese E-Mail ignorieren. Dein bisheriger Zugang bleibt unverändert.";

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        replyTo: notificationRecipient,
        subject,
        text: `${greeting}\n\n${intro}\n\n${resetUrl}\n\n${ignore}`,
        html: `
            <div style="margin:0;background:#edf7f5;padding:28px 12px;font-family:Arial,sans-serif;color:#143b3d">
                <div style="max-width:640px;margin:0 auto;overflow:hidden;border-radius:26px;background:#fffaf2;box-shadow:0 16px 44px rgba(1,47,49,.14)">
                    <div style="background:#168e91;padding:34px 28px;text-align:center;color:#fff">
                        <div style="font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#ffe08a">Spirit Healing</div>
                        <h1 style="margin:14px 0 0;font-size:29px;line-height:1.2">${escapeHtml(subject)}</h1>
                    </div>
                    <div style="padding:32px 28px;line-height:1.65">
                        <p style="margin:0 0 14px;font-size:18px">${escapeHtml(greeting)}</p>
                        <p style="margin:0 0 26px">${escapeHtml(intro)}</p>
                        <p style="margin:0 0 30px;text-align:center">
                            <a href="${escapeHtml(resetUrl)}" style="display:inline-block;border-radius:999px;background:#d4af37;padding:14px 24px;color:#034f52;text-decoration:none;font-size:16px;font-weight:700">${escapeHtml(button)}</a>
                        </p>
                        <p style="margin:0;font-size:13px;color:#557072">${escapeHtml(ignore)}</p>
                        <p style="margin:24px 0 0;font-size:14px;color:#557072">Herzlich · Sevgiler<br><strong>Sabine &amp; Selcan</strong><br>Spirit Healing</p>
                    </div>
                </div>
            </div>
        `,
    });
};

export const sendEventConfirmation = async ({
    name,
    email,
    locale,
    newsletterConsent,
    newsletterOfferUrl,
    zoomUrl,
}) => {
    const isTurkish = locale === "tr";
    const subject = isTurkish
        ? "Kaydın tamamlandı – Zoom bağlantın burada"
        : "Schön, dass du dabei bist – dein Zoom-Zugang";
    const greeting = isTurkish ? `Merhaba ${name},` : `Hallo ${name},`;
    const welcome = isTurkish
        ? "Kaydın tamamlandı. Aramızda olacağın için çok mutluyuz."
        : "deine Anmeldung ist vollständig. Wir freuen uns sehr, dass du dabei bist.";
    const eventTitle = isTurkish
        ? "Hayatına aslında kim karar veriyor?"
        : "Wer entscheidet eigentlich dein Leben?";
    const eventDetails = isTurkish
        ? "26 Temmuz 2026 · Türkiye saatiyle 11:00 · Zoom üzerinden canlı"
        : "26. Juli 2026 · 10:00 Uhr (Berlin) · live über Zoom";
    const zoomButton = isTurkish ? "Zoom seminerine katıl" : "Zum Zoom-Vortrag";
    const keepLink = isTurkish
        ? "Bu e-postayı seminer bitene kadar saklamanı öneririz."
        : "Bewahre diese E-Mail am besten bis zum Vortrag auf.";
    const newsletterText = newsletterConsent
        ? (isTurkish
            ? "Bülten aboneliğini seçtin. Aboneliğini onaylaman için sana ayrı bir e-posta gönderdik."
            : "Du hast den Newsletter ausgewählt. Zur Bestätigung erhältst du eine separate E-Mail.")
        : (isTurkish
            ? "Yeni seminerleri ve eğitimleri kaçırmak istemiyor musun? Aşağıdaki düğmeye tıklayarak bültene açıkça abone olabilirsin."
            : "Du möchtest weitere Vorträge und Seminare nicht verpassen? Mit einem Klick auf den folgenden Button kannst du den Newsletter ausdrücklich abonnieren.");
    const newsletterButton = isTurkish ? "Bültene abone ol" : "Newsletter abonnieren";

    const textLines = [
        greeting,
        "",
        welcome,
        "",
        eventTitle,
        eventDetails,
        "",
        `Zoom: ${zoomUrl}`,
        "",
        keepLink,
        "",
        newsletterText,
    ];
    if (!newsletterConsent) textLines.push(newsletterOfferUrl);

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        replyTo: notificationRecipient,
        subject,
        text: textLines.join("\n"),
        html: `
            <div style="margin:0;background:#edf5f3;padding:28px 12px;font-family:Arial,sans-serif;color:#143b3d">
                <div style="max-width:640px;margin:0 auto;overflow:hidden;border-radius:26px;background:#fffaf2;box-shadow:0 16px 44px rgba(1,47,49,.16)">
                    <div style="background:#075f62;padding:34px 28px;text-align:center;color:#fff">
                        <div style="font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#e5c75c">Spirit Healing</div>
                        <h1 style="margin:14px 0 0;font-size:30px;line-height:1.2">${escapeHtml(subject)}</h1>
                    </div>
                    <div style="padding:32px 28px;line-height:1.65">
                        <p style="margin:0 0 14px;font-size:18px">${escapeHtml(greeting)}</p>
                        <p style="margin:0 0 24px;font-size:16px">${escapeHtml(welcome)}</p>
                        <div style="border:1px solid #d9c066;border-radius:18px;background:#f8f1da;padding:20px">
                            <div style="font-size:21px;font-weight:700">${escapeHtml(eventTitle)}</div>
                            <div style="margin-top:8px;color:#416365">${escapeHtml(eventDetails)}</div>
                        </div>
                        <p style="margin:28px 0;text-align:center">
                            <a href="${escapeHtml(zoomUrl)}" style="display:inline-block;border-radius:999px;background:#d4af37;padding:14px 24px;color:#034f52;text-decoration:none;font-size:16px;font-weight:700">${escapeHtml(zoomButton)}</a>
                        </p>
                        <p style="margin:0 0 26px;text-align:center;font-size:14px;color:#557072">${escapeHtml(keepLink)}</p>
                        <div style="border-top:1px solid #d8e3df;padding-top:24px">
                            <p style="margin:0 0 16px">${escapeHtml(newsletterText)}</p>
                            ${newsletterConsent ? "" : `<p style="margin:0"><a href="${escapeHtml(newsletterOfferUrl)}" style="display:inline-block;border:1px solid #087478;border-radius:999px;padding:11px 18px;color:#075f62;text-decoration:none;font-weight:700">${escapeHtml(newsletterButton)}</a></p>`}
                        </div>
                        <p style="margin:28px 0 0;font-size:14px;color:#557072">Herzlich · Sevgiler<br><strong>Sabine &amp; Selcan</strong><br>Spirit Healing</p>
                    </div>
                </div>
            </div>
        `,
    });
};

export const sendEventNotification = async ({ id, eventKey, name, email, newsletterConsent }) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: notificationRecipient,
        replyTo: email,
        subject: "Neue Anmeldung zu einem Spirit-Healing-Vortrag",
        text: [
            `Neue Vortragsanmeldung #${id}`,
            "",
            `Veranstaltung: ${eventKey}`,
            `Name: ${name}`,
            `E-Mail: ${email}`,
            `Newsletter gewünscht: ${newsletterConsent ? "Ja – Bestätigung ausstehend" : "Nein"}`,
        ].join("\n"),
    });
};

export const sendNewsletterConfirmation = async ({ name, email, locale, confirmationUrl }) => {
    const isTurkish = locale === "tr";
    const subject = isTurkish
        ? "Spirit Healing bülten aboneliğini onayla"
        : "Newsletter-Anmeldung bei Spirit Healing bestätigen";
    const greeting = isTurkish ? `Merhaba ${name},` : `Hallo ${name},`;
    const intro = isTurkish
        ? "Seminerler, eğitimler ve yeni tarihler hakkında e-posta almak istediğini lütfen bir kez daha onayla."
        : "Bitte bestätige einmalig, dass du per E-Mail über neue Vorträge, Seminare und Termine informiert werden möchtest.";
    const button = isTurkish ? "Aboneliği onayla" : "Newsletter bestätigen";
    const ignore = isTurkish
        ? "Bu isteği sen göndermediysen e-postayı görmezden gelebilirsin."
        : "Falls du diese Anmeldung nicht selbst angefordert hast, kannst du diese E-Mail ignorieren.";

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject,
        text: `${greeting}\n\n${intro}\n\n${confirmationUrl}\n\n${ignore}`,
        html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#143b3d;max-width:620px;margin:auto;padding:28px">
                <p>${escapeHtml(greeting)}</p>
                <p>${escapeHtml(intro)}</p>
                <p style="margin:28px 0">
                    <a href="${escapeHtml(confirmationUrl)}" style="display:inline-block;background:#D4AF37;color:#03573b;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:999px">${escapeHtml(button)}</a>
                </p>
                <p style="font-size:14px;color:#557072">${escapeHtml(ignore)}</p>
                <p style="font-size:14px;color:#557072">Spirit Healing · info@spirit-healing.tr</p>
            </div>
        `,
    });
};

export const sendOnboardingConfirmation = async ({ name, email, reference }) => {
    const subject = "Dein Startfragebogen ist bei uns angekommen";
    const greeting = `Hallo ${name},`;
    const intro = "vielen Dank, dass du dir die Zeit für deinen Startfragebogen genommen hast. Deine Antworten sind sicher bei uns angekommen und helfen uns, euer gemeinsames Startgespräch gut vorzubereiten.";
    const next = "Du musst jetzt nichts weiter tun. Sabine und Selcan schauen sich deine Angaben vor eurem Termin in Ruhe an.";

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        replyTo: notificationRecipient,
        subject,
        text: [
            greeting,
            "",
            intro,
            "",
            next,
            "",
            `Deine Referenz: ${reference}`,
            "",
            "Von Herzen",
            "Sabine & Selcan",
            "Spirit Healing",
        ].join("\n"),
        html: `
            <div style="margin:0;background:#eaf3f1;padding:30px 12px;font-family:Arial,sans-serif;color:#163f41">
                <div style="max-width:640px;margin:0 auto;overflow:hidden;border-radius:28px;background:#fffaf2;box-shadow:0 16px 44px rgba(1,47,49,.16)">
                    <div style="background:linear-gradient(145deg,#054e51,#087478);padding:36px 28px;text-align:center;color:#fff">
                        <div style="font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#e8ca67">Spirit Healing</div>
                        <h1 style="margin:14px auto 0;max-width:520px;font-size:29px;line-height:1.22">Danke für dein Vertrauen</h1>
                    </div>
                    <div style="padding:34px 28px;line-height:1.65">
                        <p style="margin:0 0 14px;font-size:18px">${escapeHtml(greeting)}</p>
                        <p style="margin:0 0 15px">${escapeHtml(intro)}</p>
                        <p style="margin:0 0 24px">${escapeHtml(next)}</p>
                        <div style="border:1px solid #d8bd60;border-radius:18px;background:#f8f0d6;padding:18px">
                            <span style="font-size:13px;color:#6d5b20">Deine Referenz</span><br>
                            <strong style="font-size:18px;color:#075f62">${escapeHtml(reference)}</strong>
                        </div>
                        <p style="margin:26px 0 0;color:#557072">Von Herzen<br><strong>Sabine &amp; Selcan</strong><br>Spirit Healing</p>
                        <p style="margin:24px 0 0;border-top:1px solid #d8e3df;padding-top:18px;font-size:13px;color:#607779">Du erhältst diese E-Mail als Eingangsbestätigung für deinen Spirit-Healing-Startfragebogen.</p>
                    </div>
                </div>
            </div>
        `,
    });
};

export const sendOnboardingNotification = async ({ name, email, reference, stability, crisisContact }) => {
    const requiresAttention = stability !== "ja" || crisisContact !== "ja";
    const adminUrl = `${String(process.env.PUBLIC_BASE_URL || "https://www.spirit-healing.tr").replace(/\/$/u, "")}/admin`;
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: notificationRecipient,
        replyTo: email,
        subject: `${requiresAttention ? "Bitte prüfen: " : ""}Neuer Zepter-Startfragebogen von ${name}`,
        text: [
            `Neuer Startfragebogen: ${reference}`,
            "",
            `Name: ${name}`,
            `E-Mail: ${email}`,
            `Stabilität für den Gruppenprozess: ${stability}`,
            `Ansprechperson in einer Krise vorhanden: ${crisisContact}`,
            "",
            "Die vollständigen vertraulichen Antworten liegen ausschließlich im geschützten Admin-Bereich:",
            adminUrl,
        ].join("\n"),
    });
};
