import { error } from "@sveltejs/kit";
import { loadScholarshipDirectory } from "$domains/scholarships";

/**
 * @param {import("./$types").PageServerLoadEvent} event
 */
export async function load(event) {
	const result = await loadScholarshipDirectory({
		fetch: event.fetch
	});

	if (!result.ok) {
		throw error(result.error.status || 500, result.error.message);
	}

	return {
		scholarshipItems: result.data
	};
}
