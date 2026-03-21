import { buildLoginRedirectUrl } from "$lib/auth/redirect.js";
import { getValidatedAccessToken, requireValidatedAccessToken } from "$lib/auth/server.js";
import { createCommunityPostComment, loadCommunityPostComments, loadCommunityPostDetail, loadCommunityPostsPage } from "$domains/community";
import { error, fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { yup } from "sveltekit-superforms/adapters";
import { commentSchema } from "$lib/components/forms/community/comment-schema.js";

/**
 * @param {URL} url
 * @param {string | null} cursor
 * @returns {string | null}
 */
function buildCursorHref(url, cursor) {
	if (!cursor) return null;
	const next = new URL(url);
	next.searchParams.set("cursor", cursor);
	return `${next.pathname}${next.search}#comments`;
}

/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 */
export async function load(event) {
	const postId = event.params.id;
	if (!postId) {
		throw error(400, "Missing post id.");
	}

	const accessToken = getValidatedAccessToken(event);
	const sortBy = event.url.searchParams.get("sort_by") ?? "-created_at";
	const postResult = await loadCommunityPostDetail(postId, {
		fetch: event.fetch,
		accessToken
	});

	if (!postResult.ok) {
		throw error(postResult.error.status || 500, postResult.error.message);
	}

	const [commentsResult, relatedPostsResult] = await Promise.all([
		loadCommunityPostComments(
			postId,
			{
				cursor: event.url.searchParams.get("cursor"),
				sort_by: sortBy
			},
			{
				fetch: event.fetch,
				accessToken
			}
		),
		loadCommunityPostsPage(
			{
				category: postResult.data.category,
				sort_by: "-created_at"
			},
			{
				fetch: event.fetch,
				accessToken
			}
		)
	]);

	if (!commentsResult.ok) {
		throw error(commentsResult.error.status || 500, commentsResult.error.message);
	}

	return {
		post: postResult.data,
		relatedPosts: relatedPostsResult.ok
			? relatedPostsResult.data.results.filter((candidate) => candidate.id !== postResult.data.id).slice(0, 3)
			: [],
		commentsPage: commentsResult.data,
		commentForm: await superValidate({ content: "" }, yup(commentSchema)),
		currentPath: `${event.url.pathname}${event.url.search}`,
		commentSort: sortBy,
		isAuthenticated: Boolean(accessToken),
		loginHref: buildLoginRedirectUrl(event.url),
		commentPreviousHref: buildCursorHref(event.url, commentsResult.data.previousCursor),
		commentNextHref: buildCursorHref(event.url, commentsResult.data.nextCursor)
	};
}

/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 */
async function commentAction(event) {
	const postId = event.params.id;
	if (!postId) {
		throw error(400, "Missing post id.");
	}

	const form = await superValidate(event.request, yup(commentSchema));
	if (!form.valid) {
		return fail(400, { form });
	}

	const accessToken = requireValidatedAccessToken(event);
	const result = await createCommunityPostComment(
		postId,
		{ content: form.data.content },
		{ fetch: event.fetch, accessToken }
	);

	if (!result.ok) {
		if (result.error.code === "unauthorized") {
			throw redirect(303, buildLoginRedirectUrl(event.url));
		}
		return message(form, {
			error: "save_failed",
			msg: result.error.message
		}, { status: 400 });
	}

	throw redirect(303, `${event.url.pathname}${event.url.search}#comments`);
}

/** @type {import("@sveltejs/kit").Actions} */
export const actions = {
	comment: commentAction
};
