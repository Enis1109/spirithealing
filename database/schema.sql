CREATE TABLE IF NOT EXISTS contact_submissions (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS event_registrations (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS members (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    locale CHAR(2) NOT NULL DEFAULT 'de',
    status VARCHAR(24) NOT NULL DEFAULT 'pending',
    privacy_consent_version VARCHAR(32) NOT NULL,
    privacy_consent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at DATETIME NULL,
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY members_email_unique (email),
    INDEX members_status_idx (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS member_access_tokens (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY member_access_token_unique (token_hash),
    INDEX member_access_member_idx (member_id),
    INDEX member_access_expires_idx (expires_at),
    CONSTRAINT member_access_member_fk FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS member_sessions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY member_session_token_unique (token_hash),
    INDEX member_session_member_idx (member_id),
    INDEX member_session_expires_idx (expires_at),
    CONSTRAINT member_session_member_fk FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
