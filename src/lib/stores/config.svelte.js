import { API_URL } from "$env/static/private"

let cachedConfig = null 

export function newConfig() {
    let config = cachedConfig

    async function loadConfig(params) {
        if (cachedConfig) return
        const res = await fetch(`${API_URL}site-properties`)
        cachedConfig = await res.json()
        config = cachedConfig
    }

    return { config, loadConfig }
}