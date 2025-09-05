import { API_URL } from '$env/static/private';
import { getProgramList } from '$lib/server/gatherers/programs.js';
import { json } from '@sveltejs/kit';


export const GET = async ({ request, url }) => {
    const cursor = url.searchParams.get('cursor') ?? null;
    if (cursor) {
        const api = new URL(`${API_URL}programs/list`)
        api.searchParams.set('cursor', cursor);

        const response = await getProgramList({url: api.href})

        console.log(response)
        return json(response)
    }

    return new Response('Hi')
}