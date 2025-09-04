import { getProgramDetail } from '$lib/server/gatherers/programs.js'

export const load = async ({params}) => {
    const id = params.id
    
    const programData = await getProgramDetail(id);

    return {
        programData
    }
}