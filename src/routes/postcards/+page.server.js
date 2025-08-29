import { getPostcardsList } from '$lib/server/gatherers/postcards.js'


export const load = async ({ event, url, fetch }) => {

    const pageNum = Number(url.searchParams.get('page') ?? 1) ;
    const search = url.searchParams.get('q') ?? ''

    console.log(pageNum , ' page num')

    const postcards = await getPostcardsList({
        ...Object.fromEntries(url.searchParams)
    });

    let data = {
        pageCount: postcards.count,
        results: postcards.postcards
    }

    if (postcards.next) data['next'] = postcards.next
    if (postcards.prev) data['prev'] = postcards.prev

    return {
        ...data,
        pageNum
    }

}