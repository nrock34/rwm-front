import { assertArray, assertObject } from "../../core/domain/contracts.js";
import { coerceDomainError } from "../../core/domain/errors.js";

/**
 * @param {unknown} value
 * @returns {{ items: Record<string, unknown>[], next: string | null }}
 */
export function assertScholarshipListPayload(value) {
	if (Array.isArray(value)) {
		return {
			items: value.map((item, index) => assertObject(item, `scholarship[${index}]`)),
			next: null
		};
	}

	const payload = assertObject(value, "scholarship list payload");
	const results = /** @type {Record<string, unknown>[]} */ (
		assertArray(payload.results, "scholarship list payload.results")
	);

	return {
		items: results.map((item, index) => assertObject(item, `scholarship.results[${index}]`)),
		next: typeof payload.next === "string" && payload.next.length > 0 ? payload.next : null
	};
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertScholarshipDetailPayload(value) {
	return assertObject(value, "scholarship detail payload");
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").ScholarshipDomainError}
 */
export function asScholarshipDomainError(value) {
	return /** @type {import("./types.js").ScholarshipDomainError} */ (
		coerceDomainError(value, {
			missingEnvCode: "missing_env",
			fallbackCode: "upstream_error",
			fallbackMessage: "Unexpected scholarship domain failure."
		})
	);
}
