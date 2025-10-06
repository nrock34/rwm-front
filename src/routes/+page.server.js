import { addContact } from '$lib/server/newsletter/add-contact';
import { newsletterSignup } from '$lib/server/shared-actions/newsletter-signup.js';
import { error, fail } from '@sveltejs/kit';


export const load = async ({parent}) => {
    await parent();
}

export const actions = {
    newsletterSignup
}