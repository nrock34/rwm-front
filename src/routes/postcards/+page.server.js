import { error } from "@sveltejs/kit";
import { loadPostcardDirectoryPage } from "$domains/postcards";

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ url, fetch }) => {
	const result = await loadPostcardDirectoryPage({
		q: url.searchParams.get("q") ?? "",
		category: url.searchParams.get("category") ?? "",
		tag: url.searchParams.get("tag") ?? "",
		sort_by: url.searchParams.get("sort_by") ?? "",
		page: url.searchParams.get("page") ?? "1"
	}, { fetch });

	if (!result.ok) {
		throw error(result.error.status || 500, result.error.message);
	}

	return {
		directory: result.data,
		canonicalUrl: new URL(url.pathname, url.origin).toString()
	};
};
