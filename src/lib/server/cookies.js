import { COOKIE_SECRET } from "$env/static/private";
import { createHmac } from "crypto";

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