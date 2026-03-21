import { passRefreshTokenCookie } from "../../domains/auth/session-cookies.js";

/**
 * Compatibility shim that preserves the previous function name.
 *
 * @param {import("@sveltejs/kit").Cookies} cookies
 * @param {Headers | null | undefined} headers
 * @param {{ secureOverride?: boolean }} [options]
 */
export const passRefreshTkn = (cookies, headers, options = {}) => {
	passRefreshTokenCookie(cookies, headers, options);
};
