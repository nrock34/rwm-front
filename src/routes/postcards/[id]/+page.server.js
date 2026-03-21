import { newsletterSignup } from '$lib/server/shared-actions/newsletter-signup.js'

export const load = async ({parent}) => {
    const data = await parent()
    return { data }
}


export const actions = {
    newsletterSignup
}