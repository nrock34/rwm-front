import { fileFieldProxy, message, superValidate } from "sveltekit-superforms"
import { yup } from "sveltekit-superforms/adapters"
import { schema } from "$lib/components/forms/auth/signup-schema.js"
import { API_URL } from "$env/static/private"
import { error } from "@sveltejs/kit"
import { sign } from "$lib/server/cookies.js"
import { passRefreshTkn } from "$lib/server/getRefreshTkn.js"

export const load = async ({ fetch }) => {
    const signupForm = await superValidate(yup(schema))


    return {
        signupForm: signupForm
    }
}


export const actions = {
    signup: async ({request, fetch, platform, cookies }) => {
        const form = await superValidate(request, yup(schema))

        if (!form.valid) {
            return message(form, 'invalid form')
        }

        const first_name = form.data.first_name
        const last_name = form.data.last_name
        const email = form.data.email
        const password = form.data.password
        const username = form.data.username

        
        const signupResponse = await fetch(`${API_URL}auth/register-tkn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name,
                last_name,
                username,
                email,
                password
            }),
            credentials: "include"
        })
        let signupData
        if (signupResponse.status === 400) {
            signupData = {
                ...(await signupResponse.json())
            }
            console.log(signupData)
            return message(form, signupData, {status: 403})
        } else if (signupResponse.status === 405) {
            signupData = {
                error: "disabled_acct",
                msg: "This account is disabled, contact us if you believe this to be an error."
            }
            return message(form, signupData, {status: 405})
        } else if (!signupResponse.ok) {
            error(signupResponse.status)
        } else {
            signupData = await signupResponse.json()

            const { acs_tkn, rfh_tkn, rfh_age } = signupData

            passRefreshTkn(cookies, signupResponse.headers)

            cookies.set(
                'acs_tkn', sign(acs_tkn),
                {
                    secure: true,
                    httpOnly: true,
                    path: '/',
                    sameSite: 'Strict',
                    maxAge: new Date().setMinutes(6)
                }
            )

            return message(form, acs_tkn)
        }
    }
}