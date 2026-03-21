import { error } from "@sveltejs/kit";
import { loadProfileSummary } from "../../domains/profile/index.js";
import { asProfileFailure } from "../../domains/profile/types.js";

/**
 * @param {unknown} details
 * @param {string} fallback
 * @returns {string}
 */
function getApiErrorMessage(details, fallback) {
	if (typeof details === "string" && details.length > 0) {
		return details;
	}

	if (details instanceof Error && typeof details.message === "string" && details.message.length > 0) {
		return details.message;
	}

	if (details && typeof details === "object" && !Array.isArray(details)) {
		const record = /** @type {Record<string, unknown>} */ (details);

		if (typeof record.error === "string" && record.error.length > 0) {
			return record.error;
		}

		if (typeof record.detail === "string" && record.detail.length > 0) {
			return record.detail;
		}
	}

	return fallback;
}

/** @type {import("./$types").LayoutServerLoad} */
export const load = async ({ fetch, locals }) => {
	const profileResult = await loadProfileSummary({
		fetch,
		accessToken: locals.token
	});

	if (!profileResult.ok) {
		const failure = asProfileFailure(profileResult);
		throw error(
			failure.error.status || 500,
			getApiErrorMessage(failure.error.details, failure.error.message)
		);
	}

	return {
		profileData: profileResult.data
	};
};
