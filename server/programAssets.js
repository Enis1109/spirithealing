import fsPromises from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const assetRoot = process.env.PROGRAM_ASSET_DIRECTORY
    ? path.resolve(process.env.PROGRAM_ASSET_DIRECTORY)
    : path.join(currentDirectory, "..", "private_program_uploads");

const assetKinds = {
    workbook: {
        extensions: new Map([["application/pdf", "pdf"]]),
        maxBytes: 12 * 1024 * 1024,
        disposition: "attachment",
        downloadName: "Spirit-Healing-Workbook-Woche-1.pdf",
    },
    meditation: {
        extensions: new Map([
            ["audio/mpeg", "mp3"],
            ["audio/mp4", "m4a"],
            ["audio/x-m4a", "m4a"],
            ["audio/aac", "aac"],
            ["audio/wav", "wav"],
            ["audio/x-wav", "wav"],
        ]),
        maxBytes: 80 * 1024 * 1024,
        disposition: "inline",
        downloadName: "Spirit-Healing-Meditation-Woche-1",
        rangeRequests: true,
    },
    bonusmeditation: {
        extensions: new Map([
            ["audio/mpeg", "mp3"],
            ["audio/mp4", "m4a"],
            ["audio/x-m4a", "m4a"],
            ["audio/aac", "aac"],
            ["audio/wav", "wav"],
            ["audio/x-wav", "wav"],
        ]),
        maxBytes: 80 * 1024 * 1024,
        disposition: "inline",
        downloadName: "Spirit-Healing-Wurzelchakra-Meditation",
        rangeRequests: true,
    },
    bonuscover: {
        extensions: new Map([
            ["image/jpeg", "jpg"],
            ["image/png", "png"],
            ["image/webp", "webp"],
        ]),
        maxBytes: 8 * 1024 * 1024,
        disposition: "inline",
        downloadName: "Spirit-Healing-Wurzelchakra-Cover",
    },
};

const validSlug = (value) => /^[a-z0-9][a-z0-9-]{0,79}$/u.test(value);
const validWeekNumber = (value) => Number.isSafeInteger(value) && value >= 1 && value <= 52;

const resolveAssetDirectory = ({ slug, weekNumber }) => {
    if (!validSlug(slug) || !validWeekNumber(weekNumber)) return "";
    return path.join(assetRoot, slug, `week-${weekNumber}`);
};

export class ProgramAssetError extends Error {
    constructor(code) {
        super(code);
        this.name = "ProgramAssetError";
        this.code = code;
    }
}

export const getProgramAssetRule = (kind) => assetKinds[kind] || null;

export const getProgramAssetUrl = ({ slug, weekNumber, kind }) =>
    `/api/members/programs/${slug}/assets/${weekNumber}/${kind}`;

export const validateProgramAsset = ({ slug, weekNumber, kind, contentType, buffer }) => {
    const rule = getProgramAssetRule(kind);
    const directory = resolveAssetDirectory({ slug, weekNumber });
    const extension = rule?.extensions.get(contentType);
    if (!rule || !directory || !extension) throw new ProgramAssetError("unsupported_asset");
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) throw new ProgramAssetError("empty_asset");
    if (buffer.length > rule.maxBytes) throw new ProgramAssetError("asset_too_large");
    return { rule, directory, extension };
};

export const saveProgramAsset = async ({ slug, weekNumber, kind, contentType, buffer }) => {
    const { rule, directory, extension } = validateProgramAsset({
        slug,
        weekNumber,
        kind,
        contentType,
        buffer,
    });

    await fsPromises.mkdir(directory, { recursive: true, mode: 0o700 });
    const storedName = `${kind}.${extension}`;
    const finalPath = path.join(directory, storedName);
    const temporaryPath = `${finalPath}.${process.pid}.tmp`;
    const metadataPath = path.join(directory, `${kind}.json`);
    const metadataTemporaryPath = `${metadataPath}.${process.pid}.tmp`;

    try {
        await fsPromises.writeFile(temporaryPath, buffer, { mode: 0o600 });
        await fsPromises.rename(temporaryPath, finalPath);
        await fsPromises.writeFile(metadataTemporaryPath, JSON.stringify({
            storedName,
            contentType,
            size: buffer.length,
            updatedAt: new Date().toISOString(),
        }), { mode: 0o600 });
        await fsPromises.rename(metadataTemporaryPath, metadataPath);
    } catch (error) {
        await Promise.allSettled([
            fsPromises.rm(temporaryPath, { force: true }),
            fsPromises.rm(metadataTemporaryPath, { force: true }),
        ]);
        throw error;
    }

    return {
        path: finalPath,
        contentType,
        size: buffer.length,
        disposition: rule.disposition,
        downloadName: extension === "pdf" ? rule.downloadName : `${rule.downloadName}.${extension}`,
        url: getProgramAssetUrl({ slug, weekNumber, kind }),
    };
};

export const getProgramAsset = async ({ slug, weekNumber, kind }) => {
    const rule = getProgramAssetRule(kind);
    const directory = resolveAssetDirectory({ slug, weekNumber });
    if (!rule || !directory) return null;
    try {
        const metadata = JSON.parse(await fsPromises.readFile(path.join(directory, `${kind}.json`), "utf8"));
        if (!rule.extensions.has(metadata.contentType) || !/^[a-z]+\.[a-z0-9]+$/u.test(metadata.storedName)) return null;
        const filePath = path.join(directory, metadata.storedName);
        const fileInfo = await fsPromises.stat(filePath);
        if (!fileInfo.isFile()) return null;
        const extension = path.extname(metadata.storedName);
        return {
            path: filePath,
            contentType: metadata.contentType,
            size: fileInfo.size,
            disposition: rule.disposition,
            downloadName: extension === ".pdf" ? rule.downloadName : `${rule.downloadName}${extension}`,
        };
    } catch {
        return null;
    }
};
