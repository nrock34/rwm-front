import { error } from "@sveltejs/kit";
import { loadCommunitySummary } from "$domains/community";
import { getValidatedAccessToken } from "$lib/auth/server.js";
import { communityStats, communityTrendingTags } from "$lib/mocks/community.js";
import { newsletterSignup } from "$lib/server/shared-actions/newsletter-signup.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async (event) => {
	const accessToken = getValidatedAccessToken(event);
	const summaryResult = await loadCommunitySummary({
		fetch: event.fetch,
		accessToken
	});

	if (!summaryResult.ok) {
		throw error(summaryResult.error.status || 500, summaryResult.error.message);
	}

	return {
		summary: summaryResult.data,
		stats: communityStats,
		trendingTags: communityTrendingTags,
		currentPath: `${event.url.pathname}${event.url.search}`
	};
};

export const actions = {
	newsletterSignup
};
