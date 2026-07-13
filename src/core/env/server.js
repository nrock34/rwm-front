import { env } from "$env/dynamic/private";

/**
 * Error used when required runtime env vars are missing.
 */
export class MissingEnvError extends Error {
	/**
	 * @param {string} name
	 */
	constructor(name) {
		super(`Missing required env var: ${name}`);
		this.name = "MissingEnvError";
		this.code = "missing_env";
		this.envName = name;
	}
}

/**
 * @param {string} name
 * @returns {string}
 * @throws {MissingEnvError}
 */
export function requireEnv(name) {
	const value = env[name];
	if (!value) {
		throw new MissingEnvError(name);
	}
	return value;
}

/**
 * @returns {string}
 * @throws {MissingEnvError}
 */
export function getApiUrl() {
	return requireEnv("API_URL");
}

/**
 * @param {string} path
 * @param {string} [apiUrl]
 * @returns {string}
 */
export function resolveApiUrl(path, apiUrl = getApiUrl()) {
	const normalizedBase = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;
	const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
	return new URL(normalizedPath, normalizedBase).toString();
}

/**
 * @throws {MissingEnvError}
 * @returns {string}
 */
export function getCookieSecret() {
	return requireEnv("COOKIE_SECRET");
}

/**
 * The backend historically exposed this secret under more than one name. Keep
 * those configuration aliases, but never substitute a known default: starting
 * without a configured verification key must fail closed.
 *
 * @throws {MissingEnvError}
 * @returns {string}
 */
export function getAuthJwtSecret() {
	const value = env.ACS_JWT_SECRET ?? env.JWT_SECRET ?? env.COOKIE_SECRET;
	if (value) return value;
	throw new MissingEnvError("ACS_JWT_SECRET|JWT_SECRET|COOKIE_SECRET");
}
