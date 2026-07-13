import { toFiniteNumber, toTitleCase } from "../../core/domain/coerce.js";
import { sanitizeLegacyHtml, sanitizeUrl } from "../../core/security/html.js";

/** @type {Readonly<Record<string, string>>} */
const RESOURCE_TYPE_LABELS = Object.freeze({
	pdf: "PDF",
	video: "Video",
	link: "Link",
	interactive: "Interactive",
	page: "Page"
});

/**
 * @param {string | null | undefined} value
 * @param {string} apiUrl
 * @returns {string | null}
 */
function resolveApiAssetUrl(value, apiUrl) {
	if (!value || typeof value !== "string") return null;
	return sanitizeUrl(value, { type: "src", baseUrl: apiUrl });
}

/**
 * @param {string} type
 * @returns {string}
 */
export function getResourcePrimaryActionLabel(type) {
	switch (type) {
		case "video":
			return "Watch";
		case "link":
			return "Visit";
		case "interactive":
		case "page":
			return "Open";
		default:
			return "Download";
	}
}

/**
 * @param {Record<string, unknown> | null | undefined} author
 * @param {string} apiUrl
 * @returns {import("./types.js").ResourceAuthor}
 */
function mapAuthor(author, apiUrl) {
	return {
		name: author && typeof author.name === "string" ? author.name : "RomeWithMe Team",
		avatar: resolveApiAssetUrl(author && typeof author.avatar === "string" ? author.avatar : null, apiUrl),
		associatedUser: author && typeof author.associated_user === "number" ? author.associated_user : null
	};
}

/**
 * @param {string} apiCategory
 * @returns {{ key: import("./types.js").ResourceCategoryKey; label: string; apiCategory: string }}
 */
function mapCategory(apiCategory) {
	const normalizedCategory = apiCategory.trim().toLowerCase() || "uncategorized";
	return {
		key: normalizedCategory,
		label: toTitleCase(normalizedCategory),
		apiCategory: normalizedCategory
	};
}

/**
 * @param {string} value
 * @returns {string}
 */
function mapTypeLabel(value) {
	const normalizedType = value.toLowerCase();
	return RESOURCE_TYPE_LABELS[normalizedType] ?? toTitleCase(normalizedType);
}

/**
 * @param {string | null | undefined} value
 * @param {string} apiUrl
 * @returns {string | null}
 */
function extractContentUrl(value, apiUrl) {
	if (!value || typeof value !== "string") return null;
	if (/^https?:\/\//i.test(value) || value.startsWith("/")) {
		return sanitizeUrl(value, { type: "src", baseUrl: apiUrl });
	}
	return null;
}

/**
 * @param {Record<string, unknown>} resource
 * @param {{ apiUrl: string }} options
 * @returns {import("./types.js").ResourceCard}
 */
export function mapResourceCard(resource, { apiUrl }) {
	const category = mapCategory(typeof resource.category === "string" ? resource.category : "uncategorized");
	const type = typeof resource.type === "string" ? resource.type.toLowerCase() : "pdf";
	return {
		id: toFiniteNumber(resource.id),
		title: typeof resource.title === "string" ? resource.title : "",
		description: typeof resource.description === "string" ? resource.description : "",
		category: category.key,
		apiCategory: category.apiCategory,
		categoryLabel: category.label,
		type,
		typeLabel: mapTypeLabel(type),
		rating: toFiniteNumber(resource.rating),
		views: toFiniteNumber(resource.views),
		author: mapAuthor(
			resource.author && typeof resource.author === "object"
				? /** @type {Record<string, unknown>} */ (resource.author)
				: null,
			apiUrl
		),
		thumbnail: resolveApiAssetUrl(typeof resource.thumbnail === "string" ? resource.thumbnail : null, apiUrl),
		tags: Array.isArray(resource.tags)
			? resource.tags
				.map((tag) => (tag && typeof tag === "object" && typeof tag.name === "string") ? tag.name : "")
				.filter(Boolean)
			: [],
		featured: false,
		downloads: null,
		size: null,
		lastUpdated: null,
		href: `/resources/${toFiniteNumber(resource.id)}`,
		primaryActionLabel: getResourcePrimaryActionLabel(type)
	};
}

/**
 * @param {Record<string, unknown>} resource
 * @param {{ apiUrl: string }} options
 * @returns {import("./types.js").ResourceDetail}
 */
export function mapResourceDetail(resource, { apiUrl }) {
	const card = mapResourceCard(resource, { apiUrl });
	const rawContent = typeof resource.content === "string" && resource.content.length > 0 ? resource.content : null;
	const rawPageContent = typeof resource.page_content === "string" && resource.page_content.length > 0 ? resource.page_content : null;
	const contentUrl = card.type === "page" ? null : extractContentUrl(rawContent, apiUrl);
	const content = rawContent && !contentUrl
		? sanitizeLegacyHtml(rawContent, { baseUrl: apiUrl }) || null
		: rawContent;
	const pageContent = rawPageContent
		? sanitizeLegacyHtml(rawPageContent, { baseUrl: apiUrl }) || null
		: null;

	return {
		...card,
		content,
		pageContent,
		contentUrl
	};
}
