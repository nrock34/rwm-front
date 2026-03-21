import { error } from "@sveltejs/kit";
import { loadScholarshipDetailPage } from "$domains/scholarships";
import { getValidatedAccessToken } from "$lib/auth/server.js";

/**
 * @param {import("./$types").PageServerLoadEvent} event
 */
export async function load(event) {
	const scholarshipId = event.params.id;
	if (!scholarshipId) {
		throw error(400, "Missing scholarship id.");
	}

	const result = await loadScholarshipDetailPage(scholarshipId, {
		fetch: event.fetch,
		accessToken: getValidatedAccessToken(event)
	});

	if (!result.ok) {
		throw error(result.error.status || 500, result.error.message);
	}

	return result.data;
}
