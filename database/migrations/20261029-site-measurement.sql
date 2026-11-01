-- New optional measurement tables only; enable only after target/consent review.
CREATE TABLE IF NOT EXISTS site_measurement_consents (
        receipt_hash CHAR(64) PRIMARY KEY, consent_at DATETIME(3) NOT NULL, expires_at DATETIME(3) NOT NULL,
        revoked_at DATETIME(3) NULL, version VARCHAR(64) NOT NULL, environment VARCHAR(12) NOT NULL, INDEX site_consent_expiry(expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS site_measurement_flows (
        receipt_hash CHAR(64) NOT NULL, flow_hash CHAR(64) NOT NULL, code VARCHAR(8) NULL, entry_class VARCHAR(12) NOT NULL,
        flags INT UNSIGNED NOT NULL DEFAULT 0, validation_error TINYINT NOT NULL DEFAULT 0, technical_error TINYINT NOT NULL DEFAULT 0,
        created_at DATETIME(3) NOT NULL, flow_expires_at DATETIME(3) NOT NULL,
        PRIMARY KEY(receipt_hash,flow_hash), INDEX site_flow_created(created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
