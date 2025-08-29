import { API_URL } from '$env/static/private';
import { sign, verify, verifyNotExpired } from '$lib/server/cookies.js';
import { error, redirect } from '@sveltejs/kit';


export const load = async ({ fetch, cookies, locals }) => {

    let profileData;
    let ACS_TKN

    const tknCookie = await cookies.get('acs_tkn')
    let acstkn = tknCookie ? verify(tknCookie) : null

    if (!verifyNotExpired(acstkn)) {
        const resp = await fetch('/auth/refresh', {method: 'POST'})
        if (!resp.ok) {
            redirect(303, '/auth/login')
        } else {
            const { acs_tkn } = await resp.json()
            locals.token = acs_tkn
            ACS_TKN = acs_tkn
            await cookies.set('acs_tkn', sign(acs_tkn), {
                secure: true,
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 8400,
                path: '/'
            })
        }
    } else {
        ACS_TKN = acstkn
        locals.token = acstkn
    }

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
        token: locals.token,
        profileData
    }

}