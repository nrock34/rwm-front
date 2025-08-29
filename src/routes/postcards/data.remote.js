import { query } from "$app/server";
import { getPostcardsList } from "$lib/server/gatherers/postcards";


export const getPostcards = query(async (tag, category, search, sortBy) => {

    const postcards = await getPostcardsList(
        {
            tag: tag ?? '',
            category: category ?? '',
            search: search ?? '',
            sortBy: sortBy ?? '',
        }
    )
    return postcards;
});