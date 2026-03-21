import { createHttpClientError } from "./errors.js";

/**
 * @template T
 * @typedef {{
 *   ok: true;
 *   status: number;
 *   headers: Headers;
 *   data: T | null;
 * }} HttpSuccess
 */

/**
 * @typedef {{
 *   ok: false;
 *   status: number;
 *   headers: Headers;
 *   error: import("./errors.js").HttpClientError;
 * }} HttpFailure
 */

/**
 * @template T
 * @typedef {HttpSuccess<T> | HttpFailure} HttpResult
 */

/**
 * @param {unknown} body
 * @returns {boolean}
 */
function isJsonSerializableBody(body) {
	if (!body) return false;
	if (typeof body !== "object") return false;
	if (body instanceof FormData) return false;
	if (body instanceof URLSearchParams) return false;
	if (body instanceof Blob) return false;
	if (body instanceof ArrayBuffer) return false;
	return true;
}

/**
 * @param {Response} response
 * @returns {Promise<{ isJson: boolean; value: unknown }>}
 */
async function parseResponseBody(response) {
	if (response.status === 204 || response.status === 205) {
		return { isJson: true, value: null };
	}

	const contentType = response.headers.get("content-type") ?? "";
	const text = await response.text();
	if (!text) return { isJson: true, value: null };

	if (contentType.includes("application/json")) {
		try {
			return { isJson: true, value: JSON.parse(text) };
		} catch (err) {
			return { isJson: false, value: text };
		}
	}

	return { isJson: false, value: text };
}


/**
 * @template T
 * @param {string} url
 * @param {(Omit<RequestInit, "body"> & { body?: unknown; fetchFn?: typeof fetch; expectJson?: boolean })} [options]
 * @returns {Promise<HttpResult<T>>}
 */
export async function requestJson(url, options = {}) {
	const { fetchFn = fetch, expectJson = true, ...rest } = options;
	const headers = new Headers(rest.headers ?? {});

	if (!headers.has("Accept")) {
		headers.set("Accept", "application/json");
	}

	const rawBody = rest.body;
	/** @type {BodyInit | null | undefined} */
	let body = /** @type {BodyInit | null | undefined} */ (rawBody);
	if (isJsonSerializableBody(rawBody)) {
		if (!headers.has("Content-Type")) {
			headers.set("Content-Type", "application/json");
		}
		body = JSON.stringify(rawBody);
	}

	/** @type {Response} */
	let response;
	try {
		response = await fetchFn(url, { ...rest, headers, body });
	} catch (err) {
		return {
			ok: false,
			status: 0,
			headers: new Headers(),
			error: createHttpClientError({
				code: "network_error",
				status: 0,
				message: `Network error while requesting ${url}`,
				details: err
			})
		};
	}

	const parsed = await parseResponseBody(response);

	if (!response.ok) {
		return {
			ok: false,
			status: response.status,
			headers: response.headers,
			error: createHttpClientError({
				code: "upstream_http_error",
				status: response.status,
				message: `Upstream request failed (${response.status}) for ${url}`,
				details: parsed.value
			})
		};
	}

	if (expectJson && !parsed.isJson) {
		return {
			ok: false,
			status: response.status,
			headers: response.headers,
			error: createHttpClientError({
				code: "invalid_json_response",
				status: response.status,
				message: `Expected JSON response from ${url}`,
				details: parsed.value
			})
		};
	}

	return {
		ok: true,
		status: response.status,
		headers: response.headers,
		data: /** @type {T | null} */ (parsed.value)
	};
}
