import { getProgramList } from '$lib/server/gatherers/programs.js'

export const load = async ({params, url}) => {
    const search = url.searchParams.get('q') ?? '';
    const sort = url.searchParams.get('sort_by') ?? '';

    const programs = await getProgramList({
        params: {...Object.fromEntries(url.searchParams)}
    })

    // console.log(JSON.stringify(programs, null, 4))

    const data = {
        ...programs,
    }

    return {
        ...data,
        search,
        sort
    }
}