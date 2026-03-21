import { getApiUrl } from "../../core/env/server.js";
import {
	asHttpFailure,
	buildApiUrl,
	collectPaginatedItems,
	createHttpFailureMapper,
	normalizeNextPageUrl
} from "../../core/domain/http.js";
import { coerceDomainError } from "../../core/domain/errors.js";
import { requestJson } from "../../core/http/client.js";
import { assertResourceDetail, assertResourceListPage } from "./contracts.js";
import { mapResourceCard, mapResourceDetail } from "./mappers.js";

const resourceHttpFailureMapper = createHttpFailureMapper({
	fallbackCode: "upstream_error",
	fallbackMessage: "Failed to load resources.",
	network: {
		code: "network_error",
		message: "Resources upstream is unreachable."
	},
	invalidResponse: {
		code: "invalid_response",
		message: "Resources upstream returned invalid JSON."
	},
	statusMap: {
		404: {
			code: "not_found",
			message: "Resource not found."
		}
	}
});

const mapHttpFailure = /** @type {(failure: import("../../core/http/client.js").HttpFailure, fallbackMessage: string) => import("./types.js").ResourceDomainError} */ (
	(failure, fallbackMessage) =>
		/** @type {import("./types.js").ResourceDomainError} */ (
			resourceHttpFailureMapper(failure, { fallbackMessage })
		)
);

/**
 * @param {unknown} value
 * @returns {import("./types.js").ResourceDomainError}
 */
function asResourceDomainError(value) {
	return /** @type {import("./types.js").ResourceDomainError} */ (
		coerceDomainError(value, {
			missingEnvCode: "missing_env",
			fallbackCode: "upstream_error",
			fallbackMessage: "Unexpected resource domain failure."
		})
	);
}

/**
 * @param {string} path
 * @param {import("./types.js").ResourceFetchDeps} deps
 * @param {string} apiUrl
 * @param {Record<string, string>} [params]
 * @returns {Promise<import("./types.js").ResourceResult<Record<string, unknown>[]>>}
 */
async function loadResourceCollection(path, { fetch }, apiUrl, params = {}) {
	try {
		const collection = await collectPaginatedItems({
			fetch,
			initialUrl: buildApiUrl(path, {
				page_size: 40,
				...params
			}),
			parsePage: (data) => assertResourceListPage(data),
			getItems: (page) => page.results,
			getNextUrl: (page) => normalizeNextPageUrl(page.next, apiUrl)
		});

		if (!collection.ok) {
			return {
				ok: false,
				error: mapHttpFailure(collection.error, "Failed to load resources.")
			};
		}

		return {
			ok: true,
			data: collection.data,
			status: collection.status,
			headers: collection.headers
		};
	} catch (err) {
		return {
			ok: false,
			error: asResourceDomainError(err)
		};
	}
}

/**
 * @param {string} apiCategory
 * @param {import("./types.js").ResourceFetchDeps} deps
 * @param {string} apiUrl
 * @returns {Promise<import("./types.js").ResourceResult<import("./types.js").ResourceCard[]>>}
 */
async function loadRelatedResourceCollection(apiCategory, deps, apiUrl) {
	const collectionResult = await loadResourceCollection("resources/list", deps, apiUrl, {
		category: apiCategory
	});
	if (!collectionResult.ok) {
		return collectionResult;
	}

	return {
		ok: true,
		data: collectionResult.data.map((resource) => mapResourceCard(resource, { apiUrl })),
		status: collectionResult.status,
		headers: collectionResult.headers
	};
}

/**
 * @param {import("./types.js").ResourceFetchDeps} deps
 * @returns {Promise<import("./types.js").ResourceResult<import("./types.js").ResourceCollections>>}
 */
export async function loadResourceCollections(deps) {
	try {
		const apiUrl = getApiUrl();
		const collectionResult = await loadResourceCollection("resources/list", deps, apiUrl);
		if (!collectionResult.ok) {
			return collectionResult;
		}

		/** @type {import("./types.js").ResourceCollections} */
		const collections = {};
		for (const resource of collectionResult.data.map((item) => mapResourceCard(item, { apiUrl }))) {
			const bucket = collections[resource.category] ?? [];
			bucket.push(resource);
			collections[resource.category] = bucket;
		}

		return {
			ok: true,
			data: collections,
			status: 200,
			headers: new Headers()
		};
	} catch (err) {
		return {
			ok: false,
			error: asResourceDomainError(err)
		};
	}
}

/**
 * @param {number} resourceId
 * @param {import("./types.js").ResourceFetchDeps} deps
 * @returns {Promise<import("./types.js").ResourceResult<import("./types.js").ResourceDetail>>}
 */
export async function loadResourceDetail(resourceId, { fetch }) {
	try {
		const apiUrl = getApiUrl();
		const response = await requestJson(buildApiUrl(`resources/${resourceId}`), {
			fetchFn: fetch
		});

		if (!response.ok) {
			return {
				ok: false,
				error: mapHttpFailure(asHttpFailure(response), "Failed to load resource details.")
			};
		}

		return {
			ok: true,
			data: mapResourceDetail(assertResourceDetail(response.data), { apiUrl }),
			status: response.status,
			headers: response.headers
		};
	} catch (err) {
		return {
			ok: false,
			error: asResourceDomainError(err)
		};
	}
}

/**
 * @param {number} resourceId
 * @param {import("./types.js").ResourceFetchDeps} deps
 * @returns {Promise<import("./types.js").ResourceResult<import("./types.js").ResourceDetailPageData>>}
 */
export async function loadResourceDetailPage(resourceId, { fetch }) {
	const resourceResult = await loadResourceDetail(resourceId, { fetch });
	if (!resourceResult.ok) {
		return resourceResult;
	}

	try {
		const apiUrl = getApiUrl();
		const relatedResult = await loadRelatedResourceCollection(resourceResult.data.apiCategory, { fetch }, apiUrl);
		const relatedResources = relatedResult.ok
			? relatedResult.data.filter((item) => item.id !== resourceResult.data.id).slice(0, 3)
			: [];

		return {
			ok: true,
			data: {
				resource: resourceResult.data,
				relatedResources
			},
			status: resourceResult.status,
			headers: resourceResult.headers
		};
	} catch (err) {
		return {
			ok: false,
			error: asResourceDomainError(err)
		};
	}
}
