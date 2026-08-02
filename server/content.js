import { database } from "./database.js";

const toIsoString = (value) => value ? new Date(value).toISOString() : null;

const mapEntry = (row) => ({
    key: row.content_key,
    draft: {
        de: row.draft_de,
        tr: row.draft_tr,
    },
    published: {
        de: row.published_de,
        tr: row.published_tr,
    },
    updatedAt: toIsoString(row.updated_at),
    publishedAt: toIsoString(row.published_at),
    updatedBy: row.updated_by_name || null,
    publishedBy: row.published_by_name || null,
});

const mapRevision = (row) => ({
    id: Number(row.id),
    key: row.content_key,
    values: {
        de: row.value_de,
        tr: row.value_tr,
    },
    createdAt: toIsoString(row.created_at),
    publishedBy: row.published_by_name || null,
});

export const getPublishedContent = async () => {
    const [rows] = await database.execute(
        `SELECT content_key, published_de, published_tr, published_at
         FROM cms_content_entries
         WHERE published_de IS NOT NULL OR published_tr IS NOT NULL
         ORDER BY content_key`,
    );

    return Object.fromEntries(rows.map((row) => [row.content_key, {
        de: row.published_de,
        tr: row.published_tr,
        publishedAt: toIsoString(row.published_at),
    }]));
};

export const getAdminContent = async () => {
    const [entries, revisions] = await Promise.all([
        database.execute(
            `SELECT entries.*,
                    updated_members.name AS updated_by_name,
                    published_members.name AS published_by_name
             FROM cms_content_entries AS entries
             LEFT JOIN members AS updated_members ON updated_members.id = entries.updated_by
             LEFT JOIN members AS published_members ON published_members.id = entries.published_by
             ORDER BY entries.content_key`,
        ),
        database.execute(
            `SELECT revisions.*,
                    members.name AS published_by_name
             FROM cms_content_revisions AS revisions
             LEFT JOIN members ON members.id = revisions.published_by
             ORDER BY revisions.created_at DESC, revisions.id DESC
             LIMIT 240`,
        ),
    ]);

    return {
        entries: entries[0].map(mapEntry),
        revisions: revisions[0].map(mapRevision),
    };
};

export const saveContentDrafts = async ({ items, memberId }) => {
    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();
        for (const item of items) {
            await connection.execute(
                `INSERT INTO cms_content_entries (
                    content_key, draft_de, draft_tr, updated_by
                 ) VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                    draft_de = VALUES(draft_de),
                    draft_tr = VALUES(draft_tr),
                    updated_by = VALUES(updated_by),
                    updated_at = UTC_TIMESTAMP()`,
                [item.key, item.de, item.tr, memberId],
            );
        }
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const publishContentDrafts = async ({ keys, memberId }) => {
    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();
        const placeholders = keys.map(() => "?").join(", ");
        const [rows] = await connection.execute(
            `SELECT content_key, draft_de, draft_tr
             FROM cms_content_entries
             WHERE content_key IN (${placeholders})
             FOR UPDATE`,
            keys,
        );
        const entries = new Map(rows.map((row) => [row.content_key, row]));
        if (keys.some((key) => !entries.has(key))) {
            const error = new Error("Missing content draft");
            error.code = "MISSING_DRAFT";
            throw error;
        }

        for (const key of keys) {
            const entry = entries.get(key);
            await connection.execute(
                `INSERT INTO cms_content_revisions (
                    content_key, value_de, value_tr, published_by
                 ) VALUES (?, ?, ?, ?)`,
                [key, entry.draft_de, entry.draft_tr, memberId],
            );
            await connection.execute(
                `UPDATE cms_content_entries
                 SET published_de = draft_de,
                     published_tr = draft_tr,
                     published_by = ?,
                     published_at = UTC_TIMESTAMP(),
                     updated_at = UTC_TIMESTAMP()
                 WHERE content_key = ?`,
                [memberId, key],
            );
        }
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const restoreContentRevision = async ({ key, revisionId, memberId }) => {
    const [rows] = await database.execute(
        `SELECT value_de, value_tr
         FROM cms_content_revisions
         WHERE id = ? AND content_key = ?
         LIMIT 1`,
        [revisionId, key],
    );
    const revision = rows[0];
    if (!revision) return false;

    await database.execute(
        `UPDATE cms_content_entries
         SET draft_de = ?, draft_tr = ?, updated_by = ?, updated_at = UTC_TIMESTAMP()
         WHERE content_key = ?`,
        [revision.value_de, revision.value_tr, memberId, key],
    );
    return true;
};
