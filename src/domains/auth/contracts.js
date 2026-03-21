import { getApiUrl, getAuthJwtSecret, getCookieSecret, MissingEnvError } from "../../core/env/server.js";
import { assertObject } from "../../core/domain/contracts.js";
import { coerceDomainError, createDomainError } from "../../core/domain/errors.js";

/**
 * @returns {{ apiUrl: string; cookieSecret: string; jwtSecret: string }}
 */
export function assertRequiredAuthEnv() {
	try {
			const apiUrl = getApiUrl();
			const cookieSecret = getCookieSecret({ allowInsecureFallback: true });
			const jwtSecret = getAuthJwtSecret({ allowInsecureFallback: true });
			return { apiUrl, cookieSecret, jwtSecret };
		} catch (err) {
			if (err instanceof MissingEnvError) {
				throw createDomainError("missing_env", 500, err.message, { envName: err.envName });
			}
			throw err;
		}
}

/**
 * @param {unknown} payload
 * @returns {asserts payload is import("./types.js").AuthLoginPayload}
 */
export function assertLoginPayload(payload) {
	const candidate = assertObject(payload, "Login payload", { errorCode: "invalid_payload", status: 400 });
	if (typeof candidate.email !== "string" || candidate.email.length === 0) {
		throw createDomainError("invalid_payload", 400, "Login payload is missing a valid email.");
	}
	if (typeof candidate.password !== "string" || candidate.password.length === 0) {
		throw createDomainError("invalid_payload", 400, "Login payload is missing a valid password.");
	}
}

/**
 * @param {unknown} payload
 * @returns {asserts payload is import("./types.js").AuthSignupPayload}
 */
export function assertSignupPayload(payload) {
	const candidate = assertObject(payload, "Signup payload", { errorCode: "invalid_payload", status: 400 });

	const requiredFields = ["first_name", "last_name", "username", "email", "password"];
	for (const field of requiredFields) {
		if (typeof candidate[field] !== "string" || candidate[field].length === 0) {
			throw createDomainError("invalid_payload", 400, `Signup payload is missing a valid ${field}.`);
		}
	}
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").AuthLoginResponse}
 */
export function assertLoginResponse(value) {
	const payload = assertObject(value, "login response");
	if (typeof payload.acs_tkn !== "string" || payload.acs_tkn.length === 0) {
		throw createDomainError("invalid_response", 502, "Login response is missing a valid access token.", value);
	}

	return /** @type {import("./types.js").AuthLoginResponse} */ (value);
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").AuthRefreshResponse}
 */
export function assertRefreshResponse(value) {
	const payload = assertObject(value, "refresh response");
	if (typeof payload.acs_tkn !== "string" || payload.acs_tkn.length === 0) {
		throw createDomainError("invalid_response", 502, "Refresh response is missing a valid access token.", value);
	}

	return /** @type {import("./types.js").AuthRefreshResponse} */ (value);
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").AuthLogoutResponse}
 */
export function assertLogoutResponse(value) {
	if (value == null) {
		return { detail: "Logged out successfully." };
	}

	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return { detail: "Logged out successfully." };
	}

	const payload = /** @type {Record<string, unknown>} */ (value);
	if (typeof payload.detail !== "string" && payload.detail != null) {
		throw createDomainError("invalid_response", 502, "Logout response detail must be a string when provided.", value);
	}

	return /** @type {import("./types.js").AuthLogoutResponse} */ (value);
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").AuthDomainError}
 */
export function asDomainError(value) {
	return /** @type {import("./types.js").AuthDomainError} */ (
		coerceDomainError(value, {
			missingEnvCode: "missing_env",
			fallbackCode: "upstream_error",
			fallbackMessage: "Unexpected auth domain failure."
		})
	);
}
