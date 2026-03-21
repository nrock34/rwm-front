import { MissingEnvError } from "../env/server.js";

/**
 * @template {string} TCode
 * @typedef {{
 *   code: TCode;
 *   status: number;
 *   message: string;
 *   details?: unknown;
 * }} DomainError
 */

/**
 * @template {string} TCode
 * @param {TCode} code
 * @param {number} status
 * @param {string} message
 * @param {unknown} [details]
 * @returns {DomainError<TCode>}
 */
export function createDomainError(code, status, message, details) {
	return { code, status, message, details };
}

/**
 * @param {unknown} value
 * @returns {value is DomainError<string>}
 */
export function isDomainError(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return false;
	}

	const candidate = /** @type {Record<string, unknown>} */ (value);
	return (
		typeof candidate.code === "string"
		&& typeof candidate.status === "number"
		&& typeof candidate.message === "string"
	);
}

/**
 * @template {string} TCode
 * @param {unknown} value
 * @param {{ missingEnvCode?: TCode; fallbackCode: TCode; fallbackMessage: string }} options
 * @returns {DomainError<TCode>}
 */
export function coerceDomainError(value, options) {
	if (value instanceof MissingEnvError) {
		return createDomainError(
			options.missingEnvCode ?? options.fallbackCode,
			500,
			value.message,
			{ envName: value.envName }
		);
	}

	if (isDomainError(value)) {
		return /** @type {DomainError<TCode>} */ (value);
	}

	if (value instanceof Error) {
		return createDomainError(
			options.fallbackCode,
			500,
			value.message || options.fallbackMessage,
			value
		);
	}

	return createDomainError(options.fallbackCode, 500, options.fallbackMessage, value);
}
