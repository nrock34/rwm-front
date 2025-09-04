import { API_URL } from "$env/static/private"
import { error } from "@sveltejs/kit"

export const getProgramDetail = async (id) => {
    const response = await fetch(`${API_URL}programs/${id}`)

    if (!response.ok) {
        if (response.status === 404) return error(
            404, {msg: response.statusText}
        )
    }

    console.log(await response.json())
}