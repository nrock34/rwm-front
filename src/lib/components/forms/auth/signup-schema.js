import * as yup from "yup";
import YupPassword from "yup-password"
if (import.meta.env.SSR) { await import ('./username-check.js') }; 

YupPassword(yup)

let usernameCheck

if (import.meta.env.SSR) {
    const { userCheck } = await import ('./username-check.js')
    usernameCheck = async (username) => await userCheck(username)
} else {
    usernameCheck = async (username) => {
        const checkResp = await fetch('/api/username-check', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        })
        if (!checkResp.ok) {
            error(400)
        } else {
            return await checkResp.json()
        }
    }
    
}

export const schema = yup.object({
    first_name: yup.string().min(2)
        .required(),
    last_name: yup.string().min(2)
        .required(),
    username: yup.string()
        .min(2)
        .test(
            'username_check',
            "This username already exists.",
            async (value) => {
                if (!(value.length > 1)) {
                    return true
                }
                if ((await usernameCheck(value))?.exists) {
                    console.log(value)
                    console.log()
                    return false
                } else {
                    console.log(value)
                    return true
                }
            }
        ).required(),
    email: yup.string().email()
        .min(4)
        .required(),
    password: yup.string().password()
        .min(8)
        .minUppercase(1)
        .minSymbols(1)
        .maxRepeating(3)
        .required()
})