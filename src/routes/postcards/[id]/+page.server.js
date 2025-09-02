import { newsletterSignup } from '$lib/server/shared-actions/newsletter-signup.js'

export const load = async ({parent}) => {
    const data = await parent()
    console.log(data)
    return { data }
}


export const actions = {
    newsletterSignup
}