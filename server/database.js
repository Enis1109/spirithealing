import mysql from "mysql2/promise";

const requiredVariables = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
    throw new Error(`Missing database configuration: ${missingVariables.join(", ")}`);
}

export const database = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 20,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    charset: "utf8mb4",
});

const schemaStatements = [
    `CREATE TABLE IF NOT EXISTS contact_submissions (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(254) NOT NULL,
        phone VARCHAR(40) NULL,
        topic VARCHAR(120) NOT NULL,
        message TEXT NOT NULL,
        locale CHAR(2) NOT NULL DEFAULT 'de',
        privacy_consent_version VARCHAR(32) NOT NULL,
        privacy_consent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        newsletter_requested TINYINT(1) NOT NULL DEFAULT 0,
        newsletter_status VARCHAR(24) NOT NULL DEFAULT 'not_requested',
        notification_status VARCHAR(24) NOT NULL DEFAULT 'pending',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX contact_email_idx (email),
        INDEX contact_created_at_idx (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS event_registrations (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        event_key VARCHAR(80) NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(254) NOT NULL,
        locale CHAR(2) NOT NULL DEFAULT 'de',
        privacy_consent_version VARCHAR(32) NOT NULL,
        privacy_consent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        newsletter_requested TINYINT(1) NOT NULL DEFAULT 0,
        newsletter_status VARCHAR(24) NOT NULL DEFAULT 'not_requested',
        notification_status VARCHAR(24) NOT NULL DEFAULT 'pending',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY event_email_unique (event_key, email),
        INDEX event_created_at_idx (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(254) NOT NULL,
        locale CHAR(2) NOT NULL DEFAULT 'de',
        status VARCHAR(24) NOT NULL DEFAULT 'pending',
        source VARCHAR(80) NOT NULL,
        consent_text_version VARCHAR(32) NOT NULL,
        requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        confirmation_token_hash CHAR(64) NULL,
        confirmation_expires_at DATETIME NULL,
        confirmed_at DATETIME NULL,
        unsubscribed_at DATETIME NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY newsletter_email_unique (email),
        INDEX newsletter_status_idx (status),
        INDEX newsletter_requested_at_idx (requested_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

export const initializeDatabase = async () => {
    for (const statement of schemaStatements) {
        await database.query(statement);
    }
};
