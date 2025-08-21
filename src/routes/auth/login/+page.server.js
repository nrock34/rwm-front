import { fileFieldProxy, message, superValidate } from "sveltekit-superforms"
import { yup } from "sveltekit-superforms/adapters"
import { schema } from "$lib/components/forms/auth/login-schema.js"
import { API_URL, COOKIE_SECRET } from "$env/static/private"
import { error } from "@sveltejs/kit"
import { sign } from "$lib/server/cookies.js"

export const load = async ({ fetch }) => {
    console.log(schema)
    console.log(3838)
    const loginForm = await superValidate(yup(schema))

    return {
        loginForm: loginForm
    }
}


export const actions = {
    login: async ({request, fetch, platform, cookies }) => {
        const form = await superValidate(request, yup(schema))

        if (!form.valid) {
            return message(form, 'invalid form')
        }

        const email = form.data.email
        const password = form.data.password

        
        const loginResponse = await fetch(`${API_URL}auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            }),
            credentials: "include"
        })
        let loginData
        if (loginResponse.status === 403) {
            loginData = {
                error: "invalid_creds",
                msg: "The information provided doesn't match that of any user."
            }
            return message(form, loginData, {status: 403})
        } else if (loginResponse.status === 405) {
            loginData = {
                error: "disabled_acct",
                msg: "This account is disabled, contact us if you believe this to be an error."
            }
            return message(form, loginData, {status: 405})
        } else if (!loginResponse.ok) {
            error(loginResponse.status)
        } else {
            loginData = await loginResponse.json()

            const { acs_tkn, rfh_tkn, rfh_age } = loginData

            cookies.set(
                'rfh_tkn', sign(rfh_tkn), {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    path: '/',
                    maxAge: rfh_age
                }
            )

            cookies.set(
                'acs_tkn', sign(acs_tkn), {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    path: '/'
                }
            )
            

            return message(form, acs_tkn)
        }
    }
}