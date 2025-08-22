import { API_URL } from '$env/static/private';
import { verify } from '$lib/server/cookies.js';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch, locals, cookies }) => {

    let profileData;

    let ACS_TKN = locals.token

    const fetchProfileDataResp = await fetch(`${API_URL}users/me/profile`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ACS_TKN}`
        }
    })
    if (!fetchProfileDataResp.ok) {
        error(fetchProfileDataResp.status, "Error fetching profile")
    } else {

        let data = await fetchProfileDataResp.json()
        let { name, profile, username, location, major, phone_num, university } = data

        //console.log(data)

        profileData = { 
            name: name,
            email: 'sarah.johnson@email.com',
            phone: '+1 (555) 123-4567',
            location: location,
            university: university,
            major: major,
            bio: profile.bio,
            avatar: profile.avatar
        }
    }

    return {
        profileData
    }

}