import {
	loadCommunityFeaturedPrograms,
	loadCommunityFeaturedScholarships,
	loadCommunitySummaryPosts,
	loadCommunitySummaryUpdates
} from "$domains/community";
import { getValidatedAccessToken } from "$lib/auth/server.js";
import { communityStats, communityTrendingTags } from "$lib/mocks/community.js";
import { newsletterSignup } from "$lib/server/shared-actions/newsletter-signup.js";
import { deriveUpcomingDeadlines } from "$domains/community/mappers.js";

/** @type {import("$domains/community/types.js").CommunityPostCard[]} */
const EMPTY_POSTS = [];
/** @type {import("$domains/community/types.js").CommunityUpdateCard[]} */
const EMPTY_UPDATES = [];
/** @type {import("$domains/community/types.js").CommunityProgramCard[]} */
const EMPTY_PROGRAMS = [];
/** @type {import("$domains/community/types.js").CommunityScholarshipCard[]} */
const EMPTY_SCHOLARSHIPS = [];
/** @type {import("$domains/community/types.js").CommunityDeadlineItem[]} */
const EMPTY_DEADLINES = [];

/** @type {import('./$types').PageServerLoad} */
export const load = (event) => {
	const accessToken = getValidatedAccessToken(event);

	const posts = loadCommunitySummaryPosts({
		fetch: event.fetch,
		accessToken
	}).then(
		(result) => (result.ok ? result.data : EMPTY_POSTS)
	).catch(() => EMPTY_POSTS);

	const updates = loadCommunitySummaryUpdates(
		{ fetch: event.fetch }
	).then(
		(result) => (result.ok ? result.data : EMPTY_UPDATES)
	).catch(
		() => EMPTY_UPDATES
	);

	const featuredPrograms = loadCommunityFeaturedPrograms({
		fetch: event.fetch
	}).then(
		(result) => (result.ok ? result.data : EMPTY_PROGRAMS))
	.catch(() => EMPTY_PROGRAMS);

	const featuredScholarships = loadCommunityFeaturedScholarships({
		fetch: event.fetch
	}).then(
		(result) => (result.ok ? result.data : EMPTY_SCHOLARSHIPS)
	).catch(() => EMPTY_SCHOLARSHIPS);

	const upcomingDeadlines = Promise.all([featuredPrograms, featuredScholarships])
		.then(([programs, scholarships]) => deriveUpcomingDeadlines(programs, scholarships))
		.catch(() => EMPTY_DEADLINES);

	return {
		posts,
		updates,
		featuredPrograms,
		featuredScholarships,
		upcomingDeadlines,
		stats: communityStats,
		trendingTags: communityTrendingTags,
		currentPath: `${event.url.pathname}${event.url.search}`
	};
};

export const actions = {
	newsletterSignup
};
