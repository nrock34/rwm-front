import { error } from "@sveltejs/kit";
import { loadCommunityPostsPage } from "$domains/community";
import { getValidatedAccessToken } from "$lib/auth/server.js";

/**
 * @param {URL} url
 * @param {string | null} cursor
 * @returns {string | null}
 */
function buildCursorHref(url, cursor) {
	if (!cursor) return null;
	const next = new URL(url);
	next.searchParams.set("cursor", cursor);
	return `${next.pathname}${next.search}`;
}

/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 */
export async function load(event) {
	const accessToken = getValidatedAccessToken(event);
	const filters = {
		q: event.url.searchParams.get("q") ?? "",
		category: event.url.searchParams.get("category") ?? "all",
		type: event.url.searchParams.get("type") ?? "all",
		tag: event.url.searchParams.get("tag") ?? "",
		sort_by: event.url.searchParams.get("sort_by") ?? "-created_at",
		cursor: event.url.searchParams.get("cursor")
	};

	const result = await loadCommunityPostsPage(
		{
			q: filters.q || null,
			category: filters.category === "all" ? null : filters.category,
			type: filters.type === "all" ? null : filters.type,
			tag: filters.tag || null,
			sort_by: filters.sort_by === "-created_at" ? null : filters.sort_by,
			cursor: filters.cursor
		},
		{
			fetch: event.fetch,
			accessToken
		}
	);

	if (!result.ok) {
		throw error(result.error.status || 500, result.error.message);
	}

	return {
		postsPage: result.data,
		filters,
		currentPath: `${event.url.pathname}${event.url.search}`,
		previousHref: buildCursorHref(event.url, result.data.previousCursor),
		nextHref: buildCursorHref(event.url, result.data.nextCursor)
	};
}
