import { env } from "$env/dynamic/private";

const KEILA_URL = "http://keila.cr.romewithme.com/api/v1/contacts";

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
 * @returns {Promise<string | NewsletterResponse | false>}
 */
export const addContact = async (email, firstName = undefined, lastName = undefined, tags = []) => {
	if (!email) return false;

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

	const response = await fetch(KEILA_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${env.KEILA_TKN}`
		},
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		const jsonData = /** @type {NewsletterResponse} */ (await response.json());
		return jsonData;
	}

	const jsonData = /** @type {{ data?: { id?: string } }} */ (await response.json());
	return jsonData.data?.id ?? "";
};
