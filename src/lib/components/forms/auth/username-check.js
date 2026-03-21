import { env } from "$env/dynamic/private";

/**
 * @param {string} username
 * @returns {Promise<{ exists: boolean }>}
 */
export const userCheck = async (username) => {
	if (!env.API_URL) {
		return { exists: false };
	}

	const usercheck = await fetch(`${env.API_URL}auth/username/check`, {
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({
			username
		})
	});
	if (!usercheck.ok) {
		return { exists: true };
	}
	return { exists: false };
};
