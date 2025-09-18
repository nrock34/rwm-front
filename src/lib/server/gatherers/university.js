import { API_URL } from "$env/static/private"
import { error } from "@sveltejs/kit"

export const getUniDetail = async (id) => {

    const response = await fetch(`${API_URL}universities/${id}`)

    if (!response.ok) {
        if (response.status === 404) {
            return error(404, {"message": 'University not found for ', id})
        }
        else return error(400, {message: 'Error'})
    }

    const data = await response.json()

    return data

}