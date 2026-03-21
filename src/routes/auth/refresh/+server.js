import { redirect } from '@sveltejs/kit';
import { passRefreshTokenCookie, refreshSession, setSignedAccessCookie } from '$domains/auth/index.js';

/**
 * @param {import("../../../domains/auth/types.js").AuthRefreshResult} result
 * @returns {import("../../../domains/auth/types.js").AuthFailure}
 */
function asAuthFailure(result) {
    return /** @type {import("../../../domains/auth/types.js").AuthFailure} */ (result)
}

/** @type {import("./$types").RequestHandler} */
export async function POST({ cookies, fetch, url }) {
    const result = await refreshSession({ cookies, fetch });
    if (!result.ok) {
        const failure = asAuthFailure(result)

        if (failure.error.code === "missing_refresh_token") {
            throw redirect(303, '/auth/login')
        }
        return new Response(JSON.stringify({
            error: 'Failed to refresh',
            more: failure.error.details ?? { message: failure.error.message }
        }), { status: 401 })
    }

    const isHttps = url?.protocol === 'https:';
    passRefreshTokenCookie(cookies, result.headers, { secureOverride: isHttps })
    setSignedAccessCookie(cookies, result.data.acs_tkn, { secure: isHttps })

    return new Response(JSON.stringify(result.data), { status: 200 });
}
