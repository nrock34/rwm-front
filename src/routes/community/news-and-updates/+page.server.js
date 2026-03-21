import { error } from "@sveltejs/kit";
import { loadCommunityUpdatesPage } from "$domains/community";

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
	const result = await loadCommunityUpdatesPage({
		cursor: event.url.searchParams.get("cursor")
	}, {
		fetch: event.fetch
	});

	if (!result.ok) {
		throw error(result.error.status || 500, result.error.message);
	}

	return {
		updatesPage: result.data,
		previousHref: buildCursorHref(event.url, result.data.previousCursor),
		nextHref: buildCursorHref(event.url, result.data.nextCursor)
	};
}
