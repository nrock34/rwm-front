import { error } from "@sveltejs/kit";
import { loadProfileApplications } from "../../../domains/profile/index.js";
import { asProfileFailure } from "../../../domains/profile/types.js";

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ fetch, data, locals }) => {
	const applicationsResult = await loadProfileApplications({
		fetch,
		accessToken: locals.token
	});

	if (!applicationsResult.ok) {
		const failure = asProfileFailure(applicationsResult);
		throw error(failure.error.status || 500, failure.error.message);
	}

	return {
		...data,
		applicationsData: applicationsResult.data
	};
};
