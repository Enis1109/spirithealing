-- Apply once to an isolated database first. Existing rows remain unclassified (NULL).
ALTER TABLE contact_submissions
    ADD COLUMN request_kind VARCHAR(24) NULL,
    ADD COLUMN offer_code VARCHAR(32) NULL,
    ADD COLUMN practitioner VARCHAR(24) NULL,
    ADD COLUMN request_key CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL UNIQUE,
    ADD COLUMN request_hash CHAR(64) NULL,
    ADD COLUMN processing_status VARCHAR(24) NULL,
    ADD COLUMN processing_version INT UNSIGNED NULL;
