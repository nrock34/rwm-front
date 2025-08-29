import { COOKIE_SECRET } from "$env/static/private";
import { createHmac } from "crypto";
import jwt from "jsonwebtoken"

export const sign = (value) => {
    const hmac = createHmac('sha256', COOKIE_SECRET).update(value).digest('hex')
    return `${value}....${hmac}`;
}

export const verify = (signedValue) => {
    const [value, sig] = signedValue.split('....');
    if (!value || !sig) return undefined

    const expectedSig = createHmac('sha256', COOKIE_SECRET).update(value).digest('hex')
    return (sig === expectedSig) ? value : undefined;
}

export const verifyNotExpired = (v) => {
    try {
        jwt.verify(v, "12345")
        return true
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return false
        } else return false
    }
}