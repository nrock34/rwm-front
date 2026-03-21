import { error } from "@sveltejs/kit";
import { loadProgramCountries, loadProgramDirectoryPage } from "$domains/programs";

export const load = async ({ url, data, fetch }) => {
    const search = url.searchParams.get("q") ?? "";
    const sort = url.searchParams.get("sort_by") ?? "";

    const [programsResult, countriesResult] = await Promise.all([
        loadProgramDirectoryPage(
            { fetch },
            { ...Object.fromEntries(url.searchParams) }
        ),
        loadProgramCountries({ fetch })
    ]);

    if (!programsResult.ok) {
        throw error(programsResult.error.status || 500, programsResult.error.message);
    }

    return {
        ...data,
        ...programsResult.data,
        programCountries: countriesResult.ok ? countriesResult.data : [],
        search,
        sort
    };
};
