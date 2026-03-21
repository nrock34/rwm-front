import { error } from "@sveltejs/kit";
import {
	loadProfileActivity,
	loadProfileApplications,
	loadProfileSavedItems
} from "../../../domains/profile/index.js";
import { asProfileFailure } from "../../../domains/profile/types.js";

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ fetch, data, locals }) => {
	const [activityResult, applicationsResult, savedItemsResult] = await Promise.all([
		loadProfileActivity({
			fetch,
			accessToken: locals.token
		}),
		loadProfileApplications({
			fetch,
			accessToken: locals.token
		}),
		loadProfileSavedItems({
			fetch,
			accessToken: locals.token
		})
	]);

	for (const result of [activityResult, applicationsResult, savedItemsResult]) {
		if (!result.ok) {
			const failure = asProfileFailure(result);
			throw error(failure.error.status || 500, failure.error.message);
		}
	}

	return {
		...data,
		activityData: activityResult.data,
		applicationsData: applicationsResult.data,
		savedItemData: savedItemsResult.data
	};
};
