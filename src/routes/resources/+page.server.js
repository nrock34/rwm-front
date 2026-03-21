import { error } from "@sveltejs/kit";
import { loadResourceCollections } from "$domains/resources";

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ fetch }) => {
	const result = await loadResourceCollections({ fetch });
	if (!result.ok) {
		throw error(result.error.status || 500, result.error.message);
	}

	return {
		resourcesByCategory: result.data
	};
};
