export const parse = (str, raw=true) => {

    const cookies = str.split(', ')
    let parsedCookies = [];
    for (let i = 0; i < cookies.length; i=i+2) {
        parsedCookies.push(cookies[i] + ', ' + cookies[i+1])
    }

    let fullParsedCookies = []

    for (const pcookie of parsedCookies) {
        let params = pcookie.split('; ')
        const cookie = params[0].split('=', 2)
        const key = cookie[0]
        const value = cookie[1]
        const expires = params.find((param) => {
            return param.startsWith('expires')
        })?.split('=', 2)[1] || null
        const httpOnly = params.some((param) => {
            return param === 'HttpOnly'
        })
        const maxAge = params.find((param) => {
            return param.startsWith('Max-Age')
        })?.split('=', 2)[1] || null
        const path = params.find((param) => {
            return param.startsWith('Path')
        })?.split('=', 2)[1] || null
        const sameSite = params.find((param) => {
            return param.startsWith('SameSite')
        })?.split('=', 2)[1] || null
        const secure = params.some((param) => {
            return param === 'Secure'
        })
        const raw = pcookie

        const cookieData = {
            key,
            value,
            options: {
                expires: Date.UTC(Date.parse(expires)),
                httpOnly,
                maxAge,
                path,
                sameSite,
                secure
            },
            raw
        }

        fullParsedCookies.push(cookieData)

    }
    

    return fullParsedCookies

}