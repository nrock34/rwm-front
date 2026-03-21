import { requestJson } from "../../core/http/client.js";
import {
	asHttpFailure,
	buildApiUrl,
	createHttpFailureMapper,
	withBearerAuth
} from "../../core/domain/http.js";
import { coerceDomainError, createDomainError } from "../../core/domain/errors.js";
import {
	assertCommentPage,
	assertCreateCommentResponse,
	assertCreatePostResponse,
	assertLikeToggleResponse,
	assertPost,
	assertPostPage,
	assertProgramList,
	assertScholarshipList,
	assertUpdateDetail,
	assertUpdatePage
} from "./contracts.js";
import {
	deriveUpcomingDeadlines,
	mapCommunityComment,
	mapCommunityPost,
	mapCommunityProgram,
	mapCommunityScholarship,
	mapCommunityUpdate,
	mapCommunityUpdateDetail,
	mapCursorPage
} from "./mappers.js";

/**
 * @param {import("./types.js").CommunityErrorCode} code
 * @param {string} message
 * @param {Partial<import("./types.js").CommunityDomainError>} [extra]
 * @returns {import("./types.js").CommunityDomainError}
 */
function makeError(code, message, extra = {}) {
	return createDomainError(code, extra.status ?? 500, message, extra.details);
}

const communityHttpFailureMapper = createHttpFailureMapper({
	fallbackCode: "upstream_error",
	fallbackMessage: "Failed to load community data.",
	network: {
		code: "network_error",
		message: "Community upstream is unreachable."
	},
	invalidResponse: {
		code: "invalid_response",
		message: "Community upstream returned invalid JSON."
	},
	statusMap: {
		401: {
			code: "unauthorized",
			message: "You need to be logged in to do that."
		},
		403: {
			code: "unauthorized",
			message: "You need to be logged in to do that."
		}
	}
});

const mapHttpFailure = /** @type {(failure: import("../../core/http/client.js").HttpFailure, fallbackMessage: string) => import("./types.js").CommunityDomainError} */ (
	(failure, fallbackMessage) =>
		/** @type {import("./types.js").CommunityDomainError} */ (
			communityHttpFailureMapper(failure, { fallbackMessage })
		)
);

/**
 * @param {unknown} value
 * @returns {import("./types.js").CommunityDomainError}
 */
function asCommunityDomainError(value) {
	return /** @type {import("./types.js").CommunityDomainError} */ (
		coerceDomainError(value, {
			missingEnvCode: "missing_env",
			fallbackCode: "upstream_error",
			fallbackMessage: "Unexpected community domain failure."
		})
	);
}

/**
 * @template TResult
 * @param {{
 *   fetch: typeof fetch;
 *   accessToken?: string | null;
 *   path: string;
 *   params?: Record<string, string | number | boolean | null | undefined>;
 *   fallbackMessage: string;
 *   method?: string;
 *   body?: unknown;
 *   expectJson?: boolean;
 *   requireAuthMessage?: string | null;
 *   mapData: (value: unknown) => TResult;
 * }} options
 * @returns {Promise<{ ok: true; data: TResult; status: number; headers: Headers } | { ok: false; error: import("./types.js").CommunityDomainError }>}
 */
async function requestCommunityData(options) {
	if (options.requireAuthMessage && !options.accessToken) {
		return {
			ok: false,
			error: makeError("unauthorized", options.requireAuthMessage, { status: 401 })
		};
	}

	try {
		const response = await requestJson(buildApiUrl(options.path, options.params), {
			method: options.method,
			fetchFn: options.fetch,
			headers: withBearerAuth(options.accessToken),
			body: options.body,
			expectJson: options.expectJson
		});

		if (!response.ok) {
			return {
				ok: false,
				error: mapHttpFailure(asHttpFailure(response), options.fallbackMessage)
			};
		}

		return {
			ok: true,
			data: options.mapData(response.data),
			status: response.status,
			headers: response.headers
		};
	} catch (err) {
		return {
			ok: false,
			error: asCommunityDomainError(err)
		};
	}
}

/**
 * @param {import("./types.js").CommunityFetchDeps} deps
 * @returns {Promise<import("./types.js").CommunityResult<import("./types.js").CommunitySummaryData>>}
 */
export async function loadCommunitySummary({ fetch, accessToken = null }) {
	try {
		const [postsResponse, updatesResponse, programsResponse, scholarshipsResponse] = await Promise.all([
			requestJson(buildApiUrl("posts/list"), {
				fetchFn: fetch,
				headers: withBearerAuth(accessToken)
			}),
			requestJson(buildApiUrl("news-updates/updates"), {
				fetchFn: fetch
			}),
			requestJson(buildApiUrl("programs/featured"), {
				fetchFn: fetch
			}),
			requestJson(buildApiUrl("scholarships/featured"), {
				fetchFn: fetch
			})
		]);

		if (!postsResponse.ok) {
			return { ok: false, error: mapHttpFailure(asHttpFailure(postsResponse), "Failed to load community posts.") };
		}
		if (!updatesResponse.ok) {
			return { ok: false, error: mapHttpFailure(asHttpFailure(updatesResponse), "Failed to load community updates.") };
		}
		if (!programsResponse.ok) {
			return { ok: false, error: mapHttpFailure(asHttpFailure(programsResponse), "Failed to load featured programs.") };
		}
		if (!scholarshipsResponse.ok) {
			return { ok: false, error: mapHttpFailure(asHttpFailure(scholarshipsResponse), "Failed to load featured scholarships.") };
		}

		const posts = mapCursorPage(assertPostPage(postsResponse.data), mapCommunityPost).results;
		const updates = mapCursorPage(assertUpdatePage(updatesResponse.data), mapCommunityUpdate).results;
		const featuredPrograms = assertProgramList(programsResponse.data).map(mapCommunityProgram);
		const featuredScholarships = assertScholarshipList(scholarshipsResponse.data).map(mapCommunityScholarship);

		return {
			ok: true,
			data: {
				posts,
				updates,
				featuredPrograms,
				featuredScholarships,
				upcomingDeadlines: deriveUpcomingDeadlines(featuredPrograms, featuredScholarships)
			},
			status: 200,
			headers: new Headers()
		};
	} catch (err) {
		return { ok: false, error: asCommunityDomainError(err) };
	}
}

/**
 * @param {{ q?: string | null; category?: string | null; type?: string | null; tag?: string | null; sort_by?: string | null; cursor?: string | null }} params
 * @param {import("./types.js").CommunityFetchDeps} deps
 * @returns {Promise<import("./types.js").CommunityResult<import("./types.js").CommunityCursorPage<import("./types.js").CommunityPostCard>>>}
 */
export async function loadCommunityPostsPage(params, { fetch, accessToken = null }) {
	try {
		const response = await requestJson(buildApiUrl("posts/list", params), {
			fetchFn: fetch,
			headers: withBearerAuth(accessToken)
		});

		if (!response.ok) {
			const failure = asHttpFailure(response);
			if (params.tag && (response.status === 400 || response.status === 404)) {
				return {
					ok: false,
					error: makeError("not_found", `The tag "${params.tag}" does not exist.`, {
						status: 404,
						details: failure.error.details
					})
				};
			}
			return { ok: false, error: mapHttpFailure(failure, "Failed to load community posts.") };
		}

		return {
			ok: true,
			data: mapCursorPage(assertPostPage(response.data), mapCommunityPost),
			status: response.status,
			headers: response.headers
		};
	} catch (err) {
		return { ok: false, error: asCommunityDomainError(err) };
	}
}

/**
 * @param {string | number} postId
 * @param {import("./types.js").CommunityFetchDeps} deps
 * @returns {Promise<import("./types.js").CommunityResult<import("./types.js").CommunityPostDetail>>}
 */
export async function loadCommunityPostDetail(postId, { fetch, accessToken = null }) {
	return requestCommunityData({
		fetch,
		accessToken,
		path: `posts/${postId}`,
		fallbackMessage: "Failed to load post details.",
		mapData: (value) => mapCommunityPost(assertPost(value))
	});
}

/**
 * @param {import("./types.js").CreatePostPayload} payload
 * @param {import("./types.js").CommunityFetchDeps} deps
 * @returns {Promise<import("./types.js").CommunityResult<{ id: number }>>}
 */
export async function createCommunityPost(payload, { fetch, accessToken = null }) {
	return requestCommunityData({
		fetch,
		accessToken,
		path: "posts/create",
		method: "POST",
		body: payload,
		fallbackMessage: "Failed to create the post.",
		requireAuthMessage: "You need to be logged in to create a post.",
		mapData: (value) => assertCreatePostResponse(value)
	});
}

/**
 * @param {string | number} postId
 * @param {import("./types.js").CommunityFetchDeps} deps
 * @returns {Promise<import("./types.js").CommunityResult<{ liked: boolean }>>}
 */
export async function toggleCommunityPostLike(postId, { fetch, accessToken = null }) {
	return requestCommunityData({
		fetch,
		accessToken,
		path: `posts/${postId}/like`,
		method: "POST",
		expectJson: true,
		fallbackMessage: "Failed to update post like status.",
		requireAuthMessage: "You need to be logged in to like a post.",
		mapData: (value) => assertLikeToggleResponse(value)
	});
}

/**
 * @param {string | number} postId
 * @param {{ cursor?: string | null; sort_by?: string | null }} params
 * @param {import("./types.js").CommunityFetchDeps} deps
 * @returns {Promise<import("./types.js").CommunityResult<import("./types.js").CommunityCursorPage<import("./types.js").CommunityComment>>>}
 */
export async function loadCommunityPostComments(postId, params, { fetch, accessToken = null }) {
	return requestCommunityData({
		fetch,
		accessToken,
		path: `posts/${postId}/comments`,
		params,
		fallbackMessage: "Failed to load post comments.",
		mapData: (value) => mapCursorPage(assertCommentPage(value), mapCommunityComment)
	});
}

/**
 * @param {string | number} postId
 * @param {import("./types.js").CreateCommentPayload} payload
 * @param {import("./types.js").CommunityFetchDeps} deps
 * @returns {Promise<import("./types.js").CommunityResult<import("./types.js").CommunityComment>>}
 */
export async function createCommunityPostComment(postId, payload, { fetch, accessToken = null }) {
	return requestCommunityData({
		fetch,
		accessToken,
		path: `posts/${postId}/comments`,
		method: "POST",
		body: payload,
		fallbackMessage: "Failed to create the comment.",
		requireAuthMessage: "You need to be logged in to comment.",
		mapData: (value) => mapCommunityComment(assertCreateCommentResponse(value))
	});
}

/**
 * @param {{ cursor?: string | null }} params
 * @param {import("./types.js").CommunityFetchDeps} deps
 * @returns {Promise<import("./types.js").CommunityResult<import("./types.js").CommunityCursorPage<import("./types.js").CommunityUpdateCard>>>}
 */
export async function loadCommunityUpdatesPage(params, { fetch }) {
	return requestCommunityData({
		fetch,
		path: "news-updates/updates",
		params,
		fallbackMessage: "Failed to load community updates.",
		mapData: (value) => mapCursorPage(assertUpdatePage(value), mapCommunityUpdate)
	});
}

/**
 * @param {string | number} updateId
 * @param {import("./types.js").CommunityFetchDeps} deps
 * @returns {Promise<import("./types.js").CommunityResult<import("./types.js").CommunityUpdateDetail>>}
 */
export async function loadCommunityUpdateDetail(updateId, { fetch, accessToken = null }) {
	return requestCommunityData({
		fetch,
		accessToken,
		path: `news-updates/updates/${updateId}`,
		fallbackMessage: "Failed to load update details.",
		requireAuthMessage: "You need to be logged in to view this update.",
		mapData: (value) => mapCommunityUpdateDetail(assertUpdateDetail(value))
	});
}
