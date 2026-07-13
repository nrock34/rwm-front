import { newsletterSignup } from '$lib/server/shared-actions/newsletter-signup.js';
import { loadCommunitySummary } from '$domains/community';
import { deriveCommunityStats, deriveHomeActivity } from '$domains/community/mappers.js';


/** @type {import("./$types").PageServerLoad} */
export const load = async ({ parent, fetch }) => {
    await parent();
    const summary = await loadCommunitySummary({ fetch });
    if (!summary.ok) {
        return { stats: [], recentActivity: [] };
    }

    return {
        stats: deriveCommunityStats(summary.data).map((stat) => ({
            number: new Intl.NumberFormat('en-US').format(stat.value),
            label: stat.name
        })),
        recentActivity: deriveHomeActivity(summary.data)
    };
};

/** @type {import("./$types").Actions} */
export const actions = {
    newsletterSignup
};
