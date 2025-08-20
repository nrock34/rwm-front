import { json } from "@sveltejs/kit";
import { userCheck } from "$lib/components/forms/auth/username-check";

export const POST = async ({ request }) => {
    const { username } = await request.json()
    const exists = (await userCheck(username))?.exists

    return json({ exists })
}