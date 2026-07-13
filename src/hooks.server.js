import { sequence } from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";
import { redirect } from "@sveltejs/kit";
import { buildLoginRedirectUrl } from "$lib/auth/redirect.js";
import { reconcileRequestSession } from "$lib/auth/server.js";


const authRoutes = [
	"/profile",
	"/onboarding"
];

const sessionMutationRoutes = new Set([
	"/auth/logout",
	"/auth/refresh"
]);

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
	let accessToken = event.locals.token ?? null;
	if (!sessionMutationRoutes.has(event.url.pathname)) {
		accessToken = await reconcileRequestSession(event);
	}

	if (isAuthRoute(event.url.pathname, authRoutes)) {
		if (!accessToken) {
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
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("X-Frame-Options", "SAMEORIGIN");
	response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
	response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
	response.headers.set(
		"Content-Security-Policy",
		"base-uri 'self'; object-src 'none'; frame-ancestors 'self'"
	);
	if (event.url.protocol === "https:") {
		response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
	}
	return response;
});


export const handleError = Sentry.handleErrorWithSentry();
