import * as psc from "$lib/server/setCookieParse"


export const passRefreshTkn = (cookies, headers) => {

    const passedCookies = psc.parse(headers.get('set-cookie'))
    
    //console.log(passedCookies)

    const rfh_tkn_cookie = passedCookies?.find((cookie) => {
        return cookie.key === 'rfh_tkn'
    })

    console.log(rfh_tkn_cookie, "supposed rfh cookie \n\n")

    if (rfh_tkn_cookie) {
        let { raw, ...cookieData } = rfh_tkn_cookie
        cookies.set(
            cookieData.key,
            cookieData.value,
            {
                ...cookieData.options,
                encode: (value) => (value)
            }
        )
    }

}