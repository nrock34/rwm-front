import { getApplicationsData } from '../utils.js'
import { API_URL } from '$env/static/private'
import { error } from '@sveltejs/kit'



export const load = async ({ locals, fetch, data }) => {

    let ACS_TKN = locals.token

    let applicationsData = await getApplicationsData(API_URL, ACS_TKN, fetch, error)

    return {
        ...data, applicationsData
    }
    
}