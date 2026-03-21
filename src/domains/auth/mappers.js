import { textOrEmpty } from "../../core/domain/coerce.js";

/**
 * @param {{ email?: string; password?: string }} data
 * @returns {import("./types.js").AuthLoginPayload}
 */
export function mapLoginFormData(data) {
	return {
		email: textOrEmpty(data.email),
		password: textOrEmpty(data.password)
	};
}

/**
 * @param {{ first_name: unknown; last_name: unknown; username: unknown; email: unknown; password: unknown }} data
 * @returns {import("./types.js").AuthSignupPayload}
 */
export function mapSignupFormData(data) {
	return {
		first_name: textOrEmpty(data.first_name),
		last_name: textOrEmpty(data.last_name),
		username: textOrEmpty(data.username),
		email: textOrEmpty(data.email),
		password: textOrEmpty(data.password)
	};
}
