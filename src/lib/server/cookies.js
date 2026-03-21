import { signCookieValue, verifyJwtNotExpired, verifySignedCookieValue } from "../../core/cookies/signed-cookie.js";

/**
 * Compatibility shim that preserves the previous function name.
 *
 * @param {string} value
 * @returns {string}
 */
export const sign = (value) => signCookieValue(value);

/**
 * Compatibility shim that preserves the previous function name.
 *
 * @param {string} signedValue
 * @returns {string | undefined}
 */
export const verify = (signedValue) => verifySignedCookieValue(signedValue);

/**
 * Compatibility shim that preserves the previous function name.
 *
 * @param {string} token
 * @returns {boolean}
 */
export const verifyNotExpired = (token) => verifyJwtNotExpired(token);
