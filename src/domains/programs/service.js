import { getApiUrl } from "../../core/env/server.js";
import {
	asHttpFailure,
	buildApiUrl,
	createHttpFailureMapper,
	extractCursor
} from "../../core/domain/http.js";
import { coerceDomainError, createDomainError } from "../../core/domain/errors.js";
import { requestJson } from "../../core/http/client.js";
import { assertProgramCountriesPayload, assertProgramDetailPayload, assertProgramListPage } from "./contracts.js";
import { getProgramDetailMissingFields, mapProgramCard, mapProgramCountryOption, mapProgramDetail } from "./mappers.js";

const programHttpFailureMapper = createHttpFailureMapper({
	fallbackCode: "upstream_error",
	fallbackMessage: "Failed to load program data.",
	network: {
		code: "network_error",
		message: "Programs upstream is unreachable."
	},
	invalidResponse: {
		code: "invalid_response",
		message: "Programs upstream returned invalid JSON."
	},
	statusMap: {
		404: {
			code: "not_found",
			message: "Program not found."
		}
	}
});

const mapHttpFailure = /** @type {(failure: import("../../core/http/client.js").HttpFailure, fallbackMessage: string) => import("./types.js").ProgramDomainError} */ (
	(failure, fallbackMessage) =>
		/** @type {import("./types.js").ProgramDomainError} */ (
			programHttpFailureMapper(failure, { fallbackMessage })
		)
);

/**
 * @param {unknown} value
 * @returns {import("./types.js").ProgramDomainError}
 */
function asProgramDomainError(value) {
	return /** @type {import("./types.js").ProgramDomainError} */ (
		coerceDomainError(value, {
			missingEnvCode: "missing_env",
			fallbackCode: "upstream_error",
			fallbackMessage: "Unexpected programs domain failure."
		})
	);
}

/**
 * @param {import("./types.js").ProgramErrorCode} code
 * @param {string} message
 * @param {Partial<import("./types.js").ProgramDomainError>} [extra]
 * @returns {import("./types.js").ProgramDomainError}
 */
function makeError(code, message, extra = {}) {
	return createDomainError(code, extra.status ?? 500, message, extra.details);
}

/**
 * @template TResult
 * @param {{
 *   fetch: typeof fetch;
 *   path: string;
 *   params?: Record<string, string | number | null | undefined>;
 *   fallbackMessage: string;
 *   mapData: (value: unknown, response: import("../../core/http/client.js").HttpSuccess<unknown>) => TResult | Promise<TResult>;
 * }} options
 * @returns {Promise<{ ok: true; data: TResult; status: number; headers: Headers } | { ok: false; error: import("./types.js").ProgramDomainError }>}
 */
async function loadProgramData(options) {
	try {
		const response = await requestJson(buildApiUrl(options.path, options.params), {
			fetchFn: options.fetch
		});

		if (!response.ok) {
			return {
				ok: false,
				error: mapHttpFailure(asHttpFailure(response), options.fallbackMessage)
			};
		}

		return {
			ok: true,
			data: await options.mapData(response.data, response),
			status: response.status,
			headers: response.headers
		};
	} catch (error) {
		return {
			ok: false,
			error: asProgramDomainError(error)
		};
	}
}

/**
 * @param {number | null} universityId
 * @param {import("./types.js").ProgramFetchDeps} deps
 * @returns {Promise<Record<string, unknown> | null>}
 */
async function loadUniversityDetail(universityId, { fetch }) {
	if (!universityId) return null;

	const response = await requestJson(buildApiUrl(`universities/${universityId}`), {
		fetchFn: fetch
	});

	if (!response.ok) return null;
	if (!response.data || typeof response.data !== "object" || Array.isArray(response.data)) return null;

	return /** @type {Record<string, unknown>} */ (response.data);
}

/**
 * @param {import("./types.js").ProgramFetchDeps} deps
 * @param {Record<string, string | number | null | undefined>} [params]
 * @returns {Promise<import("./types.js").ProgramResult<import("./types.js").ProgramDirectoryPage>>}
 */
export async function loadProgramDirectoryPage({ fetch }, params = {}) {
	const apiUrl = getApiUrl();
	return loadProgramData({
		fetch,
		path: "programs/list",
		params,
		fallbackMessage: "Failed to load programs.",
		mapData: (value) => {
			const page = assertProgramListPage(value);
			return {
				next: extractCursor(page.next, apiUrl),
				prev: extractCursor(page.previous, apiUrl),
				results: page.results.map(mapProgramCard)
			};
		}
	});
}

/**
 * @param {import("./types.js").ProgramFetchDeps} deps
 * @returns {Promise<import("./types.js").ProgramResult<import("./types.js").ProgramCountryOption[]>>}
 */
export async function loadProgramCountries({ fetch }) {
	return loadProgramData({
		fetch,
		path: "programs/countries",
		fallbackMessage: "Failed to load program countries.",
		mapData: (value) => assertProgramCountriesPayload(value).map(mapProgramCountryOption)
	});
}

/**
 * @param {number | string} programId
 * @param {import("./types.js").ProgramFetchDeps} deps
 * @returns {Promise<import("./types.js").ProgramResult<import("./types.js").ProgramDetail>>}
 */
export async function loadProgramDetail(programId, { fetch }) {
	const result = await loadProgramData({
		fetch,
		path: `programs/${programId}`,
		fallbackMessage: "Failed to load program details.",
		mapData: async (value) => {
			const rawProgram = assertProgramDetailPayload(value);
			const provider = rawProgram.provider && typeof rawProgram.provider === "object"
				? /** @type {Record<string, unknown>} */ (rawProgram.provider)
				: null;
			const universityId = provider ? Number(provider.university) : Number.NaN;
			const university = await loadUniversityDetail(Number.isFinite(universityId) ? universityId : null, { fetch });
			return mapProgramDetail(rawProgram, university);
		}
	});

	if (!result.ok) {
		return result;
	}

	const missingFields = getProgramDetailMissingFields(result.data);
	if (missingFields.length > 0) {
		return {
			ok: false,
			error: makeError("not_ready", "This program is not available yet.", {
				status: 404,
				details: { missingFields }
			})
		};
	}

	return result;
}

/**
 * @param {number | string} programId
 * @param {import("./types.js").ProgramFetchDeps} deps
 * @returns {Promise<import("./types.js").ProgramResult<import("./types.js").ProgramDetail>>}
 */
export async function loadProgramDetailPage(programId, deps) {
	return loadProgramDetail(programId, deps);
}
