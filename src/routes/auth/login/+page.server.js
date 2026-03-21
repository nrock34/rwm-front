import { message, superValidate } from "sveltekit-superforms"
import { yup } from "sveltekit-superforms/adapters"
import { schema } from "$lib/components/forms/auth/login-schema.js"
import { error, redirect } from "@sveltejs/kit"
import { loginUser, mapLoginFormData, passRefreshTokenCookie, setSignedAccessCookie } from "$domains/auth/index.js"
import { sanitizeRelativeRedirectTarget } from "$lib/auth/redirect.js"

/**
 * @param {import("../../../domains/auth/types.js").AuthLoginResult} result
 * @returns {import("../../../domains/auth/types.js").AuthFailure}
 */
function asAuthFailure(result) {
    return /** @type {import("../../../domains/auth/types.js").AuthFailure} */ (result)
}

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ url }) => {
    const loginForm = await superValidate(yup(schema))
    const redirectTo = sanitizeRelativeRedirectTarget(url.searchParams.get("redirectTo"))

    return {
        loginForm: loginForm,
        redirectTo
    }
}


/** @type {import("./$types").Actions} */
export const actions = {
    login: async ({ request, fetch, cookies, url }) => {
        const formData = await request.formData()
        const redirectTo = sanitizeRelativeRedirectTarget(formData.get("redirectTo") ?? url.searchParams.get("redirectTo"))
        const form = await superValidate(formData, yup(schema))

        if (!form.valid) {
            return message(form, 'invalid form')
        }

        const payload = mapLoginFormData(form.data)
        const result = await loginUser(payload, { fetch })

        if (!result.ok) {
            const failure = asAuthFailure(result)

            if (failure.error.code === "invalid_creds") {
                return message(form, {
                    error: "invalid_creds",
                    msg: "The information provided doesn't match that of any user."
                }, {status: 403})
            }
            if (failure.error.code === "disabled_acct") {
                return message(form, {
                    error: "disabled_acct",
                    msg: "This account is disabled, contact us if you believe this to be an error."
                }, {status: 405})
            }
            throw error(failure.error.status, failure.error.message)
        }

        const isHttps = url?.protocol === 'https:';
        passRefreshTokenCookie(cookies, result.headers, { secureOverride: isHttps })
        setSignedAccessCookie(cookies, result.data.acs_tkn, { secure: isHttps })

        throw redirect(303, redirectTo)
    }
}
