import { API_URL } from '$env/static/private'

export const load = async ({ fetch }) => {

    const usercheck = await fetch(`${API_URL}auth/username/check`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            username: 'laUra229'
        })
    })

    const opps = await usercheck.json()
    console.log(opps)
    return ({opps})
}