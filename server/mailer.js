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
