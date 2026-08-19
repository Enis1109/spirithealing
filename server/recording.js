import crypto from "node:crypto";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

const authenticationTagLength = 16;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const encryptedRecordingPath = path.join(
    currentDirectory,
    "..",
    "private_assets",
    "vortrag-wer-entscheidet-dein-leben.enc",
);
const decryptedRecordingPath = path.join(os.tmpdir(), "spirit-healing-member-recording.mp4");
const encryptedWorkbookPath = path.join(
    currentDirectory,
    "..",
    "private_assets",
    "workbook-wer-entscheidet-dein-leben.enc",
);
const decryptedWorkbookPath = path.join(os.tmpdir(), "spirit-healing-workbook.pdf");
const meditationSecretPath = path.join(currentDirectory, "..", "private_assets", ".meditation-media.key");
const encryptedLoslassenPath = path.join(currentDirectory, "..", "private_assets", "meditation-loslassen-reinigen.enc");
const decryptedLoslassenPath = path.join(os.tmpdir(), "spirit-healing-meditation-loslassen-reinigen.mp3");
const encryptedWiedergeburtPath = path.join(currentDirectory, "..", "private_assets", "meditation-wiedergeburt.enc");
const decryptedWiedergeburtPath = path.join(os.tmpdir(), "spirit-healing-meditation-wiedergeburt.mp3");
const encryptedIchBinLichtPath = path.join(currentDirectory, "..", "private_assets", "meditation-ich-bin-licht.enc");
const decryptedIchBinLichtPath = path.join(os.tmpdir(), "spirit-healing-meditation-ich-bin-licht.mp3");

const prepareEncryptedAsset = async ({ encryptedPath, decryptedPath, magicText, keyText = process.env.MEMBER_RECORDING_KEY }) => {
    if (!keyText) return "";

    const magic = Buffer.from(magicText, "ascii");
    const headerLength = magic.length + 12;
    const key = Buffer.from(keyText.trim(), "base64url");
    if (key.length !== 32) throw new Error("Invalid protected asset key");

    const encryptedInfo = await fsPromises.stat(encryptedPath);
    if (encryptedInfo.size <= headerLength + authenticationTagLength) {
        throw new Error("Invalid encrypted member asset");
    }

    const encryptedFile = await fsPromises.open(encryptedPath, "r");
    const header = Buffer.alloc(headerLength);
    const authenticationTag = Buffer.alloc(authenticationTagLength);
    try {
        await encryptedFile.read(header, 0, headerLength, 0);
        await encryptedFile.read(
            authenticationTag,
            0,
            authenticationTagLength,
            encryptedInfo.size - authenticationTagLength,
        );
    } finally {
        await encryptedFile.close();
    }

    if (!header.subarray(0, magic.length).equals(magic)) {
        throw new Error("Invalid protected asset header");
    }

    const initializationVector = header.subarray(magic.length, headerLength);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, initializationVector);
    decipher.setAuthTag(authenticationTag);
    const temporaryPath = `${decryptedPath}.${process.pid}.tmp`;

    try {
        await pipeline(
            fs.createReadStream(encryptedPath, {
                start: headerLength,
                end: encryptedInfo.size - authenticationTagLength - 1,
            }),
            decipher,
            fs.createWriteStream(temporaryPath, { mode: 0o600 }),
        );
        await fsPromises.rename(temporaryPath, decryptedPath);
        return decryptedPath;
    } catch (error) {
        await fsPromises.rm(temporaryPath, { force: true });
        throw error;
    }
};

const readMeditationKey = async () => {
    if (process.env.MEMBER_MEDITATION_KEY) return process.env.MEMBER_MEDITATION_KEY;
    try {
        return await fsPromises.readFile(meditationSecretPath, "utf8");
    } catch {
        return "";
    }
};

export const prepareMemberRecording = async () => {
    if (process.env.MEMBER_RECORDING_PATH) return process.env.MEMBER_RECORDING_PATH;
    return prepareEncryptedAsset({
        encryptedPath: encryptedRecordingPath,
        decryptedPath: decryptedRecordingPath,
        magicText: "SPIRVID1",
    });
};

export const prepareMemberWorkbook = async () => {
    if (process.env.MEMBER_WORKBOOK_PATH) return process.env.MEMBER_WORKBOOK_PATH;
    return prepareEncryptedAsset({
        encryptedPath: encryptedWorkbookPath,
        decryptedPath: decryptedWorkbookPath,
        magicText: "SPIRPDF1",
    });
};

export const prepareMemberMeditations = async () => {
    const keyText = await readMeditationKey();
    const ichBinLichtKeyText = process.env.MEMBER_ICH_BIN_LICHT_KEY || keyText;
    const [loslassen, wiedergeburt, ichBinLicht] = await Promise.all([
        keyText ? prepareEncryptedAsset({
            encryptedPath: encryptedLoslassenPath,
            decryptedPath: decryptedLoslassenPath,
            magicText: "SPIRMED1",
            keyText,
        }) : Promise.resolve(""),
        keyText ? prepareEncryptedAsset({
            encryptedPath: encryptedWiedergeburtPath,
            decryptedPath: decryptedWiedergeburtPath,
            magicText: "SPIRMED1",
            keyText,
        }) : Promise.resolve(""),
        ichBinLichtKeyText ? prepareEncryptedAsset({
            encryptedPath: encryptedIchBinLichtPath,
            decryptedPath: decryptedIchBinLichtPath,
            magicText: "SPIRMED1",
            keyText: ichBinLichtKeyText,
        }) : Promise.resolve(""),
    ]);
    return { loslassen, wiedergeburt, ichBinLicht };
};
