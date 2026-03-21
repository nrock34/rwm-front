import { message, superValidate } from "sveltekit-superforms"
import { yup } from "sveltekit-superforms/adapters"
import { schema } from "$lib/components/forms/auth/signup-schema.js"
import { error } from "@sveltejs/kit"
import { mapSignupFormData, passRefreshTokenCookie, setSignedAccessCookie, signupUser } from "$domains/auth/index.js"

/**
 * @param {import("../../../domains/auth/types.js").AuthSignupResult} result
 * @returns {import("../../../domains/auth/types.js").AuthFailure}
 */
function asAuthFailure(result) {
    return /** @type {import("../../../domains/auth/types.js").AuthFailure} */ (result)
}

/** @type {import("./$types").PageServerLoad} */
export const load = async () => {
    const signupForm = await superValidate(yup(schema))


    return {
        signupForm: signupForm
    }
}


/** @type {import("./$types").Actions} */
export const actions = {
    signup: async ({ request, fetch, cookies, url }) => {
        const form = await superValidate(request, yup(schema))

        if (!form.valid) {
            return message(form, 'invalid form')
        }

        const payload = mapSignupFormData(form.data)
        const result = await signupUser(payload, { fetch })

        if (!result.ok) {
            const failure = asAuthFailure(result)

            if (failure.error.code === "invalid_payload") {
                return message(form, {
                    ...(typeof failure.error.details === "object" && failure.error.details !== null ? failure.error.details : {})
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

        return message(form, result.data.acs_tkn)
    }
}
