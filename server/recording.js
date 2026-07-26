import crypto from "node:crypto";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

const magic = Buffer.from("SPIRVID1", "ascii");
const headerLength = magic.length + 12;
const authenticationTagLength = 16;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const encryptedRecordingPath = path.join(
    currentDirectory,
    "..",
    "private_assets",
    "vortrag-wer-entscheidet-dein-leben.enc",
);
const decryptedRecordingPath = path.join(os.tmpdir(), "spirit-healing-member-recording.mp4");

export const prepareMemberRecording = async () => {
    if (process.env.MEMBER_RECORDING_PATH) return process.env.MEMBER_RECORDING_PATH;
    if (!process.env.MEMBER_RECORDING_KEY) return "";

    const key = Buffer.from(process.env.MEMBER_RECORDING_KEY, "base64url");
    if (key.length !== 32) throw new Error("Invalid member recording key");

    const encryptedInfo = await fsPromises.stat(encryptedRecordingPath);
    if (encryptedInfo.size <= headerLength + authenticationTagLength) {
        throw new Error("Invalid encrypted member recording");
    }

    const encryptedFile = await fsPromises.open(encryptedRecordingPath, "r");
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
        throw new Error("Invalid member recording header");
    }

    const initializationVector = header.subarray(magic.length, headerLength);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, initializationVector);
    decipher.setAuthTag(authenticationTag);
    const temporaryPath = `${decryptedRecordingPath}.${process.pid}.tmp`;

    try {
        await pipeline(
            fs.createReadStream(encryptedRecordingPath, {
                start: headerLength,
                end: encryptedInfo.size - authenticationTagLength - 1,
            }),
            decipher,
            fs.createWriteStream(temporaryPath, { mode: 0o600 }),
        );
        await fsPromises.rename(temporaryPath, decryptedRecordingPath);
        return decryptedRecordingPath;
    } catch (error) {
        await fsPromises.rm(temporaryPath, { force: true });
        throw error;
    }
};
