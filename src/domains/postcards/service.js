import { getApiUrl } from "../../core/env/server.js";
import { asHttpFailure, buildApiUrl, createHttpFailureMapper } from "../../core/domain/http.js";
import { coerceDomainError } from "../../core/domain/errors.js";
import { requestJson } from "../../core/http/client.js";
import { assertPostcardDetailPayload, assertPostcardListPage } from "./contracts.js";
import { mapPostcardCard, mapPostcardDetail } from "./mappers.js";

export const POSTCARDS_PAGE_SIZE = 12;
const SORT_OPTIONS = new Set(["", "-updated_at", "-like_count", "-views", "-comment_count"]);

const postcardHttpFailureMapper = createHttpFailureMapper({
	fallbackCode: "upstream_error",
	fallbackMessage: "Failed to load postcards.",
	network: { code: "network_error", message: "Postcards are temporarily unavailable." },
	invalidResponse: { code: "invalid_response", message: "The postcards service returned an invalid response." },
	statusMap: { 404: { code: "not_found", message: "Postcard not found." } }
});

/**
 * @param {import("../../core/http/client.js").HttpFailure} failure
 * @param {string} fallbackMessage
 * @returns {import("./types.js").PostcardDomainError}
 */
function mapHttpFailure(failure, fallbackMessage) {
	return /** @type {import("./types.js").PostcardDomainError} */ (
		postcardHttpFailureMapper(failure, { fallbackMessage })
	);
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").PostcardDomainError}
 */
function asPostcardDomainError(value) {
	return /** @type {import("./types.js").PostcardDomainError} */ (coerceDomainError(value, {
		missingEnvCode: "missing_env",
		fallbackCode: "upstream_error",
		fallbackMessage: "Unexpected postcards domain failure."
	}));
}

/**
 * @param {unknown} value
 * @param {number} maxLength
 * @returns {string}
 */
function filterText(value, maxLength) {
	return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

/**
 * @param {Record<string, unknown>} params
 * @returns {import("./types.js").PostcardDirectoryFilters}
 */
export function normalizePostcardDirectoryFilters(params = {}) {
	const requestedPage = Number(params.page);
	const sortBy = filterText(params.sort_by ?? params.sortBy, 32);
	return {
		q: filterText(params.q ?? params.search, 120),
		category: filterText(params.category, 48),
		tag: filterText(params.tag, 48),
		sortBy: SORT_OPTIONS.has(sortBy) ? sortBy : "",
		page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, 10_000) : 1
	};
}

/**
 * @param {string | null} value
 * @param {string} apiUrl
 * @returns {number | null}
 */
function pageNumberFromUrl(value, apiUrl) {
	if (!value) return null;
	try {
		const page = Number(new URL(value, apiUrl).searchParams.get("page"));
		return Number.isSafeInteger(page) && page > 0 ? page : null;
	} catch {
		return null;
	}
}

/**
 * @param {Record<string, string | number>} params
 * @param {typeof fetch} fetchFn
 * @param {string} apiUrl
 */
async function requestPostcardPage(params, fetchFn, apiUrl) {
	const response = await requestJson(buildApiUrl("postcards/list", params, apiUrl), { fetchFn });
	if (!response.ok) return response;
	return { ...response, data: assertPostcardListPage(response.data) };
}

/**
 * @param {Record<string, unknown>} params
 * @param {import("./types.js").PostcardFetchDeps} deps
 * @returns {Promise<import("./types.js").PostcardResult<import("./types.js").PostcardDirectoryPage>>}
 */
export async function loadPostcardDirectoryPage(params, { fetch }) {
	try {
		const apiUrl = getApiUrl();
		const filters = normalizePostcardDirectoryFilters(params);
		/** @type {Record<string, string | number>} */
		const apiParams = { page: filters.page, page_size: POSTCARDS_PAGE_SIZE };
		if (filters.q) apiParams.q = filters.q;
		if (filters.category) apiParams.category = filters.category;
		if (filters.tag) apiParams.tag = filters.tag;
		if (filters.sortBy) apiParams.sort_by = filters.sortBy;

		const response = await requestPostcardPage(apiParams, fetch, apiUrl);
		if (!response.ok) {
			return { ok: false, error: mapHttpFailure(asHttpFailure(response), "Failed to load postcards.") };
		}

		const results = response.data.results.map((postcard) => mapPostcardCard(postcard, { apiUrl }));
		const categories = results.map((postcard) => postcard.category?.name ?? "").filter(Boolean);
		const tags = results.flatMap((postcard) => postcard.tags.map((tag) => tag.name));
		if (filters.category) categories.push(filters.category);
		if (filters.tag) tags.push(filters.tag);

		return {
			ok: true,
			data: {
				count: response.data.count,
				page: filters.page,
				pageSize: POSTCARDS_PAGE_SIZE,
				totalPages: Math.max(1, Math.ceil(response.data.count / POSTCARDS_PAGE_SIZE)),
				nextPage: pageNumberFromUrl(response.data.next, apiUrl),
				previousPage: pageNumberFromUrl(response.data.previous, apiUrl),
				results,
				filters,
				availableCategories: [...new Set(categories)].sort((a, b) => a.localeCompare(b)),
				availableTags: [...new Set(tags)].sort((a, b) => a.localeCompare(b))
			},
			status: response.status,
			headers: response.headers
		};
	} catch (error) {
		return { ok: false, error: asPostcardDomainError(error) };
	}
}

/**
 * @param {number | string} postcardId
 * @param {import("./types.js").PostcardFetchDeps} deps
 * @returns {Promise<import("./types.js").PostcardResult<import("./types.js").PostcardDetail>>}
 */
export async function loadPostcardDetail(postcardId, { fetch }) {
	try {
		const apiUrl = getApiUrl();
		const response = await requestJson(buildApiUrl(`postcards/${encodeURIComponent(String(postcardId))}`, {}, apiUrl), {
			fetchFn: fetch
		});
		if (!response.ok) {
			return { ok: false, error: mapHttpFailure(asHttpFailure(response), "Failed to load this postcard.") };
		}
		return {
			ok: true,
			data: mapPostcardDetail(assertPostcardDetailPayload(response.data), { apiUrl }),
			status: response.status,
			headers: response.headers
		};
	} catch (error) {
		return { ok: false, error: asPostcardDomainError(error) };
	}
}

/**
 * @param {number | string} postcardId
 * @param {import("./types.js").PostcardFetchDeps} deps
 * @returns {Promise<import("./types.js").PostcardResult<import("./types.js").PostcardDetailPage>>}
 */
export async function loadPostcardDetailPage(postcardId, { fetch }) {
	const detailResult = await loadPostcardDetail(postcardId, { fetch });
	if (!detailResult.ok) return detailResult;

	try {
		const apiUrl = getApiUrl();
		const postcard = detailResult.data;
		/** @type {Record<string, string | number>} */
		const relatedParams = { page_size: 4 };
		if (postcard.category?.name) relatedParams.category = postcard.category.name;
		else if (postcard.tags[0]?.name) relatedParams.tag = postcard.tags[0].name;

		const relatedResponse = await requestPostcardPage(relatedParams, fetch, apiUrl);
		const relatedPostcards = relatedResponse.ok
			? relatedResponse.data.results
				.map((item) => mapPostcardCard(item, { apiUrl }))
				.filter((item) => String(item.id) !== String(postcard.id))
				.slice(0, 3)
			: [];

		return {
			ok: true,
			data: { postcard, relatedPostcards },
			status: detailResult.status,
			headers: detailResult.headers
		};
	} catch {
		// Related content is an enhancement and must not make a valid article unavailable.
		return {
			ok: true,
			data: { postcard: detailResult.data, relatedPostcards: [] },
			status: detailResult.status,
			headers: detailResult.headers
		};
	}
}
