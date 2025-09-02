import { KEILA_TKN } from "$env/static/private"
import { json } from "@sveltejs/kit"


const KEILA_URL = 'http://keila.cr.romewithme.com/api/v1/contacts'

export const addContact = async (email, firstName = undefined, lastName = undefined, tags = []) => {
    if (!email) {
        return false
    }

    const body = {
        data: {
            data: {
                tags: [
                    ...tags
                ]
            },
            email: email,
        }
    }

    if (firstName) data.first_name = firstName;
    if (lastName) data.last_name = lastName;

    console.log(body)

    const response = await fetch(KEILA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${KEILA_TKN}`
        },
        body: JSON.stringify(body)
    })
    console.log(response.status)
    if (response.status === 400) {
        const jsonData = await response.json()
        console.log(jsonData)
        if (jsonData.errors) {
            console.log(jsonData)
            return jsonData
        }
    }
    else if (!response.ok) {
        const jsonData = await response.json()
        console.log(jsonData)
        return jsonData
    } else {
        const jsonData = await response.json()
        return jsonData.data.id
    }

}