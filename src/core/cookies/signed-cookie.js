import { createHmac } from "crypto";
import jwt from "jsonwebtoken";
import { getAuthJwtSecret, getCookieSecret } from "../env/server.js";

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
	const secret = options.secret ?? getCookieSecret({ allowInsecureFallback: true });
	const hmac = createSignature(value, secret);
	return `${value}....${hmac}`;
}

/**
 * @param {string} signedValue
 * @param {{ secret?: string }} [options]
 * @returns {string | undefined}
 */
export function verifySignedCookieValue(signedValue, options = {}) {
	const secret = options.secret ?? getCookieSecret({ allowInsecureFallback: true });
	const [value, sig] = String(signedValue ?? "").split("....");
	if (!value || !sig) return undefined;

	const expectedSig = createSignature(value, secret);
	return sig === expectedSig ? value : undefined;
}

/**
 * @param {string} token
 * @param {{ secret?: string }} [options]
 * @returns {boolean}
 */
export function verifyJwtNotExpired(token, options = {}) {
	const secret = options.secret ?? getAuthJwtSecret({ allowInsecureFallback: true });
	try {
		jwt.verify(token, secret);
		return true;
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) return false;
		return false;
	}
}
