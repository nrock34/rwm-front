import { API_URL } from '$env/static/private'

export const userCheck = async (username) => {

    const usercheck = await fetch(`${API_URL}auth/username/check`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            username
        })
    })
    if (!usercheck.ok) {
        return {exists: true}
    } else {
        return {exists: false}
    }

}