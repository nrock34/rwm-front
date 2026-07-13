import { asHttpFailure, buildApiUrl, createHttpFailureMapper, withBearerAuth } from "../../core/domain/http.js";
import { coerceDomainError, createDomainError } from "../../core/domain/errors.js";
import { requestJson } from "../../core/http/client.js";
import { AVATAR_MAX_BYTES } from "./avatar.js";
import {
	mapEditableProfileInfo,
	mapProfileAccountSettings,
	mapProfileActivityList,
	mapProfileApplications,
	mapProfileEducationSettings,
	mapProfileSavedItems,
	mapProfileSummary,
	mapPublicProfile
} from "./mappers.js";

export { AVATAR_MAX_BYTES } from "./avatar.js";

const AVATAR_FORMATS = Object.freeze({
	"image/jpeg": {
		extension: "jpg",
		/** @param {Uint8Array} bytes */
		matches: (bytes) => bytes.length >= 3
			&& bytes[0] === 0xff
			&& bytes[1] === 0xd8
			&& bytes[2] === 0xff
	},
	"image/png": {
		extension: "png",
		/** @param {Uint8Array} bytes */
		matches: (bytes) => bytes.length >= 8
			&& bytes[0] === 0x89
			&& bytes[1] === 0x50
			&& bytes[2] === 0x4e
			&& bytes[3] === 0x47
			&& bytes[4] === 0x0d
			&& bytes[5] === 0x0a
			&& bytes[6] === 0x1a
			&& bytes[7] === 0x0a
	}
});

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
 * Validates both upload metadata and the file signature before the upload is
 * buffered into storage. The buffer size is checked again because file-like
 * objects supplied by tests or non-browser clients can lie about `size`.
 *
 * @param {unknown} file
 * @returns {Promise<{ arrayBuffer: ArrayBuffer; contentType: "image/jpeg" | "image/png"; extension: "jpg" | "png" } | null>}
 */
export async function validateAvatarUpload(file) {
	if (file == null) return null;
	if (!isFileLike(file)) {
		throw createDomainError("invalid_upload", 400, "Choose a valid image file.");
	}
	if (file.size === 0 && file.name === "") return null;
	if (file.size === 0) {
		throw createDomainError("invalid_upload", 400, "Avatar images cannot be empty.");
	}

	if (!Number.isFinite(file.size) || file.size < 0 || file.size > AVATAR_MAX_BYTES) {
		throw createDomainError(
			"invalid_upload",
			400,
			`Avatar images must be ${AVATAR_MAX_BYTES / (1024 * 1024)} MB or smaller.`
		);
	}

	const contentType = file.type.trim().toLowerCase();
	const format = AVATAR_FORMATS[/** @type {keyof typeof AVATAR_FORMATS} */ (contentType)];
	if (!format) {
		throw createDomainError("invalid_upload", 400, "Avatar images must be JPEG or PNG files.");
	}

	const arrayBuffer = await file.arrayBuffer();
	if (arrayBuffer.byteLength === 0 || arrayBuffer.byteLength > AVATAR_MAX_BYTES) {
		throw createDomainError(
			"invalid_upload",
			400,
			`Avatar images must be non-empty and ${AVATAR_MAX_BYTES / (1024 * 1024)} MB or smaller.`
		);
	}

	if (!format.matches(new Uint8Array(arrayBuffer))) {
		throw createDomainError(
			"invalid_upload",
			400,
			"The avatar file contents do not match its declared image type."
		);
	}

	return {
		arrayBuffer,
		contentType: /** @type {"image/jpeg" | "image/png"} */ (contentType),
		extension: /** @type {"jpg" | "png"} */ (format.extension)
	};
}

/**
 * @param {import("@sveltejs/kit").RequestEvent["platform"]} platform
 * @returns {import("./types.js").ProfileAvatarBucket}
 */
function getAvatarBucket(platform) {
	const platformState = /** @type {{ env?: { PFP_BUCKET?: import("./types.js").ProfileAvatarBucket } } | null | undefined} */ (platform);
	const bucket = platformState?.env?.PFP_BUCKET;
	if (!bucket || typeof bucket.put !== "function") {
		throw createDomainError(
			"upload_unavailable",
			500,
			"Avatar uploads are unavailable because PFP_BUCKET is not configured."
		);
	}
	return bucket;
}

/**
 * @param {string} key
 * @param {string} origin
 * @returns {string}
 */
function buildAvatarPublicUrl(key, origin) {
	let publicOrigin;
	try {
		const parsed = new URL(origin);
		if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
			throw new TypeError("invalid origin");
		}
		publicOrigin = parsed.origin;
	} catch {
		throw createDomainError("upload_unavailable", 500, "Avatar public URL configuration is invalid.");
	}

	return new URL(`/uploads/avatar/${encodeURIComponent(key)}`, publicOrigin).toString();
}

/**
 * @param {unknown} file
 * @param {import("@sveltejs/kit").RequestEvent["platform"]} platform
 * @param {string} origin
 * @returns {Promise<{ key: string; url: string; bucket: import("./types.js").ProfileAvatarBucket } | null>}
 */
async function uploadAvatar(file, platform, origin) {
	const validated = await validateAvatarUpload(file);
	if (!validated) return null;

	const key = `avatar-${crypto.randomUUID()}.${validated.extension}`;
	const url = buildAvatarPublicUrl(key, origin);
	const bucket = getAvatarBucket(platform);
	await bucket.put(key, validated.arrayBuffer, {
		httpMetadata: {
			contentType: validated.contentType,
			cacheControl: "public, max-age=31536000, immutable",
			contentDisposition: `inline; filename="avatar.${validated.extension}"`
		}
	});

	return {
		key,
		url,
		bucket
	};
}

/**
 * @param {{ key: string; bucket: import("./types.js").ProfileAvatarBucket } | null} upload
 */
async function cleanupAvatarUpload(upload) {
	if (!upload || typeof upload.bucket.delete !== "function") return;
	try {
		await upload.bucket.delete(upload.key);
	} catch {
		// Preserve the upstream profile error. Storage lifecycle rules provide a
		// second line of defense for the rare case where this best-effort delete fails.
	}
}

/**
 * @template TResult
 * @param {{
 *   fetch: typeof fetch;
 *   accessToken?: string | null;
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
 * @param {import("./types.js").ProfileEducationSettingsInput} input
 * @param {import("./types.js").ProfileFetchDeps} deps
 * @returns {Promise<import("./types.js").ProfileEducationSettingsResult>}
 */
export async function updateProfileEducationSettings(input, { fetch, accessToken }) {
	try {
		const universityId = Number(input.university);
		const response = await requestJson(buildApiUrl("users/me/education"), {
			method: "PATCH",
			fetchFn: fetch,
			headers: withBearerAuth(accessToken),
			body: {
				university: Number.isInteger(universityId) && universityId > 0
					? universityId
					: input.university,
				major: input.major,
				year: input.grad_year
			}
		});

		if (!response.ok) {
			return {
				ok: false,
				error: mapHttpFailure(asHttpFailure(response), "Failed to update education settings.")
			};
		}

		return {
			ok: true,
			data: mapProfileEducationSettings(response.data ?? {
				...input,
				year: input.grad_year
			})
		};
	} catch (err) {
		return {
			ok: false,
			error: asDomainError(err)
		};
	}
}

/**
 * @param {unknown} value
 * @param {string} profileUserId
 * @returns {Record<string, unknown> | null}
 */
function findPublicAuthor(value, profileUserId) {
	let authors = [];
	if (Array.isArray(value)) {
		authors = value;
	} else if (value && typeof value === "object" && !Array.isArray(value)) {
		const results = /** @type {{ results?: unknown }} */ (value).results;
		if (Array.isArray(results)) authors = results;
	}

	const author = authors.find((candidate) => {
		if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return false;
		return String(/** @type {{ associated_user?: unknown }} */ (candidate).associated_user) === profileUserId;
	});
	if (!author || typeof author !== "object" || Array.isArray(author)) return null;

	const record = /** @type {Record<string, unknown>} */ (author);
	return {
		id: Number(profileUserId),
		name: record.name,
		profile: {
			avatar: record.avatar
		}
	};
}

/**
 * @param {typeof fetch} fetchFn
 * @param {string} profileUserId
 * @returns {Promise<
 *   | { ok: true; data: Record<string, unknown> }
 *   | { ok: false; failure: import("../../core/http/client.js").HttpFailure }
 *   | { ok: false; notFound: true }
 * >}
 */
async function loadAnonymousPublicProfile(fetchFn, profileUserId) {
	const detailResponse = await requestJson(buildApiUrl(`authors/${profileUserId}`), {
		fetchFn
	});
	if (detailResponse.ok && detailResponse.data && typeof detailResponse.data === "object" && !Array.isArray(detailResponse.data)) {
		const detail = /** @type {Record<string, unknown>} */ (detailResponse.data);
		if (String(detail.associated_user) === profileUserId) {
			return {
				ok: true,
				data: {
					id: Number(profileUserId),
					name: detail.name,
					profile: { avatar: detail.avatar }
				}
			};
		}
	}

	// Older API deployments have a broken author-detail lookup. The public list
	// is an intentional AllowAny endpoint and provides the same safe author fields.
	const listResponse = await requestJson(buildApiUrl("authors/list"), {
		fetchFn
	});
	if (!listResponse.ok) {
		return { ok: false, failure: asHttpFailure(listResponse) };
	}

	const author = findPublicAuthor(listResponse.data, profileUserId);
	return author ? { ok: true, data: author } : { ok: false, notFound: true };
}

/**
 * Loads a viewer-authorized public profile and its recent posts. It never uses
 * a shared service credential: if the profile endpoint requires a viewer, the
 * viewer's own access token is forwarded.
 *
 * @param {import("./types.js").PublicProfileFetchDeps} deps
 * @returns {Promise<import("./types.js").PublicProfileResult>}
 */
export async function loadPublicProfile({ fetch, accessToken, profileUserId }) {
	const normalizedUserId = String(profileUserId).trim();
	if (!/^\d+$/u.test(normalizedUserId) || Number(normalizedUserId) <= 0) {
		return {
			ok: false,
			error: createDomainError("invalid_profile_id", 404, "Profile not found.")
		};
	}

	try {
		const [profileSource, postIdsResponse] = await Promise.all([
			accessToken
				? requestJson(buildApiUrl(`users/${normalizedUserId}/profile`), {
					fetchFn: fetch,
					headers: withBearerAuth(accessToken)
				}).then((response) => response.ok
					? { ok: true, data: response.data }
					: { ok: false, failure: asHttpFailure(response) })
				: loadAnonymousPublicProfile(fetch, normalizedUserId),
			requestJson(buildApiUrl(`authors/${normalizedUserId}/posts`), {
				fetchFn: fetch
			})
		]);

		if (!profileSource.ok) {
			if ("failure" in profileSource && profileSource.failure) {
				return {
					ok: false,
					error: mapHttpFailure(profileSource.failure, "Failed to load this profile.")
				};
			}
			return {
				ok: false,
				error: createDomainError("invalid_profile_id", 404, "Profile not found.")
			};
		}

		/** @type {number[]} */
		let postIds = [];
		if (postIdsResponse.ok && postIdsResponse.data && typeof postIdsResponse.data === "object") {
			const rawPostIds = /** @type {{ posts?: unknown }} */ (postIdsResponse.data).posts;
			if (Array.isArray(rawPostIds)) {
				postIds = rawPostIds
					.filter((value) => typeof value === "number" && Number.isInteger(value) && value > 0)
					.slice(0, 4);
			}
		}

		const postResponses = await Promise.all(
			postIds.map(async (postId) => {
				const response = await requestJson(buildApiUrl(`posts/${postId}`), {
					fetchFn: fetch
				});
				return response.ok ? { id: postId, value: response.data } : null;
			})
		);

		return {
			ok: true,
			data: mapPublicProfile(
				profileSource.data,
				postResponses.filter((post) => post !== null),
				normalizedUserId
			)
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
export async function updateProfileInfo(input, { fetch, accessToken, platform, origin }) {
	/** @type {{ key: string; url: string; bucket: import("./types.js").ProfileAvatarBucket } | null} */
	let uploadedAvatar = null;
	try {
		uploadedAvatar = await uploadAvatar(input.avatar, platform, origin);
		/** @type {{ first_name: string; last_name: string; bio: string; birthday: string; avatar?: string }} */
		const payload = {
			first_name: input.first_name,
			last_name: input.last_name,
			bio: input.bio,
			birthday: input.birthday
		};

		if (uploadedAvatar) {
			payload.avatar = uploadedAvatar.url;
		}

		const response = await requestJson(buildApiUrl("users/me/settings/profile"), {
			method: "PATCH",
			fetchFn: fetch,
			headers: withBearerAuth(accessToken),
			body: payload
		});

		if (!response.ok) {
			const failure = asHttpFailure(response);
			// A 4xx response confirms that the profile write was rejected. Network,
			// invalid-response, and 5xx outcomes are ambiguous, so retain the object
			// rather than risk deleting an avatar the API may already reference.
			if (failure.status >= 400 && failure.status < 500) {
				await cleanupAvatarUpload(uploadedAvatar);
			}
			return {
				ok: false,
				error: mapHttpFailure(failure, "Failed to update profile information.")
			};
		}

		return {
			ok: true,
			data: { avatarUrl: uploadedAvatar?.url ?? null }
		};
	} catch (err) {
		await cleanupAvatarUpload(uploadedAvatar);
		return {
			ok: false,
			error: asDomainError(err)
		};
	}
}
