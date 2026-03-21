import { redirect } from "@sveltejs/kit";
import { buildLoginRedirectUrl } from "$lib/auth/redirect.js";
import { clearAuthCookies, getSessionState, validateAccessToken } from "$domains/auth/index.js";

/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 * @returns {string | null}
 */
export function getValidatedAccessToken(event) {
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
		clearAuthCookies(event.cookies);
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
