import * as yup from "yup";
import YupPassword from "yup-password";

YupPassword(yup);

/** @type {(username: string) => Promise<{ exists: boolean }>} */
let usernameCheck = async (username) => {
	const checkResp = await fetch("/api/username-check", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username })
	});
	if (!checkResp.ok) {
		return { exists: false };
	}
	return /** @type {Promise<{ exists: boolean }>} */ (checkResp.json());
};

if (import.meta.env.SSR) {
	const { userCheck } = await import("./username-check.js");
	usernameCheck = userCheck;
}

export const schema = yup.object({
	first_name: yup.string().min(2).required(),
	last_name: yup.string().min(2).required(),
	username: yup
		.string()
		.min(2)
		.test("username_check", "This username already exists.", async (value) => {
			if (typeof value !== "string" || value.length < 2) {
				return true;
			}
			return !(await usernameCheck(value)).exists;
		})
		.required(),
	email: yup.string().email().min(4).required(),
	password: yup.string().password().min(8).minUppercase(1).minSymbols(1).maxRepeating(3).required()
});
