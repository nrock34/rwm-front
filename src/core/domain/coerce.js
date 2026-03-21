/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
export function isObject(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function textOrEmpty(value) {
	return typeof value === "string" ? value : "";
}

/**
 * @param {unknown} value
 * @returns {number}
 */
export function toFiniteNumber(value) {
	const number = typeof value === "number" ? value : Number(value);
	return Number.isFinite(number) ? number : 0;
}

/**
 * @param {unknown} value
 * @returns {number | null}
 */
export function toNullableFiniteNumber(value) {
	const number = typeof value === "number" ? value : Number(value);
	return Number.isFinite(number) ? number : null;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown> | null}
 */
export function objectOrNull(value) {
	return isObject(value) ? value : null;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function objectOrEmpty(value) {
	return isObject(value) ? value : {};
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function stringArray(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean);
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>[]}
 */
export function objectArray(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((item) => isObject(item));
}

/**
 * @param {string} value
 * @returns {string}
 */
export function toTitleCase(value) {
	return value
		.split(/[-_\s]+/u)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
		.join(" ");
}
