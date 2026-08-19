import {
    getProgramAssetRule,
    getProgramAssetUrl,
    validateProgramAsset,
} from "./programAssets.js";

export const saveDatabaseProgramAsset = async ({
    slug,
    weekNumber,
    kind,
    contentType,
    buffer,
    databaseClient,
}) => {
    const { rule, extension } = validateProgramAsset({ slug, weekNumber, kind, contentType, buffer });
    const storedName = `${kind}.${extension}`;
    const [programRows] = await databaseClient.execute(
        "SELECT id FROM programs WHERE slug = ? LIMIT 1",
        [slug],
    );
    const programId = Number(programRows[0]?.id);
    if (!Number.isSafeInteger(programId) || programId < 1) return null;
    await databaseClient.execute(
        `INSERT INTO program_assets
            (program_id, week_number, asset_kind, stored_name, content_type, content_size, content)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            stored_name = VALUES(stored_name),
            content_type = VALUES(content_type),
            content_size = VALUES(content_size),
            content = VALUES(content),
            updated_at = UTC_TIMESTAMP()`,
        [programId, weekNumber, kind, storedName, contentType, buffer.length, buffer],
    );
    return {
        buffer,
        contentType,
        size: buffer.length,
        disposition: rule.disposition,
        downloadName: extension === "pdf" ? rule.downloadName : `${rule.downloadName}.${extension}`,
        url: getProgramAssetUrl({ slug, weekNumber, kind }),
    };
};

export const getDatabaseProgramAsset = async ({
    slug,
    weekNumber,
    kind,
    databaseClient,
}) => {
    const rule = getProgramAssetRule(kind);
    if (!rule) return null;
    const [rows] = await databaseClient.execute(
        `SELECT assets.stored_name, assets.content_type, assets.content_size, assets.content
         FROM program_assets AS assets
         INNER JOIN programs ON programs.id = assets.program_id
         WHERE programs.slug = ? AND assets.week_number = ? AND assets.asset_kind = ?
         LIMIT 1`,
        [slug, weekNumber, kind],
    );
    const row = rows[0];
    if (!row || !Buffer.isBuffer(row.content) || !rule.extensions.has(row.content_type)) return null;
    if (!/^[a-z]+\.[a-z0-9]+$/u.test(row.stored_name)) return null;
    const extension = row.stored_name.split(".").pop();
    return {
        buffer: row.content,
        contentType: row.content_type,
        size: row.content.length,
        disposition: rule.disposition,
        downloadName: extension === "pdf" ? rule.downloadName : `${rule.downloadName}.${extension}`,
    };
};
