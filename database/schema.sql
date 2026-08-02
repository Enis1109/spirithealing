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
    password_hash VARCHAR(255) NULL,
    password_set_at DATETIME NULL,
    locale CHAR(2) NOT NULL DEFAULT 'de',
    role VARCHAR(24) NOT NULL DEFAULT 'member',
    membership_tier VARCHAR(24) NOT NULL DEFAULT 'free',
    premium_expires_at DATETIME NULL,
    acquisition_source VARCHAR(80) NULL,
    acquisition_medium VARCHAR(80) NULL,
    acquisition_campaign VARCHAR(120) NULL,
    acquisition_content VARCHAR(120) NULL,
    acquisition_term VARCHAR(120) NULL,
    acquisition_landing_path VARCHAR(255) NULL,
    acquisition_referrer_host VARCHAR(160) NULL,
    acquisition_session_id CHAR(36) NULL,
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
    pending_password_hash VARCHAR(255) NULL,
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

CREATE TABLE IF NOT EXISTS member_password_reset_tokens (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY member_password_reset_token_unique (token_hash),
    INDEX member_password_reset_member_idx (member_id),
    INDEX member_password_reset_expires_idx (expires_at),
    CONSTRAINT member_password_reset_member_fk FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS member_content_state (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id BIGINT UNSIGNED NOT NULL,
    content_key VARCHAR(80) NOT NULL,
    is_favorite TINYINT(1) NOT NULL DEFAULT 0,
    progress_state VARCHAR(24) NOT NULL DEFAULT 'new',
    last_opened_at DATETIME NULL,
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY member_content_unique (member_id, content_key),
    INDEX member_content_member_idx (member_id),
    INDEX member_content_updated_idx (updated_at),
    CONSTRAINT member_content_member_fk FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS funnel_events (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    funnel_session_id CHAR(36) NOT NULL,
    event_name VARCHAR(48) NOT NULL,
    event_key VARCHAR(120) NOT NULL DEFAULT 'default',
    pathname VARCHAR(255) NULL,
    locale CHAR(2) NOT NULL DEFAULT 'de',
    utm_source VARCHAR(80) NULL,
    utm_medium VARCHAR(80) NULL,
    utm_campaign VARCHAR(120) NULL,
    utm_content VARCHAR(120) NULL,
    utm_term VARCHAR(120) NULL,
    referrer_host VARCHAR(160) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY funnel_event_unique (funnel_session_id, event_name, event_key),
    INDEX funnel_event_created_idx (created_at),
    INDEX funnel_event_source_idx (utm_source, utm_campaign)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_content_entries (
    content_key VARCHAR(160) NOT NULL,
    draft_de LONGTEXT NULL,
    draft_tr LONGTEXT NULL,
    published_de LONGTEXT NULL,
    published_tr LONGTEXT NULL,
    updated_by BIGINT UNSIGNED NULL,
    published_by BIGINT UNSIGNED NULL,
    published_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (content_key),
    INDEX cms_content_updated_idx (updated_at),
    INDEX cms_content_published_idx (published_at),
    CONSTRAINT cms_content_updated_member_fk FOREIGN KEY (updated_by) REFERENCES members(id) ON DELETE SET NULL,
    CONSTRAINT cms_content_published_member_fk FOREIGN KEY (published_by) REFERENCES members(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_content_revisions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    content_key VARCHAR(160) NOT NULL,
    value_de LONGTEXT NULL,
    value_tr LONGTEXT NULL,
    published_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX cms_revision_content_idx (content_key, created_at),
    CONSTRAINT cms_revision_content_fk FOREIGN KEY (content_key) REFERENCES cms_content_entries(content_key) ON DELETE CASCADE,
    CONSTRAINT cms_revision_member_fk FOREIGN KEY (published_by) REFERENCES members(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
