import { getProgramList } from '$lib/server/gatherers/programs.js'

export const load = async ({params, url}) => {
    const pageNum = Number(url.searchParams.get('page') ?? 1) ;
    const search = url.searchParams.get('q') ?? '';

    const programs = await getProgramList(params)

    if (programs.next) data['next'] = postcards.next
    if (programs.prev) data['prev'] = postcards.prev

    
}