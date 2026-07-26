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

const prepareEncryptedAsset = async ({ encryptedPath, decryptedPath, magicText }) => {
    if (!process.env.MEMBER_RECORDING_KEY) return "";

    const magic = Buffer.from(magicText, "ascii");
    const headerLength = magic.length + 12;
    const key = Buffer.from(process.env.MEMBER_RECORDING_KEY, "base64url");
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
