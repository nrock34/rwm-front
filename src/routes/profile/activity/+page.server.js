import { ACS_TKN, API_URL } from '$env/static/private'
import { error } from '@sveltejs/kit'
import { getActivityData } from '../utils.js'


export const load = async ({ locals, fetch, data, parent }) => {

    let { ...parentData} = await parent()
    let ACS_TKN = parentData.token

    let activityData = await getActivityData(API_URL, ACS_TKN, fetch, error)

    return {
        ...data, activityData
    }
    
}