export const ONBOARDING_STORAGE_KEYS = Object.freeze({
	academicFields: "acd_bck_fields",
	academicStep: "onboarding_academic_step"
});

/**
 * @param {string} key
 * @param {unknown} value
 */
export function writeStoredJson(key, value) {
	if (typeof window === "undefined") return;
	window.sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * @template T
 * @param {string} key
 * @returns {T | null}
 */
export function readStoredJson(key) {
	if (typeof window === "undefined") return null;

	const storedValue = window.sessionStorage.getItem(key);
	if (!storedValue) return null;

	try {
		return /** @type {T} */ (JSON.parse(storedValue));
	} catch {
		return null;
	}
}

/**
 * @param {string} key
 */
export function removeStoredValue(key) {
	if (typeof window === "undefined") return;
	window.sessionStorage.removeItem(key);
}
