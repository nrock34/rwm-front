import { json } from '@sveltejs/kit';
import { clearAuthCookies, passRefreshTokenCookie, refreshSession, setSignedAccessCookie } from '$domains/auth/index.js';

const NO_STORE_HEADERS = {
    'Cache-Control': 'no-store, max-age=0',
    Pragma: 'no-cache',
    Vary: 'Cookie'
};

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

        if (
            failure.error.code === "invalid_response" ||
            (failure.error.status >= 400 && failure.error.status < 500)
        ) {
            clearAuthCookies(cookies, { secure: url.protocol === 'https:' });
        }

        const status = failure.error.status >= 400 && failure.error.status <= 599
            ? failure.error.status
            : 500;
        return json({
            error: {
                code: failure.error.code,
                message: failure.error.message
            }
        }, { status, headers: NO_STORE_HEADERS });
    }

    const isHttps = url?.protocol === 'https:';
    passRefreshTokenCookie(cookies, result.headers, { secureOverride: isHttps })
    setSignedAccessCookie(cookies, result.data.acs_tkn, { secure: isHttps })

    return json(result.data, { status: 200, headers: NO_STORE_HEADERS });
}
