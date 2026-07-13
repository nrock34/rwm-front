import { error } from "@sveltejs/kit";
import { loadPostcardDetailPage } from "$domains/postcards";
import { newsletterSignup } from "$lib/server/shared-actions/newsletter-signup.js";

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ params, fetch, url }) => {
	const postcardId = Number(params.id);
	if (!Number.isSafeInteger(postcardId) || postcardId <= 0) {
		throw error(404, "Postcard not found.");
	}

	const result = await loadPostcardDetailPage(postcardId, { fetch });
	if (!result.ok) {
		throw error(result.error.status || 500, result.error.message);
	}

	return {
		...result.data,
		canonicalUrl: new URL(url.pathname, url.origin).toString()
	};
};

export const actions = { newsletterSignup };
