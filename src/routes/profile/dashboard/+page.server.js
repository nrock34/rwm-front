import { API_URL, ACS_TKN } from '$env/static/private';
import { savedItems } from '$lib/components/profile-page/test.js';
// import { program } from '$lib/components/programs-page/single-program-view/test.js';
import { error } from '@sveltejs/kit';
import { getActivityData, getApplicationsData } from '../utils.js';



export const load = async ({ fetch, data }) => {
    
    let savedItemData

    let activityData = await getActivityData(API_URL, ACS_TKN, fetch, error)
    let applicationsData = await getApplicationsData(API_URL, ACS_TKN, fetch, error)

    


    return {
         ...data, activityData, applicationsData,
    }
}