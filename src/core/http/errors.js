/**
 * @typedef {"network_error" | "upstream_http_error" | "invalid_json_response"} HttpClientErrorCode
 */

/**
 * Structured error type for upstream HTTP failures.
 */
export class HttpClientError extends Error {
	/**
	 * @param {HttpClientErrorCode} code
	 * @param {number} status
	 * @param {string} message
	 * @param {unknown} [details]
	 */
	constructor(code, status, message, details) {
		super(message);
		this.name = "HttpClientError";
		this.code = code;
		this.status = status;
		this.details = details;
	}
}

/**
 * @param {{ code: HttpClientErrorCode; status: number; message: string; details?: unknown }} params
 * @returns {HttpClientError}
 */
export function createHttpClientError(params) {
	return new HttpClientError(params.code, params.status, params.message, params.details);
}
