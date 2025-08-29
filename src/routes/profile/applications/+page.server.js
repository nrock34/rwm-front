import { getApplicationsData } from '../utils.js'
import { API_URL } from '$env/static/private'
import { error } from '@sveltejs/kit'



export const load = async ({ locals, fetch, data, parent }) => {

    const { ...parentData } = await parent()
    let ACS_TKN = parentData.token

    let applicationsData = await getApplicationsData(API_URL, ACS_TKN, fetch, error)

    return {
        ...data, applicationsData
    }
    
}