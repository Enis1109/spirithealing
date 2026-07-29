import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);
const keyLength = 64;

export const hashPassword = async (password) => {
    const salt = crypto.randomBytes(16);
    const derivedKey = await scrypt(password, salt, keyLength);

    return `scrypt$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`;
};

export const verifyPassword = async (password, storedHash) => {
    if (!storedHash) return false;

    const [algorithm, saltValue, keyValue] = storedHash.split("$");
    if (algorithm !== "scrypt" || !saltValue || !keyValue) return false;

    try {
        const expectedKey = Buffer.from(keyValue, "base64url");
        const derivedKey = await scrypt(password, Buffer.from(saltValue, "base64url"), expectedKey.length);
        return expectedKey.length === derivedKey.length && crypto.timingSafeEqual(expectedKey, derivedKey);
    } catch {
        return false;
    }
};
