import { env } from "$env/dynamic/private";

const NEWSLETTER_TIMEOUT_MS = 10_000;

/**
 * @typedef {{
 *   title: string;
 *   detail: string;
 * }} NewsletterError
 */

/**
 * @typedef {{
 *   errors?: NewsletterError[];
 *   [key: string]: unknown;
 * }} NewsletterResponse
 */

/**
 * @param {string | null | undefined} email
 * @param {string | undefined} [firstName]
 * @param {string | undefined} [lastName]
 * @param {string[]} [tags]
 * @param {{ fetchFn?: typeof fetch }} [options]
 * @returns {Promise<string | NewsletterResponse | false>}
 */
export const addContact = async (email, firstName = undefined, lastName = undefined, tags = [], options = {}) => {
	if (!email) return false;
	const token = env.KEILA_TKN;
	const configuredUrl = env.KEILA_URL;
	if (!token || !configuredUrl) {
		throw new Error("Newsletter service is not configured.");
	}

	/** @type {URL} */
	let endpoint;
	try {
		endpoint = new URL(configuredUrl);
	} catch {
		throw new Error("Newsletter service URL is invalid.");
	}
	if (endpoint.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(endpoint.hostname)) {
		throw new Error("Newsletter service URL must use HTTPS.");
	}

	/** @type {{ data: { data: { tags: string[] }; email: string; first_name?: string; last_name?: string } }} */
	const body = {
		data: {
			data: {
				tags: [...tags]
			},
			email
		}
	};

	if (firstName) body.data.first_name = firstName;
	if (lastName) body.data.last_name = lastName;

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), NEWSLETTER_TIMEOUT_MS);
	/** @type {Response} */
	let response;
	try {
		response = await (options.fetchFn ?? fetch)(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(body),
		signal: controller.signal
		});
	} finally {
		clearTimeout(timeout);
	}

	if (!response.ok) {
		const jsonData = /** @type {NewsletterResponse} */ (await response.json().catch(() => ({
			errors: [{ title: "subscription_failed", detail: "The newsletter service rejected the request." }]
		})));
		return jsonData;
	}

	const jsonData = /** @type {{ data?: { id?: string } }} */ (await response.json().catch(() => ({})));
	return jsonData.data?.id ?? "";
};
