import { getProgramList } from '$lib/server/gatherers/programs.js'

export const load = async ({params, url}) => {
    const pageNum = Number(url.searchParams.get('page') ?? 1) ;
    const search = url.searchParams.get('q') ?? '';

    const programs = await getProgramList({params})

    console.log(programs)

    const data = {
        ...programs,
        next: programs.next?.split('cursor=')[1]
    }

    console.log(data, 222)
    return {
        ...data
    }
}