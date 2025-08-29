/** @type {import('./$types').PageLoad} */

import { getPostcardDetail } from '$lib/server/gatherers/postcards';
import { error } from '@sveltejs/kit';


export async function load({params}) {

    const id = params.id
    const postcardData = await getPostcardDetail(id)
    if (parseInt(id) > 5) {

        return {
            postcardData,
            id,
            content: `Page Welcome to Journey #${id}`
        };

    }

    error(404);

};