/**
 * @typedef {{ key: string; value: string; options: import("cookie").CookieSerializeOptions; raw: string }} ParsedSetCookie
 */

/**
 * @param {string} value
 * @returns {"strict" | "lax" | "none" | undefined}
 */
function normalizeSameSite(value) {
	if (!value) return undefined;
	const lowered = String(value).toLowerCase();
	if (lowered === "strict") return "strict";
	if (lowered === "lax") return "lax";
	if (lowered === "none") return "none";
	return undefined;
}

/**
 * Splits a combined `Set-Cookie` header safely across Expires commas.
 *
 * @param {string} raw
 * @returns {string[]}
 */
export function splitSetCookieHeader(raw) {
	if (!raw) return [];
	return raw
		.split(/,(?=\s*[!#$%&'*+\-.^_`|~0-9A-Za-z]+=)/)
		.map((value) => value.trim())
		.filter(Boolean);
}

/**
 * @param {string} cookieStr
 * @returns {ParsedSetCookie | null}
 */
function parseOne(cookieStr) {
	const parts = cookieStr.split(";").map((part) => part.trim()).filter(Boolean);
	if (parts.length === 0) return null;

	const [nameValue, ...attrs] = parts;
	if (!nameValue) return null;
	const eqIndex = nameValue.indexOf("=");
	if (eqIndex <= 0) return null;

	const key = nameValue.slice(0, eqIndex).trim();
	const value = nameValue.slice(eqIndex + 1);

	/** @type {Date | undefined} */
	let expires;
	/** @type {number | undefined} */
	let maxAge;
	/** @type {string | undefined} */
	let path;
	/** @type {"strict" | "lax" | "none" | undefined} */
	let sameSite;
	let secure = false;
	let httpOnly = false;

	for (const attr of attrs) {
		const [rawKey, ...rest] = attr.split("=");
		if (!rawKey) continue;
		const keyLower = rawKey.trim().toLowerCase();
		const valuePart = rest.join("=").trim();

		if (keyLower === "expires" && valuePart) {
			const date = new Date(valuePart);
			if (!Number.isNaN(date.getTime())) expires = date;
		} else if (keyLower === "max-age" && valuePart) {
			const parsed = Number.parseInt(valuePart, 10);
			if (Number.isFinite(parsed)) maxAge = parsed;
		} else if (keyLower === "path" && valuePart) {
			path = valuePart;
		} else if (keyLower === "samesite" && valuePart) {
			sameSite = normalizeSameSite(valuePart);
		} else if (keyLower === "secure" || attr === "Secure") {
			secure = true;
		} else if (keyLower === "httponly" || attr === "HttpOnly") {
			httpOnly = true;
		}
	}

	return {
		key,
		value,
		options: {
			expires,
			httpOnly,
			maxAge,
			path,
			sameSite,
			secure
		},
		raw: cookieStr
	};
}

/**
 * @param {ParsedSetCookie | null} value
 * @returns {value is ParsedSetCookie}
 */
function isParsedCookie(value) {
	return Boolean(value);
}

/**
 * @param {string} raw
 * @returns {ParsedSetCookie[]}
 * 
 * parses the raw set cookie header value passed to it
 */
export function parseSetCookieHeader(raw) {
	return splitSetCookieHeader(raw).map(parseOne).filter(isParsedCookie);
}

/**
 * @param {Headers | null | undefined} headers
 * @returns {string[]}
 * 
 * checks for set cookie header and returns its values
 */
export function getSetCookieValues(headers) {
	if (!headers) return [];
	if (typeof headers.getSetCookie === "function") {
		const values = headers.getSetCookie();
		if (!Array.isArray(values)) return [];
		return values.flatMap((value) => parseSetCookieHeader(value).map((cookie) => cookie.raw));
	}
	const combined = headers.get("set-cookie");
	if (!combined) return [];
	return parseSetCookieHeader(combined).map((cookie) => cookie.raw);
}
