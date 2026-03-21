import { browser } from "$app/environment";
import { jwtDecode } from "jwt-decode";
import { getContext, setContext } from "svelte"

class TokenStateClass {

    constructor(token) {
        this.token = $state(token || null)
        if (this.token && !this.isExpired && browser) {
            this.scheduleRefresh()
        } else if (this.isExpired) {
            this.token = null
        }
    }
    
    refreshTimer = $state(null)

    getPayload = () => {
        if (this.token) return jwtDecode(this.token);
        else return this.token;
    }

    getExpiration = () => {
        const exp = this.getPayload()?.exp
        return exp ? exp * 1000 : null
    }

    clear = () => {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer)
            this.refreshTimer = null
        }
        this.token = null
    }

    syncToken = (token) => {
        if (!token) {
            this.clear()
            return
        }

        if (this.token === token && this.refreshTimer) {
            return
        }

        this.token = token
        if (this.isExpired) {
            this.clear()
            return
        }

        if (!browser) {
            return
        }

        this.scheduleRefresh()
    }

    refreshAccessToken = async () => {
        if (!browser) {
            return
        }

        const res = await fetch('/auth/refresh', {method: 'POST'});
        const body = await res.json().catch(() => null);

        if (res.ok) {
            const nextToken = typeof body?.acs_tkn === "string" ? body.acs_tkn : null
            this.syncToken(nextToken)
        } else {
            this.clear()
        }
       
    }

    scheduleRefresh = () => {
        if (!browser) {
            return
        }

        if (!this.token) {
            this.clear()
            return
        }

        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer)
        }

        const expiration = this.getExpiration()
        if (!expiration) {
            this.clear()
            return
        }

        const now = Date.now()
        const refresh = expiration - now - (1 * 30 * 1000)
        if (refresh <= 0) {
            void this.refreshAccessToken()
            return
        }
        this.refreshTimer = setTimeout(async () => {
            await this.refreshAccessToken()
        }, refresh)
    }

    isExpired = $derived.by(() =>
        (this.getExpiration() ?? (Date.now() + 99999)) < Date.now()
    )

}

const DEFAULT_KEY = '$_token_state';

export const getTokenState = (key = DEFAULT_KEY) => {
    return getContext(key)
}

export const setTokenState = (tkn, key = DEFAULT_KEY) => {
    const state = getTokenState(key)

    if (!state) {
        const tokenState = new TokenStateClass(tkn);
        const newCtx = setContext(key, tokenState);
        return newCtx
    }
    return state
}
