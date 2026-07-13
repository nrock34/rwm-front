import { error } from "@sveltejs/kit";
import { loadPublicProfile } from "$domains/profile/index.js";
import { asProfileFailure } from "$domains/profile/types.js";

/**
 * @param {unknown} details
 * @param {string} fallback
 * @returns {string}
 */
function getApiErrorMessage(details, fallback) {
	if (typeof details === "string" && details.length > 0) return details;
	if (details && typeof details === "object" && !Array.isArray(details)) {
		const record = /** @type {Record<string, unknown>} */ (details);
		if (typeof record.detail === "string" && record.detail.length > 0) return record.detail;
		if (typeof record.error === "string" && record.error.length > 0) return record.error;
	}
	return fallback;
}

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ fetch, locals, params }) => {
	const result = await loadPublicProfile({
		fetch,
		accessToken: locals.token,
		profileUserId: params.id
	});

	if (!result.ok) {
		const failure = asProfileFailure(result);
		throw error(
			failure.error.status || 500,
			getApiErrorMessage(failure.error.details, failure.error.message)
		);
	}

	return {
		profileData: result.data
	};
};
