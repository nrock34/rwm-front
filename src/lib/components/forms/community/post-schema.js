import * as yup from "yup";

export const postSchema = yup.object({
	title: yup.string().trim().required("Title is required.").max(200, "Title must be 200 characters or fewer."),
	content: yup.string().trim().required("Content is required.").max(600, "Content must be 600 characters or fewer."),
	type: yup.string().oneOf(["discussion", "announcement", "photo", "question"]).required("Choose a post type."),
	category: yup.string().oneOf(["opp", "social", "academic", "housing", "events"]).required("Choose a topic."),
	tags: yup.string().default(""),
	media: yup.string().trim().url("Media must be a valid URL.").nullable().transform((value) => value || ""),
	published: yup.boolean().default(true)
});
