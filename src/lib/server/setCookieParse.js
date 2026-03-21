import { parseSetCookieHeader } from "../../core/cookies/set-cookie.js";

/**
 * Compatibility shim that preserves the previous `parse` export.
 *
 * @param {string} str
 */
export const parse = (str) => parseSetCookieHeader(str);
