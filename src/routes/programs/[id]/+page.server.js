import { error } from "@sveltejs/kit";
import { loadProgramDetailPage } from "$domains/programs";

export const load = async ({ params, fetch }) => {
    const id = params.id;
    if (!id) {
        throw error(400, "Missing program id.");
    }

    const result = await loadProgramDetailPage(id, { fetch });
    if (!result.ok) {
        throw error(result.error.status || 500, result.error.message);
    }

    return {
        programData: result.data
    };
};
