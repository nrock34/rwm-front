import { API_URL } from '$env/static/private';
import { verify } from '$lib/server/cookies.js';
import { passRefreshTkn } from '$lib/server/getRefreshTkn.js';
import { redirect } from '@sveltejs/kit';
import { Cookie } from 'lucide-svelte';


export async function POST({ locals, cookies, fetch }) {

    console.log(cookies.get('acs_tkn'))
    const rfh_token = cookies.get('rfh_tkn')
    
    if (rfh_token) {
        const response = await fetch(`${API_URL}auth/refresh`, { method: 'POST' })
        if (!response.ok) {
            console.log(response)
            return new Response(JSON.stringify({error: 'Failed to refresh', more: await response.json() }), {status: 401})
        }

        const data = await response.json();
        
        console.log(data)

        passRefreshTkn(cookies, response.headers)

        return new Response(JSON.stringify(data), { status: 200 });
    }

    return redirect(303, '/auth/login')

}