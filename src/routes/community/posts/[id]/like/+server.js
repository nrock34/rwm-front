import { error, redirect } from "@sveltejs/kit";
import { sanitizeRelativeRedirectTarget } from "$lib/auth/redirect.js";
import { buildLoginRedirectUrl } from "$lib/auth/redirect.js";
import { getValidatedAccessToken } from "$lib/auth/server.js";
import { toggleCommunityPostLike } from "$domains/community";

/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 */
export async function POST(event) {
	const postId = event.params.id;
	if (!postId) {
		throw error(400, "Missing post id.");
	}

	const accessToken = getValidatedAccessToken(event);
	const redirectTarget = sanitizeRelativeRedirectTarget(
		event.url.searchParams.get("redirectTo"),
		`/community/posts/${postId}`
	);

	if (!accessToken) {
		throw redirect(303, buildLoginRedirectUrl(new URL(redirectTarget, event.url)));
	}

	const result = await toggleCommunityPostLike(postId, {
		fetch: event.fetch,
		accessToken
	});

	if (!result.ok) {
		if (result.error.code === "unauthorized") {
			throw redirect(303, buildLoginRedirectUrl(new URL(redirectTarget, event.url)));
		}
		throw error(result.error.status || 500, result.error.message);
	}

	throw redirect(303, redirectTarget);
}
