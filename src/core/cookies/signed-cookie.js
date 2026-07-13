import { createHmac, timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";
import { getAuthJwtSecret, getCookieSecret } from "../env/server.js";

const SIGNATURE_SEPARATOR = "....";
const JWT_ALGORITHMS = /** @type {const} */ (["HS256"]);

/**
 * @param {string} value
 * @param {string} secret
 * @returns {string}
 */
function createSignature(value, secret) {
	return createHmac("sha256", secret).update(value).digest("hex");
}

/**
 * @param {string} value
 * @param {{ secret?: string }} [options]
 * @returns {string}
 */
export function signCookieValue(value, options = {}) {
	const secret = options.secret ?? getCookieSecret();
	const hmac = createSignature(value, secret);
	return `${value}${SIGNATURE_SEPARATOR}${hmac}`;
}

/**
 * @param {string} signedValue
 * @param {{ secret?: string }} [options]
 * @returns {string | undefined}
 */
export function verifySignedCookieValue(signedValue, options = {}) {
	const secret = options.secret ?? getCookieSecret();
	const candidate = String(signedValue ?? "");
	const separatorIndex = candidate.lastIndexOf(SIGNATURE_SEPARATOR);
	if (separatorIndex <= 0) return undefined;

	const value = candidate.slice(0, separatorIndex);
	const signature = candidate.slice(separatorIndex + SIGNATURE_SEPARATOR.length);
	if (!signature) return undefined;

	const expectedSignature = Buffer.from(createSignature(value, secret), "utf8");
	const suppliedSignature = Buffer.from(signature, "utf8");
	if (suppliedSignature.length !== expectedSignature.length) return undefined;

	return timingSafeEqual(suppliedSignature, expectedSignature) ? value : undefined;
}

/**
 * @param {string} token
 * @param {{ secret?: string }} [options]
 * @returns {boolean}
 */
export function verifyJwtNotExpired(token, options = {}) {
	const secret = options.secret ?? getAuthJwtSecret();
	try {
		jwt.verify(token, secret, { algorithms: [...JWT_ALGORITHMS] });
		return true;
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) return false;
		return false;
	}
}
