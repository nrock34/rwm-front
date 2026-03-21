const ONBOARDING_TEST_SUCCESS_COOKIE = "onboarding_test_success_payload";

/**
 * @param {string | undefined} value
 * @returns {unknown | null}
 */
function parsePayload(value) {
	if (!value) return null;

	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ cookies }) => {
	return {
		payload: parsePayload(cookies.get(ONBOARDING_TEST_SUCCESS_COOKIE))
	};
};
