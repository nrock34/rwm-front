import { asHttpFailure, buildApiUrl, createHttpFailureMapper, withBearerAuth } from "../../core/domain/http.js";
import { coerceDomainError, createDomainError } from "../../core/domain/errors.js";
import { requestJson } from "../../core/http/client.js";
import {
	mapEditableProfileInfo,
	mapProfileAccountSettings,
	mapProfileActivityList,
	mapProfileApplications,
	mapProfileEducationSettings,
	mapProfileSavedItems,
	mapProfileSummary
} from "./mappers.js";
import { dev } from "$app/environment";

/**
 * @param {import("./types.js").ProfileErrorCode} code
 * @param {string} message
 * @param {Partial<import("./types.js").ProfileDomainError>} [extra]
 * @returns {import("./types.js").ProfileDomainError}
 */
function makeError(code, message, extra = {}) {
	return {
		code,
		status: extra.status ?? 500,
		message,
		details: extra.details
	};
}

const profileHttpFailureMapper = createHttpFailureMapper({
	fallbackCode: "upstream_error",
	fallbackMessage: "Failed to load profile data.",
	network: {
		code: "network_error",
		message: "Profile upstream is unreachable."
	},
	invalidResponse: {
		code: "invalid_response",
		message: "Profile upstream returned invalid JSON."
	}
});

const mapHttpFailure = /** @type {(failure: import("../../core/http/client.js").HttpFailure, fallbackMessage: string) => import("./types.js").ProfileDomainError} */ (
	(failure, fallbackMessage) =>
		/** @type {import("./types.js").ProfileDomainError} */ (
			profileHttpFailureMapper(failure, { fallbackMessage })
		)
);

/**
 * @param {unknown} value
 * @returns {value is import("./types.js").ProfileUploadFile}
 */
function isFileLike(value) {
	if (!value || typeof value !== "object") {
		return false;
	}

	const candidate = /** @type {Record<string, unknown>} */ (value);
	return (
		typeof candidate.arrayBuffer === "function" &&
		typeof candidate.name === "string" &&
		typeof candidate.size === "number" &&
		typeof candidate.type === "string"
	);
}

/**
 * @param {string} name
 * @returns {string}
 */
function sanitizeFileName(name) {
	return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").ProfileDomainError}
 */
function asDomainError(value) {
	return /** @type {import("./types.js").ProfileDomainError} */ (
		coerceDomainError(value, {
			missingEnvCode: "missing_env",
			fallbackCode: "upstream_error",
			fallbackMessage: "Unexpected profile domain failure."
		})
	);
}

/**
 * @param {unknown} file
 * @param {import("@sveltejs/kit").RequestEvent["platform"]} platform
 * @param {string} host
 * @returns {Promise<string | null>}
 */
async function uploadAvatar(file, platform, host) {
	if (!isFileLike(file) || file.size === 0) {
		return null;
	}

	const platformState = /** @type {{ env?: { PFP_BUCKET?: { put?: (key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }) => Promise<unknown> } } } | null | undefined} */ (platform);
	const bucket = platformState?.env?.PFP_BUCKET;
	if (!bucket || typeof bucket.put !== "function") {
		throw createDomainError(
			"upload_unavailable",
			500,
			"Avatar uploads are unavailable because PFP_BUCKET is not configured."
		);
	}

	const key = `profile-${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
	const arrayBuffer = await file.arrayBuffer();
	await bucket.put(key, arrayBuffer, {
		httpMetadata: { contentType: file.type }
	});

	return `https://pub-befc936fce3341a29efe8e635e01f241.r2.dev/${key}`;
}

/**
 * @template TResult
 * @param {{
 *   fetch: typeof fetch;
 *   accessToken: string;
 *   path: string;
 *   fallbackMessage: string;
 *   mapData: (value: unknown) => TResult;
 * }} options
 * @returns {Promise<{ ok: true; data: TResult } | { ok: false; error: import("./types.js").ProfileDomainError }>}
 */
async function loadAuthorizedData(options) {
	try {
		const response = await requestJson(buildApiUrl(options.path), {
			fetchFn: options.fetch,
			headers: withBearerAuth(options.accessToken)
		});

		if (!response.ok) {
			return {
				ok: false,
				error: mapHttpFailure(asHttpFailure(response), options.fallbackMessage)
			};
		}

		return {
			ok: true,
			data: options.mapData(response.data)
		};
	} catch (err) {
		return {
			ok: false,
			error: asDomainError(err)
		};
	}
}

/**
 * @param {import("./types.js").ProfileFetchDeps} deps
 * @returns {Promise<import("./types.js").ProfileLoadResult>}
 */
export async function loadEditableProfileInfo({ fetch, accessToken }) {
	return loadAuthorizedData({
		fetch,
		accessToken,
		path: "users/me/settings/profile",
		fallbackMessage: "Failed to load profile settings.",
		mapData: mapEditableProfileInfo
	});
}

/**
 * @param {import("./types.js").ProfileFetchDeps} deps
 * @returns {Promise<import("./types.js").ProfileSummaryResult>}
 */
export async function loadProfileSummary({ fetch, accessToken }) {
	return loadAuthorizedData({
		fetch,
		accessToken,
		path: "users/me/profile",
		fallbackMessage: "Failed to load profile summary.",
		mapData: mapProfileSummary
	});
}

/**
 * @param {import("./types.js").ProfileFetchDeps} deps
 * @returns {Promise<import("./types.js").ProfileAccountSettingsResult>}
 */
export async function loadProfileAccountSettings({ fetch, accessToken }) {
	return loadAuthorizedData({
		fetch,
		accessToken,
		path: "auth/info",
		fallbackMessage: "Failed to load account settings.",
		mapData: mapProfileAccountSettings
	});
}

/**
 * @param {import("./types.js").ProfileFetchDeps} deps
 * @returns {Promise<import("./types.js").ProfileEducationSettingsResult>}
 */
export async function loadProfileEducationSettings({ fetch, accessToken }) {
	return loadAuthorizedData({
		fetch,
		accessToken,
		path: "users/me/settings/edu",
		fallbackMessage: "Failed to load education settings.",
		mapData: mapProfileEducationSettings
	});
}

/**
 * @param {import("./types.js").ProfileFetchDeps} deps
 * @returns {Promise<import("./types.js").ProfileActivityResult>}
 */
export async function loadProfileActivity({ fetch, accessToken }) {
	return loadAuthorizedData({
		fetch,
		accessToken,
		path: "users/me/activity",
		fallbackMessage: "Failed to load activity history.",
		mapData: mapProfileActivityList
	});
}

/**
 * @param {import("./types.js").ProfileFetchDeps} deps
 * @returns {Promise<import("./types.js").ProfileApplicationsResult>}
 */
export async function loadProfileApplications({ fetch, accessToken }) {
	return loadAuthorizedData({
		fetch,
		accessToken,
		path: "users/me/applications",
		fallbackMessage: "Failed to load applications.",
		mapData: mapProfileApplications
	});
}

/**
 * @param {import("./types.js").ProfileFetchDeps} deps
 * @returns {Promise<import("./types.js").ProfileSavedItemsResult>}
 */
export async function loadProfileSavedItems({ fetch, accessToken }) {
	return loadAuthorizedData({
		fetch,
		accessToken,
		path: "users/me/saved-items",
		fallbackMessage: "Failed to load saved items.",
		mapData: mapProfileSavedItems
	});
}

/**
 * @param {import("./types.js").EditableProfileInfoInput} input
 * @param {import("./types.js").ProfileUpdateDeps} deps
 * @returns {Promise<import("./types.js").ProfileUpdateResult>}
 */
export async function updateProfileInfo(input, { fetch, accessToken, platform, host }) {
	try {
		const avatarUrl = await uploadAvatar(input.avatar, platform, host);
		/** @type {{ first_name: string; last_name: string; bio: string; birthday: string; avatar?: string }} */
		const payload = {
			first_name: input.first_name,
			last_name: input.last_name,
			bio: input.bio,
			birthday: input.birthday
		};

		if (avatarUrl) {
			payload.avatar = avatarUrl;
		}

		const response = await requestJson(buildApiUrl("users/me/settings/profile"), {
			method: "PATCH",
			fetchFn: fetch,
			headers: withBearerAuth(accessToken),
			body: payload
		});

		if (!response.ok) {
			return {
				ok: false,
				error: mapHttpFailure(asHttpFailure(response), "Failed to update profile information.")
			};
		}

		return {
			ok: true,
			data: { avatarUrl }
		};
	} catch (err) {
		return {
			ok: false,
			error: asDomainError(err)
		};
	}
}
