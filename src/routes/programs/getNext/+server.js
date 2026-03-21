import { json } from "@sveltejs/kit";
import { loadProgramDirectoryPage } from "$domains/programs";


export const GET = async ({ url, fetch }) => {
    const cursor = url.searchParams.get("cursor") ?? null;
    if (!cursor) {
        return json({ message: "Missing cursor." }, { status: 400 });
    }

    const result = await loadProgramDirectoryPage(
        { fetch },
        { ...Object.fromEntries(url.searchParams) }
    );

    if (!result.ok) {
        return json({ message: result.error.message }, { status: result.error.status || 500 });
    }

    return json(result.data, {
        status: result.status,
        headers: result.headers
    });
};
