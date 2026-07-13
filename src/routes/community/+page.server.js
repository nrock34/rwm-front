import { error } from "@sveltejs/kit";
import { loadCommunitySummary } from "$domains/community";
import { deriveCommunityStats, deriveTrendingTags } from "$domains/community/mappers.js";
import { getValidatedAccessToken } from "$lib/auth/server.js";
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
		stats: deriveCommunityStats(summaryResult.data),
		trendingTags: deriveTrendingTags(summaryResult.data.posts),
		currentPath: `${event.url.pathname}${event.url.search}`
	};
};

export const actions = {
	newsletterSignup
};
