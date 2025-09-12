import { jwtDecode } from "jwt-decode";
import { getContext, setContext } from "svelte"

class TokenStateClass {

    constructor(token) {
        this.token = $state(token || null)
        if (this.isExpired) {
            this.token = null
        }

        const printTokenEXpiry = ()=> {
            setTimeout(() => {
                console.log("this token is expired: ", this.isExpired)
                printTokenEXpiry()
            }, 1000)
        }
        
    }
    
    refreshTimer = $state(null)

    getPayload = () => {
        if (this.token) return jwtDecode(this.token);
        else return this.token;
    }

    getExpiration = () => {
        let exp = this.getPayload()?.exp
        console.log(exp)
        console.log(exp * 1000, "\n", Date.now())
        return exp ? exp * 1000 : null
    }

    refreshAccessToken = async (msg = "") => {
        const res = await fetch('/auth/refresh', {method: 'POST'});
        if (res.ok) {
            let { acs_tkn } = await res.json();
            this.token = acs_tkn;
            await this.scheduleRefresh()
        } else {
            console.log(await res.json())
            this.token = null
        }
       
    }

    scheduleRefresh = async () => {
        const now = Date.now()
        const refresh = this.getExpiration() - now - (1 * 30 * 1000)
        if (refresh <= 0) {
            await this.refreshAccessToken()
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