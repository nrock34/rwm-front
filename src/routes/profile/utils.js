import { ACS_TKN, API_URL } from "$env/static/private"
import { applications } from "$lib/components/profile-page/test"
import { error } from "@sveltejs/kit"


export const getActivityData = async ( API_URL, ACS_TKN, fetch, error) => {

    let activityData

    const fetchActivityResponse = await fetch(
        `${API_URL}users/me/activity`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACS_TKN}`
            }
        }
    ) 
    if (!fetchActivityResponse.ok) {
        error(fetchActivityResponse.status)
    } else {
        activityData = await fetchActivityResponse.json()

        activityData = activityData.map( (activity) => (
            {
                id: 1, //need activityid
                type: 'post',
                action: activity.action,
                target: 'Amazing sunset from the Spanish Steps tonight!',
                targetObjId: activity.object_id,
                user: 'Marco Benedetti',
                timestamp: activity.timestamp
            }
        )
        )
        console.log(activityData)
    }

    return activityData

}



export const getApplicationsData = async ( API_URL, ACS_TKN, fetch, error) => {
    let applicationsData

    const fetchApplicationsResponse = await fetch(
        `${API_URL}users/me/applications`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACS_TKN}`
            }
        }
    )
    if (!fetchApplicationsResponse.ok) {
        error(fetchApplicationsResponse.status)
    } else {
        applicationsData = await fetchApplicationsResponse.json()

        console.log(applicationsData)

        applicationsData = applicationsData.map((application) => {
            return { 
                id: 1,
                title: application.application_to.name,
                type: application.type,
                status: application.status,
                deadline: application.app_info.deadline,
                submitted: '2024-01-20',
                progress: application.progress
            }
        })

        console.log(applicationsData)

    }

    return applicationsData
}