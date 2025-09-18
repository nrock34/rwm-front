import { ACS_TKN, API_URL } from '$env/static/private'
import { error } from '@sveltejs/kit'
import { getActivityData } from '../utils.js'


export const load = async ({ fetch, data }) => {

    let activityData = await getActivityData(API_URL, ACS_TKN, fetch, error)

    console.log(activityData)

    return {
        ...data, activityData
    }
    
}