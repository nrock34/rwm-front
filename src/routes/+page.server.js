import { newsletterSignup } from '$lib/server/shared-actions/newsletter-signup.js';


/** @type {import("./$types").PageServerLoad} */
export const load = async ({ parent }) => {
    await parent();
    return {};
};

/** @type {import("./$types").Actions} */
export const actions = {
    newsletterSignup
};
