/** @type {import('./$types').PageLoad} */

import { error } from '@sveltejs/kit';


export async function load({params}) {

    const id = params.id
    if (parseInt(id) > 500) {

        return {
            id,
            content: `Page Welcome to Journey #${id}`
        };

    }

    error(404);

};