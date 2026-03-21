import jwt from "jsonwebtoken";
import { getAuthJwtSecret } from "../../core/env/server.js";
import { asHttpFailure, buildApiUrl, createHttpFailureMapper } from "../../core/domain/http.js";
import { createDomainError } from "../../core/domain/errors.js";
import { requestJson } from "../../core/http/client.js";
import { asDomainError, assertLoginPayload, assertLoginResponse, assertLogoutResponse, assertRefreshResponse, assertRequiredAuthEnv, assertSignupPayload } from "./contracts.js";
import { hasRefreshToken, readSignedAccessToken } from "./session-cookies.js";

/**
 * Maps domain errors to their default HTTP status.
 */
export const AUTH_ERROR_HTTP_MAP = Object.freeze({
	invalid_creds: 403,
	disabled_acct: 405,
	invalid_payload: 400,
	invalid_response: 502,
	missing_env: 500,
	upstream_error: 502,
	missing_refresh_token: 401,
	invalid_token: 401,
	token_expired: 401,
	network_error: 503
});

/**
 * @param {import("./types.js").AuthErrorCode} code
 * @param {string} message
 * @param {Partial<import("./types.js").AuthDomainError>} [extra]
 * @returns {import("./types.js").AuthDomainError}
 */
function makeError(code, message, extra = {}) {
	return createDomainError(code, extra.status ?? AUTH_ERROR_HTTP_MAP[code], message, extra.details);
}

const authHttpFailureMapper = createHttpFailureMapper({
	fallbackCode: "upstream_error",
	fallbackMessage: "Auth upstream request failed.",
	network: {
		code: "network_error",
		message: "Auth upstream is unreachable.",
		status: 503
	},
	invalidResponse: {
		code: "invalid_response",
		message: "Auth upstream returned invalid JSON.",
		status: 502
	}
});

const mapHttpFailure = /** @type {(
	failure: import("../../core/http/client.js").HttpFailure,
	options?: { fallbackCode?: "upstream_error"; fallbackMessage?: string }
) => import("./types.js").AuthDomainError} */ (
	(failure, options = {}) =>
		/** @type {import("./types.js").AuthDomainError} */ (
			authHttpFailureMapper(failure, options)
		)
);

/**
 * @param {import("./types.js").AuthLoginPayload} payload
 * @param {import("./types.js").AuthFetchDeps} deps
 * @returns {Promise<import("./types.js").AuthLoginResult>}
 */
export async function loginUser(payload, deps) {
	try {
		assertLoginPayload(payload);
		const { apiUrl } = assertRequiredAuthEnv();
			const response = await requestJson(buildApiUrl("auth/login", {}, apiUrl), {
			method: "POST",
			body: payload,
			fetchFn: deps.fetch,
			credentials: "include"
		});

		if (!response.ok) {
			const failure = asHttpFailure(response);
			if (response.status === 403) {
				return {
					ok: false,
					error: makeError("invalid_creds", "The information provided doesn't match that of any user.", { status: 403 })
				};
			}
			if (response.status === 405) {
				return {
					ok: false,
					error: makeError("disabled_acct", "This account is disabled, contact us if you believe this to be an error.", { status: 405 })
				};
			}
			return {
				ok: false,
				error: mapHttpFailure(failure)
			};
		}

		const data = assertLoginResponse(response.data);
		return {
			ok: true,
			data,
			status: response.status,
			headers: response.headers
		};
	} catch (err) {
		return {
			ok: false,
			error: asDomainError(err)
		};
	}
}

/**
 * @param {import("./types.js").AuthLogoutResponse} response
 * @returns {import("./types.js").AuthLogoutResponse}
 */
function normalizeLogoutResponse(response) {
	return {
		detail:
			typeof response.detail === "string" && response.detail.length > 0
				? response.detail
				: "Logged out successfully."
	};
}

/**
 * @param {import("./types.js").AuthLogoutDeps} deps
 * @returns {Promise<import("./types.js").AuthLogoutResult>}
 */
export async function logoutUser({ fetch: fetchFn, cookies, accessToken = null }) {
	try {
		const { apiUrl } = assertRequiredAuthEnv();
		const refreshToken = cookies.get("rfh_tkn");

		if (!refreshToken && !accessToken) {
			return {
				ok: true,
				data: { detail: "Logged out successfully." },
				status: 200,
				headers: new Headers()
			};
		}

		const headers = new Headers();
		if (refreshToken) {
			headers.append("Cookie", `rfh_tkn=${refreshToken}`);
		}
		if (accessToken) {
			headers.set("Authorization", `Bearer ${accessToken}`);
		}

			const response = await requestJson(buildApiUrl("auth/logout", {}, apiUrl), {
			method: "POST",
			fetchFn,
			headers,
			expectJson: false
		});

		if (!response.ok) {
			const failure = asHttpFailure(response);
			return {
				ok: false,
				error: mapHttpFailure(failure, {
					fallbackCode: "upstream_error",
					fallbackMessage: "Failed to logout auth session."
				})
			};
		}

		const data = normalizeLogoutResponse(assertLogoutResponse(response.data));
		return {
			ok: true,
			data,
			status: response.status,
			headers: response.headers
		};
	} catch (err) {
		return {
			ok: false,
			error: asDomainError(err)
		};
	}
}

/**
 * @param {import("./types.js").AuthSignupPayload} payload
 * @param {import("./types.js").AuthFetchDeps} deps
 * @returns {Promise<import("./types.js").AuthSignupResult>}
 */
export async function signupUser(payload, deps) {
	try {
		assertSignupPayload(payload);
		const { apiUrl } = assertRequiredAuthEnv();
			const response = await requestJson(buildApiUrl("auth/register-tkn", {}, apiUrl), {
			method: "POST",
			body: payload,
			fetchFn: deps.fetch,
			credentials: "include"
		});

		if (!response.ok) {
			const failure = asHttpFailure(response);
			if (response.status === 400) {
				return {
					ok: false,
					error: makeError("invalid_payload", "Signup request was rejected by upstream.", {
						status: 400,
						details: failure.error.details
					})
				};
			}
			if (response.status === 405) {
				return {
					ok: false,
					error: makeError("disabled_acct", "This account is disabled, contact us if you believe this to be an error.", { status: 405 })
				};
			}
			return {
				ok: false,
				error: mapHttpFailure(failure)
			};
		}

		const data = assertLoginResponse(response.data);
		return {
			ok: true,
			data,
			status: response.status,
			headers: response.headers
		};
	} catch (err) {
		return {
			ok: false,
			error: asDomainError(err)
		};
	}
}

/**
 * @param {import("./types.js").AuthRefreshDeps} deps
 * @returns {Promise<import("./types.js").AuthRefreshResult>}
 */
export async function refreshSession({ fetch: fetchFn, cookies }) {
	try {
		const { apiUrl } = assertRequiredAuthEnv();
		if (!hasRefreshToken(cookies)) {
			return {
				ok: false,
				error: makeError("missing_refresh_token", "Refresh token is missing.", { status: 401 })
			};
		}

			const response = await requestJson(buildApiUrl("auth/refresh", {}, apiUrl), {
			method: "POST",
			fetchFn
		});

		if (!response.ok) {
			const failure = asHttpFailure(response);
			return {
				ok: false,
				error: mapHttpFailure(failure, {
					fallbackCode: "upstream_error",
					fallbackMessage: "Failed to refresh auth session."
				})
			};
		}

		const data = assertRefreshResponse(response.data);
		return {
			ok: true,
			data,
			status: response.status,
			headers: response.headers
		};
	} catch (err) {
		return {
			ok: false,
			error: asDomainError(err)
		};
	}
}

/**
 * @param {import("@sveltejs/kit").Cookies} cookies
 * @returns {import("./types.js").SessionState}
 */
export function getSessionState(cookies) {
	return {
		accessToken: readSignedAccessToken(cookies),
		hasRefreshToken: hasRefreshToken(cookies)
	};
}

/**
 * @param {string | null} accessToken
 * @returns {import("./types.js").TokenValidationResult}
 */
export function validateAccessToken(accessToken) {
	if (!accessToken) {
		return {
			ok: false,
			error: makeError("invalid_token", "Access token is missing.", { status: 401 })
		};
	}

	const secret = getAuthJwtSecret({ allowInsecureFallback: true });
	try {
		jwt.verify(accessToken, secret);
		return { ok: true };
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			return {
				ok: false,
				error: makeError("token_expired", "Access token has expired.", { status: 401 })
			};
		}
		if (err instanceof jwt.NotBeforeError || err instanceof jwt.JsonWebTokenError) {
			const details = err instanceof Error ? err.message : String(err);
			return {
				ok: false,
				error: makeError("invalid_token", "Access token signature is invalid.", {
					status: 401,
					details
				})
			};
		}
		return {
			ok: false,
			error: makeError("invalid_token", "Access token validation failed.", { status: 401, details: err })
		};
	}
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function toRoleList(value) {
	if (Array.isArray(value)) {
		return value
			.filter((item) => typeof item === "string")
			.map((item) => item.trim())
			.filter(Boolean);
	}
	if (typeof value === "string") {
		return value
			.split(/[,\s]+/u)
			.map((item) => item.trim())
			.filter(Boolean);
	}
	return [];
}

/**
 * @param {string | null} accessToken
 * @returns {Record<string, unknown> | null}
 */
export function decodeAccessTokenClaims(accessToken) {
	if (!accessToken) return null;
	const decoded = jwt.decode(accessToken);
	if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) return null;
	return /** @type {Record<string, unknown>} */ (decoded);
}

/**
 * @param {Record<string, unknown> | null} claims
 * @returns {string[]}
 */
export function extractRolesFromClaims(claims) {
	if (!claims) return [];

	const roles = new Set();
	/** @param {unknown} value */
	const addRoles = (value) => {
		for (const role of toRoleList(value)) {
			roles.add(role.toLowerCase());
		}
	};

	addRoles(claims.roles);
	addRoles(claims.role);

	if (claims.realm_access && typeof claims.realm_access === "object" && !Array.isArray(claims.realm_access)) {
		const realmAccess = /** @type {Record<string, unknown>} */ (claims.realm_access);
		addRoles(realmAccess.roles);
	}

	if (claims.resource_access && typeof claims.resource_access === "object" && !Array.isArray(claims.resource_access)) {
		const resourceAccess = /** @type {Record<string, unknown>} */ (claims.resource_access);
		for (const clientAccess of Object.values(resourceAccess)) {
			if (clientAccess && typeof clientAccess === "object" && !Array.isArray(clientAccess)) {
				const clientAccessRecord = /** @type {Record<string, unknown>} */ (clientAccess);
				addRoles(clientAccessRecord.roles);
			}
		}
	}

	return Array.from(roles);
}
