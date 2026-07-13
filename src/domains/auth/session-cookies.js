import { getSetCookieValues, parseSetCookieHeader } from "../../core/cookies/set-cookie.js";
import { signCookieValue, verifySignedCookieValue } from "../../core/cookies/signed-cookie.js";

export const ACCESS_COOKIE_NAME = "acs_tkn";
export const REFRESH_COOKIE_NAME = "rfh_tkn";
export const ACCESS_COOKIE_MAX_AGE_SECONDS = 60 * 15;
const COOKIE_VALUE_PATTERN = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/u;

/**
 * @param {boolean} secure
 * @returns {import("cookie").CookieSerializeOptions & { path: string }}
 */
function authCookieOptions(secure) {
	return {
		httpOnly: true,
		secure,
		sameSite: "strict",
		path: "/"
	};
}

/**
 * @param {unknown} value
 * @returns {value is string}
 */
export function isSafeRefreshTokenCookieValue(value) {
	return typeof value === "string" && COOKIE_VALUE_PATTERN.test(value);
}

/**
 * @param {import("@sveltejs/kit").Cookies} cookies
 * @param {string} accessToken
 * @param {{ secure?: boolean }} [options]
 * 
 * set signed access cookie for client
 */
export function setSignedAccessCookie(cookies, accessToken, options = {}) {
	const secure = options.secure ?? true;
	cookies.set(ACCESS_COOKIE_NAME, signCookieValue(accessToken), {
		...authCookieOptions(secure),
		maxAge: ACCESS_COOKIE_MAX_AGE_SECONDS,
	});
}

/**
 * @param {Headers | null | undefined} headers
 * @returns {ReturnType<typeof parseSetCookieHeader>[number] | undefined}
 */
export function getRefreshTokenSetCookie(headers) {
	const setCookieValues = getSetCookieValues(headers);
	const parsedCookies = setCookieValues.flatMap((value) => parseSetCookieHeader(value));
	return parsedCookies.find((cookie) =>
		cookie.key === REFRESH_COOKIE_NAME &&
		isSafeRefreshTokenCookieValue(cookie.value) &&
		(cookie.options.maxAge == null || cookie.options.maxAge > 0) &&
		(cookie.options.expires == null || cookie.options.expires.getTime() > Date.now())
	);
}

/**
 * @param {import("@sveltejs/kit").Cookies} cookies
 * @param {Headers | null | undefined} headers
 * @param {{ secureOverride?: boolean }} [options]
 * 
 * @description
 * passes refresh token cookie to client
 * @returns {boolean} whether an upstream refresh cookie was applied
 */
export function passRefreshTokenCookie(cookies, headers, options = {}) {
	const secureOverride = options.secureOverride;
	const refreshCookie = getRefreshTokenSetCookie(headers);
	if (!refreshCookie) return false;

	const secure = typeof secureOverride === "boolean"
		? secureOverride
		: refreshCookie.options.secure;

	cookies.set(refreshCookie.key, refreshCookie.value, {
		expires: refreshCookie.options.expires,
		httpOnly: true,
		maxAge: refreshCookie.options.maxAge,
		path: "/",
		sameSite: refreshCookie.options.sameSite ?? "lax",
		secure,
		encode: (value) => value
	});
	return true;
}

/**
 * @param {import("@sveltejs/kit").Cookies} cookies
 * @param {{ secure?: boolean }} [options]
 */
export function clearAuthCookies(cookies, options = {}) {
	const cookieOptions = authCookieOptions(options.secure ?? true);
	cookies.delete(REFRESH_COOKIE_NAME, cookieOptions);
	cookies.delete(ACCESS_COOKIE_NAME, cookieOptions);
}

/**
 * @param {import("@sveltejs/kit").Cookies} cookies
 * @returns {string | null}
 */
export function readSignedAccessToken(cookies) {
	const cookie = cookies.get(ACCESS_COOKIE_NAME);
	if (!cookie) return null;
	return verifySignedCookieValue(cookie) ?? null;
}

/**
 * @param {import("@sveltejs/kit").Cookies} cookies
 * @returns {boolean}
 */
export function hasRefreshToken(cookies) {
	return Boolean(cookies.get(REFRESH_COOKIE_NAME));
}
