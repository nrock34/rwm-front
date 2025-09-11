import { verify } from '$lib/server/cookies.js'
import { newConfig, SiteConfig } from '$lib/stores/config.svelte.js'

export const load = async ({ data, cookies }) => {

    const cookie = cookies.get('acs_tkn')
    const acs_tkn = cookie ? verify(cookie) : null

    // const properties = newConfig()
    // await properties.loadConfig()

    return {
        ...data,
        // config: properties.config,
        acs_tkn
    }

}