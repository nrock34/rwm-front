import { assertArray, assertObject as assertBaseObject } from "../../core/domain/contracts.js";
import { coerceDomainError, createDomainError } from "../../core/domain/errors.js";

/**
 * @param {unknown} value
 * @param {string} label
 * @returns {number | string}
 */
function assertIdLike(value, label) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim().length > 0) return value;
	throw createDomainError("invalid_response", 502, `${label} must be a string or number.`, value);
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertProgramSummary(value) {
	const program = assertBaseObject(value, "program");
	assertIdLike(program.id, "program.id");
	return program;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertProgramDetailPayload(value) {
	return assertProgramSummary(value);
}

/**
 * @param {unknown} value
 * @returns {{ results: Record<string, unknown>[]; next: string | null; previous: string | null }}
 */
export function assertProgramListPage(value) {
	if (Array.isArray(value)) {
		return {
			results: value.map(assertProgramSummary),
			next: null,
			previous: null
		};
	}

	const page = assertBaseObject(value, "program list page");
	const results = assertArray(page.results, "program list page.results");

	return {
		results: results.map(assertProgramSummary),
		next: typeof page.next === "string" ? page.next : null,
		previous: typeof page.previous === "string" ? page.previous : null
	};
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>[]}
 */
export function assertProgramCountriesPayload(value) {
	return assertArray(value, "program countries").map((item) => {
		const entry = assertBaseObject(item, "program country");
		if (typeof entry.country !== "string" || entry.country.trim().length === 0) {
			throw createDomainError("invalid_response", 502, "program country.country must be a string.", entry.country);
		}
		return entry;
	});
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").ProgramDomainError}
 */
export function asDomainError(value) {
	return /** @type {import("./types.js").ProgramDomainError} */ (
		coerceDomainError(value, {
			missingEnvCode: "missing_env",
			fallbackCode: "upstream_error",
			fallbackMessage: "Unexpected programs domain failure."
		})
	);
}
