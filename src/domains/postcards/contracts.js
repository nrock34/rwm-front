import * as yup from "yup";

export const POSTCARD_EMBED_KINDS = Object.freeze(["spotify", "youtube", "map"]);
export const POSTCARD_TEXT_FONT_SIZES = Object.freeze(["sm", "md", "lg"]);
export const POSTCARD_EDITOR_FORMAT = "editorjs";
export const POSTCARD_EDITOR_VERSION = 1;

/**
 * @param {number} max
 * @param {string} label
 */
function optionalTrimmedString(max, label) {
	return yup
		.string()
		.transform((value) => (typeof value === "string" ? value.trim() : value))
		.max(max, `${label} must be ${max} characters or fewer.`)
		.optional();
}

const requiredTextSchema = yup
	.string()
	.transform((value) => (typeof value === "string" ? value.trim() : ""))
	.min(1, "Text is required.")
	.required("Text is required.");

const imageDataSchema = yup.object({
	src: yup.string().trim().url("Image source must be a valid URL.").required("Image source is required."),
	alt: optionalTrimmedString(180, "Image alt text"),
	caption: optionalTrimmedString(280, "Image caption"),
	withBorder: yup.boolean().optional(),
	withBackground: yup.boolean().optional(),
	stretched: yup.boolean().optional()
});

const slideSchema = yup.object({
	src: yup.string().trim().url("Slide source must be a valid URL.").required("Slide source is required."),
	alt: optionalTrimmedString(180, "Slide alt text"),
	caption: optionalTrimmedString(280, "Slide caption")
});

const pollOptionSchema = yup.object({
	id: yup.string().trim().required("Poll option id is required."),
	label: requiredTextSchema.max(120, "Poll option labels must be 120 characters or fewer.")
});

const marginBottomSchema = optionalTrimmedString(120, "Block margin bottom");

/**
 * @param {boolean} allowLayout
 * @returns {yup.Lazy<any>}
 */
function createPostcardBlockSchema(allowLayout) {
	return yup.lazy((value) => {
		const type = value && typeof value === "object" && !Array.isArray(value)
			? /** @type {{ type?: unknown }} */ (value).type
			: null;

		const baseFields = {
			id: yup.string().trim().required("Block id is required."),
			mb: marginBottomSchema,
			type: yup.string().required("Block type is required.")
		};

			switch (type) {
			case "header":
				return yup.object({
					...baseFields,
					type: yup.string().oneOf(["header"]).required(),
					data: yup.object({
						text: requiredTextSchema.max(180, "Header text must be 180 characters or fewer."),
						fontSize: yup.string().oneOf(POSTCARD_TEXT_FONT_SIZES).optional()
					}).required()
				});
			case "subtext":
				return yup.object({
					...baseFields,
					type: yup.string().oneOf(["subtext"]).required(),
					data: yup.object({
						text: requiredTextSchema.max(360, "Subtext must be 360 characters or fewer."),
						fontSize: yup.string().oneOf(POSTCARD_TEXT_FONT_SIZES).optional()
					}).required()
				});
			case "paragraph":
				return yup.object({
					...baseFields,
					type: yup.string().oneOf(["paragraph"]).required(),
					data: yup.object({
						text: requiredTextSchema.max(4000, "Paragraph text must be 4000 characters or fewer.")
					}).required()
				});
			case "smallText":
				return yup.object({
					...baseFields,
					type: yup.string().oneOf(["smallText"]).required(),
					data: yup.object({
						text: requiredTextSchema.max(1200, "Small text must be 1200 characters or fewer.")
					}).required()
				});
			case "image":
				return yup.object({
					...baseFields,
					type: yup.string().oneOf(["image"]).required(),
					data: imageDataSchema.required()
				});
			case "quote":
				return yup.object({
					...baseFields,
					type: yup.string().oneOf(["quote"]).required(),
					data: yup.object({
						text: requiredTextSchema.max(1500, "Quote text must be 1500 characters or fewer."),
						attribution: optionalTrimmedString(180, "Quote attribution")
					}).required()
				});
			case "embed":
				return yup.object({
					...baseFields,
					type: yup.string().oneOf(["embed"]).required(),
					data: yup.object({
						kind: yup.string().oneOf(POSTCARD_EMBED_KINDS).required("Embed kind is required."),
						url: yup.string().trim().url("Embed url must be a valid URL.").required("Embed url is required."),
						caption: optionalTrimmedString(280, "Embed caption")
					}).required()
				});
			case "slideshow":
				return yup.object({
					...baseFields,
					type: yup.string().oneOf(["slideshow"]).required(),
					data: yup.object({
						slides: yup.array().of(slideSchema.required()).min(1, "Slideshows need at least one slide.").required()
					}).required()
				});
			case "poll":
				return yup.object({
					...baseFields,
					type: yup.string().oneOf(["poll"]).required(),
					data: yup.object({
						question: requiredTextSchema.max(220, "Poll questions must be 220 characters or fewer."),
						options: yup.array().of(pollOptionSchema.required()).min(2, "Polls need at least two options.").required()
					}).required()
				});
			case "layout":
				if (!allowLayout) {
					return yup.object({
						...baseFields,
						type: yup.string().oneOf(["header", "subtext", "paragraph", "smallText", "image", "quote", "embed", "slideshow", "poll"], "Unknown content block type.").required(),
						data: yup.mixed().required("Block data is required.")
					});
				}
				return yup.object({
					...baseFields,
					type: yup.string().oneOf(["layout"]).required(),
					data: yup.object({
						style: optionalTrimmedString(600, "Layout style"),
						columns: yup.array().of(
							yup.object({
								width: optionalTrimmedString(20, "Layout column width"),
								style: optionalTrimmedString(600, "Layout column style"),
								blocks: yup.array().of(postcardLayoutChildBlockSchema).min(1, "Layout columns must include at least one block.").required()
							}).required()
						).min(2, "Layouts need at least two columns.").required()
					}).required()
				});
			default:
				return yup.object({
					...baseFields,
					type: yup
						.string()
						.oneOf(
							allowLayout
								? ["header", "subtext", "paragraph", "smallText", "image", "quote", "embed", "slideshow", "poll", "layout"]
								: ["header", "subtext", "paragraph", "smallText", "image", "quote", "embed", "slideshow", "poll"],
							"Unknown content block type."
						)
						.required("Block type is required."),
					data: yup.mixed().required("Block data is required.")
				});
		}
	});
}

const postcardLayoutChildBlockSchema = createPostcardBlockSchema(false);
const postcardEditorBlockSchema = createPostcardBlockSchema(true);

export const postcardEditorDocumentSchema = yup.object({
	format: yup.string().oneOf([POSTCARD_EDITOR_FORMAT]).required(),
	version: yup.number().oneOf([POSTCARD_EDITOR_VERSION]).required(),
	blocks: yup.array().of(postcardEditorBlockSchema).min(1, "Content must include at least one block.").required()
});

/**
 * @param {unknown} value
 * @returns {import("./types.js").PostcardEditorDocument}
 */
export function assertPostcardEditorDocument(value) {
	return /** @type {import("./types.js").PostcardEditorDocument} */ (
		postcardEditorDocumentSchema.validateSync(value, {
			abortEarly: false,
			stripUnknown: true
		})
	);
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").PostcardEditorDocument | null}
 */
export function parsePostcardEditorDocument(value) {
	if (value == null) {
		return null;
	}

	try {
		return assertPostcardEditorDocument(value);
	} catch {
		return null;
	}
}
