import * as yup from "yup";

export const commentSchema = yup.object({
	content: yup.string().trim().required("Comment content is required.").max(500, "Comments must be 500 characters or fewer.")
});
