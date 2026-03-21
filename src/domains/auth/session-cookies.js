import { getSetCookieValues, parseSetCookieHeader } from "../../core/cookies/set-cookie.js";
import { signCookieValue, verifySignedCookieValue } from "../../core/cookies/signed-cookie.js";

export const ACCESS_COOKIE_NAME = "acs_tkn";
export const REFRESH_COOKIE_NAME = "rfh_tkn";
export const ACCESS_COOKIE_MAX_AGE_SECONDS = 60 * 15;

/**
 * @param {import("@sveltejs/kit").Cookies} cookies
 * @param {string} accessToken
 * @param {{ secure?: boolean }} [options]
 * 
 * set signed access cookie for client
 */
export function setSignedAccessCookie(cookies, accessToken, options = {}) {
	const secure = options.secure ?? false;
	cookies.set(ACCESS_COOKIE_NAME, signCookieValue(accessToken), {
		maxAge: ACCESS_COOKIE_MAX_AGE_SECONDS,
		httpOnly: true,
		secure,
		sameSite: "strict",
		path: "/"
	});
}

/**
 * @param {import("@sveltejs/kit").Cookies} cookies
 * @param {Headers | null | undefined} headers
 * @param {{ secureOverride?: boolean }} [options]
 * 
 * @description
 * passes refresh token cookie to client
 */
export function passRefreshTokenCookie(cookies, headers, options = {}) {
	const secureOverride = options.secureOverride;
	const setCookieValues = getSetCookieValues(headers);
	const parsedCookies = setCookieValues.flatMap((value) => parseSetCookieHeader(value));

	const refreshCookie = parsedCookies.find((cookie) => cookie.key === REFRESH_COOKIE_NAME);
	if (!refreshCookie) return;

	const opts = { ...refreshCookie.options };
	if (typeof secureOverride === "boolean") {
		opts.secure = secureOverride;
	}

	cookies.set(refreshCookie.key, refreshCookie.value, {
		...opts,
		path: opts.path ?? "/",
		encode: (value) => value
	});
}

/**
 * @param {import("@sveltejs/kit").Cookies} cookies
 */
export function clearAuthCookies(cookies) {
	cookies.delete(REFRESH_COOKIE_NAME, { path: "/" });
	cookies.delete(ACCESS_COOKIE_NAME, { path: "/" });
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
