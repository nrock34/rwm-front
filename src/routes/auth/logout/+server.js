import { clearAuthCookies, getSessionState, logoutUser } from "$domains/auth/index.js";

/** @type {import("@sveltejs/kit").RequestHandler} */
export async function POST({ cookies, fetch, url }) {
    const session = getSessionState(cookies);

    await logoutUser({
        fetch,
        cookies,
        accessToken: session.accessToken
    });

    clearAuthCookies(cookies, { secure: url.protocol === "https:" });
    return new Response(null, {
        status: 303,
        headers: {
            Location: "/",
            "Cache-Control": "no-store, max-age=0",
            Pragma: "no-cache"
        }
    });
}
