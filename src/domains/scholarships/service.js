import { getApiUrl } from "../../core/env/server.js";
import {
	asHttpFailure,
	buildApiUrl,
	collectPaginatedItems,
	createHttpFailureMapper,
	normalizeNextPageUrl,
	withBearerAuth
} from "../../core/domain/http.js";
import { coerceDomainError } from "../../core/domain/errors.js";
import { requestJson } from "../../core/http/client.js";
import { assertScholarshipDetailPayload, assertScholarshipListPayload } from "./contracts.js";
import { mapScholarshipCard, mapScholarshipDetail } from "./mappers.js";

const scholarshipHttpFailureMapper = createHttpFailureMapper({
	fallbackCode: "upstream_error",
	fallbackMessage: "Failed to load scholarships.",
	network: {
		code: "network_error",
		message: "Scholarships upstream is unreachable."
	},
	invalidResponse: {
		code: "invalid_response",
		message: "Scholarships upstream returned invalid JSON."
	},
	statusMap: {
		404: {
			code: "not_found",
			message: "Scholarship not found."
		}
	}
});

const mapHttpFailure = /** @type {(failure: import("../../core/http/client.js").HttpFailure, fallbackMessage: string) => import("./types.js").ScholarshipDomainError} */ (
	(failure, fallbackMessage) =>
		/** @type {import("./types.js").ScholarshipDomainError} */ (
			scholarshipHttpFailureMapper(failure, { fallbackMessage })
		)
);

/**
 * @param {unknown} value
 * @returns {import("./types.js").ScholarshipDomainError}
 */
function asDomainError(value) {
	return /** @type {import("./types.js").ScholarshipDomainError} */ (
		coerceDomainError(value, {
			missingEnvCode: "missing_env",
			fallbackCode: "upstream_error",
			fallbackMessage: "Unexpected scholarship domain failure."
		})
	);
}

/**
 * @param {import("./types.js").ScholarshipFetchDeps} deps
 * @param {Record<string, string | number | null | undefined>} [params]
 * @returns {Promise<import("./types.js").ScholarshipServiceResult<import("./types.js").ScholarshipCard[]>>}
 */
export async function loadScholarshipDirectory({ fetch }, params = {}) {
	try {
		const apiUrl = getApiUrl();
		const collection = await collectPaginatedItems({
			fetch,
			initialUrl: buildApiUrl("scholarships/", params),
			parsePage: (data) => assertScholarshipListPayload(data),
			getItems: (page) => page.items.map(mapScholarshipCard),
			getNextUrl: (page) => normalizeNextPageUrl(page.next, apiUrl)
		});

		if (!collection.ok) {
			return {
				ok: false,
				error: mapHttpFailure(collection.error, "Failed to load scholarships.")
			};
		}

		return {
			ok: true,
			data: collection.data,
			status: collection.status,
			headers: collection.headers
		};
	} catch (error) {
		return {
			ok: false,
			error: asDomainError(error)
		};
	}
}

/**
 * @param {number | string} scholarshipId
 * @param {import("./types.js").ScholarshipFetchDeps & { accessToken?: string | null }} deps
 * @returns {Promise<import("./types.js").ScholarshipServiceResult<import("./types.js").ScholarshipDetail>>}
 */
export async function loadScholarshipDetail(scholarshipId, { fetch, accessToken = null }) {
	try {
		const fullDetailUrl = buildApiUrl(`scholarships/${scholarshipId}`);
		const previewUrl = buildApiUrl(`scholarships/${scholarshipId}/preview`);

		const response = accessToken
			? await requestJson(fullDetailUrl, {
				fetchFn: fetch,
				headers: withBearerAuth(accessToken)
			})
			: await requestJson(previewUrl, {
				fetchFn: fetch
			});

		if (!response.ok && accessToken) {
			const previewResponse = await requestJson(previewUrl, {
				fetchFn: fetch
			});
			if (!previewResponse.ok) {
				return {
					ok: false,
					error: mapHttpFailure(asHttpFailure(previewResponse), "Failed to load scholarship details.")
				};
			}

			return {
				ok: true,
				data: mapScholarshipDetail(assertScholarshipDetailPayload(previewResponse.data)),
				status: previewResponse.status,
				headers: previewResponse.headers
			};
		}

		if (!response.ok) {
			return {
				ok: false,
				error: mapHttpFailure(asHttpFailure(response), "Failed to load scholarship details.")
			};
		}

		return {
			ok: true,
			data: mapScholarshipDetail(assertScholarshipDetailPayload(response.data)),
			status: response.status,
			headers: response.headers
		};
	} catch (error) {
		return {
			ok: false,
			error: asDomainError(error)
		};
	}
}

/**
 * @param {number | string} scholarshipId
 * @param {import("./types.js").ScholarshipFetchDeps & { accessToken?: string | null }} deps
 * @returns {Promise<import("./types.js").ScholarshipServiceResult<{ scholarship: import("./types.js").ScholarshipDetail, similarScholarships: import("./types.js").ScholarshipCard[] }>>}
 */
export async function loadScholarshipDetailPage(scholarshipId, { fetch, accessToken = null }) {
	const detailResult = await loadScholarshipDetail(scholarshipId, {
		fetch,
		accessToken
	});
	if (!detailResult.ok) {
		return detailResult;
	}

	const primaryCategory = detailResult.data.categories[0] ?? null;
	const listResult = await loadScholarshipDirectory({ fetch }, primaryCategory ? { category: primaryCategory } : {});

	return {
		ok: true,
		data: {
			scholarship: detailResult.data,
			similarScholarships: listResult.ok
				? listResult.data.filter((item) => item.id !== detailResult.data.id).slice(0, 3)
				: []
		},
		status: detailResult.status,
		headers: detailResult.headers
	};
}
