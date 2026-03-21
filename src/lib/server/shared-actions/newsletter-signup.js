import { addContact } from "$lib/server/newsletter/add-contact";
import { fail } from "@sveltejs/kit";

/**
 * @param {{ request: Request }} event
 */
export const newsletterSignup = async ({ request }) => {
	const data = await request.formData();
	const emailValue = data.get("email");
	const email = typeof emailValue === "string" ? emailValue : undefined;
	const result = await addContact(email);

	if (result && typeof result === "object" && "errors" in result && Array.isArray(result.errors) && result.errors[0]) {
		return fail(422, {
			error: result.errors[0].title,
			description: result.errors[0].detail
		});
	}

	return {
		status: "success",
		id: typeof result === "string" ? result : ""
	};
};
