import { resolveApiUrl } from "../env/server.js";
import { requestJson } from "../http/client.js";
import { createDomainError } from "./errors.js";

/**
 * `checkJs` does not always narrow discriminated unions in JS files.
 *
 * @template T
 * @param {import("../http/client.js").HttpResult<T>} result
 * @returns {import("../http/client.js").HttpFailure}
 */
export function asHttpFailure(result) {
	return /** @type {import("../http/client.js").HttpFailure} */ (result);
}

/**
 * @template {string} TCode
 * @param {import("../http/client.js").HttpFailure} failure
 * @param {{
 *   fallbackCode: TCode;
 *   fallbackMessage: string;
 *   network: { code: TCode; message: string; status?: number };
 *   invalidResponse: { code: TCode; message: string; status?: number };
 *   statusMap?: Record<number, { code: TCode; message: string; status?: number }>;
 * }} options
 * @returns {import("./errors.js").DomainError<TCode>}
 */
export function mapStandardHttpFailure(failure, options) {
	if (failure.error.code === "network_error") {
		return createDomainError(
			options.network.code,
			options.network.status ?? 503,
			options.network.message,
			failure.error.details
		);
	}

	if (failure.error.code === "invalid_json_response") {
		return createDomainError(
			options.invalidResponse.code,
			options.invalidResponse.status ?? 502,
			options.invalidResponse.message,
			failure.error.details
		);
	}

	const statusOverride = options.statusMap?.[failure.status];
	if (statusOverride) {
		return createDomainError(
			statusOverride.code,
			statusOverride.status ?? failure.status,
			statusOverride.message,
			failure.error.details
		);
	}

	return createDomainError(
		options.fallbackCode,
		failure.status || 502,
		options.fallbackMessage,
		failure.error.details
	);
}

/**
 * @template {string} TCode
 * @param {{
 *   fallbackCode: TCode;
 *   fallbackMessage: string;
 *   network: { code: TCode; message: string; status?: number };
 *   invalidResponse: { code: TCode; message: string; status?: number };
 *   statusMap?: Record<number, { code: TCode; message: string; status?: number }>;
 * }} options
 * @returns {(
 *   failure: import("../http/client.js").HttpFailure,
 *   overrides?: { fallbackCode?: TCode; fallbackMessage?: string }
 * ) => import("./errors.js").DomainError<TCode>}
 */
export function createHttpFailureMapper(options) {
	return (failure, overrides = {}) =>
		mapStandardHttpFailure(failure, {
			...options,
			fallbackCode: overrides.fallbackCode ?? options.fallbackCode,
			fallbackMessage: overrides.fallbackMessage ?? options.fallbackMessage
		});
}

/**
 * @param {string} path
 * @param {Record<string, string | number | boolean | null | undefined>} [params]
 * @param {string} [apiUrl]
 * @returns {string}
 */
export function buildApiUrl(path, params = {}, apiUrl) {
	const url = new URL(resolveApiUrl(path, apiUrl));
	for (const [key, value] of Object.entries(params)) {
		if (value == null) continue;
		const normalized = String(value);
		if (!normalized) continue;
		url.searchParams.set(key, normalized);
	}
	return url.toString();
}

/**
 * @param {string | null | undefined} next
 * @param {string} apiUrl
 * @returns {string | null}
 */
export function normalizeNextPageUrl(next, apiUrl) {
	if (!next) return null;
	if (/^https?:\/\//iu.test(next)) return next;
	return new URL(next, apiUrl).toString();
}

/**
 * @param {string | null | undefined} value
 * @param {string} apiUrl
 * @returns {string | null}
 */
export function extractCursor(value, apiUrl) {
	if (!value) return null;
	try {
		const nextUrl = /^https?:\/\//iu.test(value) ? new URL(value) : new URL(value, apiUrl);
		return nextUrl.searchParams.get("cursor");
	} catch {
		return null;
	}
}

/**
 * @param {string | null | undefined} accessToken
 * @param {HeadersInit} [headers]
 * @returns {Headers}
 */
export function withBearerAuth(accessToken, headers = {}) {
	const merged = new Headers(headers);
	if (accessToken) {
		merged.set("Authorization", `Bearer ${accessToken}`);
	}
	return merged;
}

/**
 * @template TPage
 * @template TItem
 * @param {{
 *   fetch: typeof fetch;
 *   initialUrl: string | null;
 *   parsePage: (data: unknown) => TPage;
 *   getItems: (page: TPage) => TItem[];
 *   getNextUrl: (page: TPage) => string | null;
 *   requestOptions?: Omit<Parameters<typeof requestJson>[1], "fetchFn">;
 * }} options
 * @returns {Promise<
 *   | { ok: true; data: TItem[]; status: number; headers: Headers }
 *   | { ok: false; error: import("../http/client.js").HttpFailure }
 * >}
 */
export async function collectPaginatedItems(options) {
	/** @type {TItem[]} */
	const items = [];
	/** @type {string | null} */
	let nextUrl = options.initialUrl;
	let headers = new Headers();
	let status = 200;

	while (nextUrl) {
		const response = await requestJson(nextUrl, {
			...options.requestOptions,
			fetchFn: options.fetch
		});

		if (!response.ok) {
			return {
				ok: false,
				error: asHttpFailure(response)
			};
		}

		headers = response.headers;
		status = response.status;
		const page = options.parsePage(response.data);
		items.push(...options.getItems(page));
		nextUrl = options.getNextUrl(page);
	}

	return {
		ok: true,
		data: items,
		status,
		headers
	};
}
