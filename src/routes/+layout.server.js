import { verify } from '$lib/server/cookies.js'

export const load = async ({ cookies }) => {

    const cookie = cookies.get('acs_tkn')
    const acs_tkn = cookie ? verify(cookie) : null

    return {
        acs_tkn
    }

}