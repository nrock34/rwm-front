import { redirect } from "@sveltejs/kit";
import { buildLoginRedirectUrl } from "./redirect.js";
import {
	ACCESS_COOKIE_NAME,
	clearAuthCookies,
	getSessionState,
	passRefreshTokenCookie,
	refreshSession,
	setSignedAccessCookie,
	validateAccessToken
} from "../../domains/auth/index.js";

/**
 * Reconciles a request's short-lived access token with its refresh session.
 * This is intentionally role-agnostic: authorization and onboarding are
 * separate decisions made after authentication succeeds.
 *
 * @param {import("@sveltejs/kit").RequestEvent} event
 * @returns {Promise<string | null>}
 */
export async function reconcileRequestSession(event) {
	delete event.locals.token;
	const secure = event.url.protocol === "https:";
	const session = getSessionState(event.cookies);

	if (session.accessToken) {
		const validation = validateAccessToken(session.accessToken);
		if (validation.ok) {
			event.locals.token = session.accessToken;
			return session.accessToken;
		}
	}

	if (!session.hasRefreshToken) {
		if (event.cookies.get(ACCESS_COOKIE_NAME)) {
			clearAuthCookies(event.cookies, { secure });
		}
		return null;
	}

	const refreshResult = await refreshSession({
		cookies: event.cookies,
		fetch: event.fetch
	});

	if (!refreshResult.ok) {
		if (refreshResult.error.code === "missing_env") {
			throw new Error(refreshResult.error.message);
		}
		if (
			refreshResult.error.code === "invalid_response" ||
			(refreshResult.error.status >= 400 && refreshResult.error.status < 500)
		) {
			clearAuthCookies(event.cookies, { secure });
		}
		return null;
	}

	const validation = validateAccessToken(refreshResult.data.acs_tkn);
	if (!validation.ok) {
		clearAuthCookies(event.cookies, { secure });
		return null;
	}

	const refreshCookieApplied = passRefreshTokenCookie(
		event.cookies,
		refreshResult.headers,
		{ secureOverride: secure }
	);
	if (!refreshCookieApplied) {
		clearAuthCookies(event.cookies, { secure });
		return null;
	}

	setSignedAccessCookie(event.cookies, refreshResult.data.acs_tkn, { secure });
	event.locals.token = refreshResult.data.acs_tkn;
	return refreshResult.data.acs_tkn;
}

/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 * @returns {string | null}
 */
export function getValidatedAccessToken(event) {
	if (event.locals.token) return event.locals.token;

	const session = getSessionState(event.cookies);
	if (!session.accessToken) {
		delete event.locals.token;
		return null;
	}

	const validation = validateAccessToken(session.accessToken);
	if (validation.ok) {
		event.locals.token = session.accessToken;
		return session.accessToken;
	}

	delete event.locals.token;
	if (validation.error.code === "invalid_token") {
		clearAuthCookies(event.cookies, { secure: event.url.protocol === "https:" });
	}

	return null;
}

/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 * @returns {string}
 */
export function requireValidatedAccessToken(event) {
	const accessToken = getValidatedAccessToken(event);
	if (!accessToken) {
		throw redirect(303, buildLoginRedirectUrl(event.url));
	}
	return accessToken;
}
