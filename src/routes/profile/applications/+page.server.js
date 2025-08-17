import { getApplicationsData } from '../utils.js'
import { API_URL, ACS_TKN } from '$env/static/private'
import { error } from '@sveltejs/kit'



export const load = async ({ fetch, data }) => {

    let applicationsData = await getApplicationsData(API_URL, ACS_TKN, fetch, error)

    return {
        ...data, applicationsData
    }
    
}