import { error } from "@sveltejs/kit";
import { loadProfileSavedItems } from "../../../domains/profile/index.js";
import { asProfileFailure } from "../../../domains/profile/types.js";

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ fetch, data, locals }) => {
	const savedItemsResult = await loadProfileSavedItems({
		fetch,
		accessToken: locals.token
	});

	if (!savedItemsResult.ok) {
		const failure = asProfileFailure(savedItemsResult);
		throw error(failure.error.status || 500, failure.error.message);
	}

	return {
		...data,
		savedItemData: savedItemsResult.data
	};
};
