export const DEFAULT_POST_LOGIN_REDIRECT = "/profile/dashboard";
export const DEFAULT_ONBOARDING_REDIRECT = "/profile/dashboard";

/**
 * @param {unknown} value
 * @param {string} [fallback]
 * @returns {string}
 */
export function sanitizeRelativeRedirectTarget(value, fallback = DEFAULT_POST_LOGIN_REDIRECT) {
	if (typeof value !== "string") return fallback;

	const target = value.trim();
	if (!target.startsWith("/") || target.startsWith("//")) return fallback;

	try {
		const parsed = new URL(target, "http://local");
		if (parsed.origin !== "http://local") return fallback;

		const safeTarget = `${parsed.pathname}${parsed.search}${parsed.hash}`;
		if (safeTarget.startsWith("/auth/login")) return fallback;
		return safeTarget;
	} catch {
		return fallback;
	}
}

/**
 * @param {URL} currentUrl
 * @param {{ loginPath?: string; fallback?: string }} [options]
 * @returns {string}
 */
export function buildLoginRedirectUrl(currentUrl, options = {}) {
	const loginPath = options.loginPath ?? "/auth/login";
	const fallback = options.fallback ?? DEFAULT_POST_LOGIN_REDIRECT;
	const target = sanitizeRelativeRedirectTarget(
		`${currentUrl.pathname}${currentUrl.search}`,
		fallback
	);

	const loginUrl = new URL(loginPath, currentUrl);
	loginUrl.searchParams.set("redirectTo", target);

	return `${loginUrl.pathname}${loginUrl.search}`;
}

/**
 * @param {URL} currentUrl
 * @param {{ onboardingPath?: string; fallback?: string }} [options]
 * @returns {string}
 */
export function buildOnboardingRedirectUrl(currentUrl, options = {}) {
	const onboardingPath = options.onboardingPath ?? "/onboarding";
	const fallback = options.fallback ?? DEFAULT_ONBOARDING_REDIRECT;
	const target = sanitizeRelativeRedirectTarget(
		`${currentUrl.pathname}${currentUrl.search}`,
		fallback
	);
	const safeTarget = target.startsWith("/onboarding") ? fallback : target;

	const onboardingUrl = new URL(onboardingPath, currentUrl);
	onboardingUrl.searchParams.set("redirectTo", safeTarget);

	return `${onboardingUrl.pathname}${onboardingUrl.search}`;
}
