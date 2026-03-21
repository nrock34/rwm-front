import { createDomainError } from "./errors.js";
import { isObject } from "./coerce.js";

/**
 * @template {string} TCode
 * @param {unknown} value
 * @param {string} label
 * @param {{ errorCode?: TCode; status?: number }} [options]
 * @returns {Record<string, unknown>}
 */
export function assertObject(value, label, options = {}) {
	if (!isObject(value)) {
		throw createDomainError(
			options.errorCode ?? /** @type {TCode} */ ("invalid_response"),
			options.status ?? 502,
			`${label} must be an object.`,
			value
		);
	}
	return value;
}

/**
 * @template {string} TCode
 * @param {unknown} value
 * @param {string} label
 * @param {{ errorCode?: TCode; status?: number }} [options]
 * @returns {string}
 */
export function assertString(value, label, options = {}) {
	if (typeof value !== "string") {
		throw createDomainError(
			options.errorCode ?? /** @type {TCode} */ ("invalid_response"),
			options.status ?? 502,
			`${label} must be a string.`,
			value
		);
	}
	return value;
}

/**
 * @template {string} TCode
 * @param {unknown} value
 * @param {string} label
 * @param {{ errorCode?: TCode; status?: number }} [options]
 * @returns {number}
 */
export function assertNumber(value, label, options = {}) {
	if (typeof value !== "number" || Number.isNaN(value)) {
		throw createDomainError(
			options.errorCode ?? /** @type {TCode} */ ("invalid_response"),
			options.status ?? 502,
			`${label} must be a number.`,
			value
		);
	}
	return value;
}

/**
 * @template {string} TCode
 * @param {unknown} value
 * @param {string} label
 * @param {{ errorCode?: TCode; status?: number }} [options]
 * @returns {string | null}
 */
export function assertNullableString(value, label, options = {}) {
	if (value == null) return null;
	if (typeof value !== "string") {
		throw createDomainError(
			options.errorCode ?? /** @type {TCode} */ ("invalid_response"),
			options.status ?? 502,
			`${label} must be a string when provided.`,
			value
		);
	}
	return value;
}

/**
 * @template {string} TCode
 * @param {unknown} value
 * @param {string} label
 * @param {{ errorCode?: TCode; status?: number }} [options]
 * @returns {unknown[]}
 */
export function assertArray(value, label, options = {}) {
	if (!Array.isArray(value)) {
		throw createDomainError(
			options.errorCode ?? /** @type {TCode} */ ("invalid_response"),
			options.status ?? 502,
			`${label} must be an array.`,
			value
		);
	}
	return value;
}
