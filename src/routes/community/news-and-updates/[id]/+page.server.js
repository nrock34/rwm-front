import { error } from "@sveltejs/kit";
import { loadCommunityUpdateDetail, loadCommunityUpdatesPage } from "$domains/community";
import { requireValidatedAccessToken } from "$lib/auth/server.js";

/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 */
export async function load(event) {
	const updateId = event.params.id;
	if (!updateId) {
		throw error(400, "Missing update id.");
	}

	const accessToken = requireValidatedAccessToken(event);
	const [detailResult, updatesResult] = await Promise.all([
		loadCommunityUpdateDetail(updateId, {
			fetch: event.fetch,
			accessToken
		}),
		loadCommunityUpdatesPage({}, {
			fetch: event.fetch
		})
	]);

	if (!detailResult.ok) {
		throw error(detailResult.error.status || 500, detailResult.error.message);
	}

	return {
		update: detailResult.data,
		relatedUpdates: updatesResult.ok
			? updatesResult.data.results.filter((candidate) => candidate.id !== detailResult.data.id).slice(0, 3)
			: []
	};
}
