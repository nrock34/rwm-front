import { sequence } from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";
import { redirect } from "@sveltejs/kit";
import { clearAuthCookies, getSessionState, validateAccessToken } from "$domains/auth/index.js";
import { buildLoginRedirectUrl } from "$lib/auth/redirect.js";


const authRoutes = [
	"/profile"
];

/**
 * @param {string} pathName
 * @param {readonly string[]} routes
 * @returns {boolean}
 */
const isAuthRoute = (pathName, routes) => {
	return routes.some((route) =>
		pathName === route || pathName.startsWith(`${route}/`)
	);
};

/** @type {import("@sveltejs/kit").Handle} */
export const handle = sequence(async ({ event, resolve }) => {

	const session = getSessionState(event.cookies);


	if (isAuthRoute(event.url.pathname, authRoutes)) {

		if (!session.hasRefreshToken) {
			throw redirect(303, buildLoginRedirectUrl(event.url));
		}

		if (!session.accessToken) {
			throw redirect(303, buildLoginRedirectUrl(event.url));
		}

		const tokenValidation = validateAccessToken(session.accessToken);
		if (tokenValidation.ok) {
			event.locals.token = session.accessToken;
		} else if (tokenValidation.error.code === "invalid_token") {
			delete event.locals.token;
			clearAuthCookies(event.cookies);
			throw redirect(303, buildLoginRedirectUrl(event.url));
		}
	}

	if (
		(event.url.pathname.startsWith("/community/news/") || event.url.pathname === "/community/news") ||
		event.url.pathname.startsWith("/community/updates")
	) {
		throw redirect(308, "/community/news-and-updates");
	}
	const response = await resolve(event);
	return response;
});


export const handleError = Sentry.handleErrorWithSentry();
