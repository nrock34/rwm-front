import { redirect } from "@sveltejs/kit";
import { clearAuthCookies, getSessionState, logoutUser } from "$domains/auth/index.js";

/** @type {import("@sveltejs/kit").RequestHandler} */
export async function POST({ cookies, fetch }) {
    const session = getSessionState(cookies);

    await logoutUser({
        fetch,
        cookies,
        accessToken: session.accessToken
    });

    clearAuthCookies(cookies);
    throw redirect(303, "/");
}
