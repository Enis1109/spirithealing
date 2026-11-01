-- Additive extension to site_measurement_consents / site_measurement_flows.
-- Apply only after exact target, optional consent copy and rollout approval.
CREATE TABLE IF NOT EXISTS site_measurement_activity (
 receipt_hash CHAR(64) NOT NULL, flow_hash CHAR(64) NOT NULL,
 revision INT UNSIGNED NOT NULL, state_json JSON NOT NULL,
 PRIMARY KEY(receipt_hash,flow_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Persistent release ledger: do not reset while retained cohorts exist.
CREATE TABLE IF NOT EXISTS site_measurement_releases (
 cohort_day DATE NOT NULL, code VARCHAR(8) NOT NULL, fingerprint CHAR(64) NOT NULL,
 blocked TINYINT NOT NULL DEFAULT 0, expires_at DATETIME NOT NULL,
 PRIMARY KEY(cohort_day,code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
