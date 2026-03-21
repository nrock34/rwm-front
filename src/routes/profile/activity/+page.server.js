import { error } from "@sveltejs/kit";
import { loadProfileActivity } from "../../../domains/profile/index.js";
import { asProfileFailure } from "../../../domains/profile/types.js";

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ fetch, data, locals }) => {
	const activityResult = await loadProfileActivity({
		fetch,
		accessToken: locals.token
	});

	if (!activityResult.ok) {
		const failure = asProfileFailure(activityResult);
		throw error(failure.error.status || 500, failure.error.message);
	}

	return {
		...data,
		activityData: activityResult.data
	};
};
