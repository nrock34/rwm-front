import { fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { yup } from "sveltekit-superforms/adapters";
import { createCommunityPost } from "$domains/community";
import { requireValidatedAccessToken } from "$lib/auth/server.js";
import { postSchema } from "$lib/components/forms/community/post-schema.js";

/**
 * @param {string} value
 * @returns {string[]}
 */
function parseTags(value) {
	return value
		.split(",")
		.map((tag) => tag.trim().toLowerCase())
		.filter(Boolean);
}

/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 */
export async function load(event) {
	requireValidatedAccessToken(event);
	return {
		createPostForm: await superValidate(
			{
				title: "",
				content: "",
				type: "discussion",
				category: "social",
				tags: "",
				media: "",
				published: true
			},
			yup(postSchema)
		)
	};
}

/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 */
async function createPostAction(event) {
	const accessToken = requireValidatedAccessToken(event);
	const form = await superValidate(event.request, yup(postSchema));

	if (!form.valid) {
		return fail(400, { form });
	}

	const result = await createCommunityPost(
		{
			title: form.data.title,
			content: form.data.content,
			type: form.data.type,
			category: form.data.category,
			tags: parseTags(form.data.tags),
			published: form.data.published,
			...(form.data.media ? { media: form.data.media } : {})
		},
		{
			fetch: event.fetch,
			accessToken
		}
	);

	if (!result.ok) {
		if (result.error.code === "unauthorized") {
			throw redirect(303, "/auth/login?redirectTo=/community/posts/new");
		}
		return message(form, {
			error: "save_failed",
			msg: result.error.message
		}, { status: 400 });
	}

	throw redirect(303, `/community/posts/${result.data.id}`);
}

/** @type {import("@sveltejs/kit").Actions} */
export const actions = {
	createPost: createPostAction
};
