import { error, json } from "@sveltejs/kit";
import { loadResourceDetail } from "$domains/resources";

/** @type {import("./$types").RequestHandler} */
export async function GET({ params, fetch }) {
	const id = Number(params.id);
	if (!Number.isFinite(id)) {
		throw error(404, "Resource not found");
	}

	const result = await loadResourceDetail(id, { fetch });
	if (!result.ok) {
		throw error(result.error.status || 500, result.error.message);
	}

	return json({ resource: result.data });
}
