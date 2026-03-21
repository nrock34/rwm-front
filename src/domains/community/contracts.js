import { assertArray, assertNumber, assertObject, assertString } from "../../core/domain/contracts.js";
import { coerceDomainError, createDomainError } from "../../core/domain/errors.js";

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
function assertAuthorShape(value) {
	const author = assertObject(value, "author");
	assertString(author.name, "author.name");
	return author;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown> | null}
 */
function assertCategoryShape(value) {
	if (value == null) return null;
	const category = assertObject(value, "category");
	assertString(category.name, "category.name");
	return category;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertPost(value) {
	const post = assertObject(value, "post");
	assertNumber(post.id, "post.id");
	assertString(post.title, "post.title");
	assertString(post.content, "post.content");
	assertString(post.type, "post.type");
	assertString(post.created_at, "post.created_at");
	assertString(post.updated_at, "post.updated_at");
	assertAuthorShape(post.author);
	assertCategoryShape(post.category);
	assertArray(post.tags, "post.tags");
	assertNumber(post.like_count, "post.like_count");
	assertNumber(post.comment_count, "post.comment_count");
	assertNumber(post.views, "post.views");
	if (typeof post.published !== "boolean") {
		throw createDomainError("invalid_response", 502, "post.published must be a boolean.", post.published);
	}
	if (typeof post.liked_by_viewer !== "boolean") {
		throw createDomainError("invalid_response", 502, "post.liked_by_viewer must be a boolean.", post.liked_by_viewer);
	}
	return post;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertComment(value) {
	const comment = assertObject(value, "comment");
	assertNumber(comment.id, "comment.id");
	assertAuthorShape(comment.author);
	assertString(comment.content, "comment.content");
	assertString(comment.created_at, "comment.created_at");
	assertString(comment.updated_at, "comment.updated_at");
	return comment;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertUpdate(value) {
	const update = assertObject(value, "update");
	assertNumber(update.id, "update.id");
	assertString(update.title, "update.title");
	assertCategoryShape(update.category);
	assertString(update.summary, "update.summary");
	assertString(update.updated_at, "update.updated_at");
	assertString(update.created_at, "update.created_at");
	assertNumber(update.views, "update.views");
	assertNumber(update.shares, "update.shares");
	assertNumber(update.comment_count, "update.comment_count");
	assertNumber(update.like_count, "update.like_count");
	if (typeof update.urgent !== "boolean") {
		throw createDomainError("invalid_response", 502, "update.urgent must be a boolean.", update.urgent);
	}
	return update;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertUpdateDetail(value) {
	const update = assertUpdate(value);
	assertString(update.content, "update.content");
	return update;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertProgram(value) {
	const program = assertObject(value, "program");
	assertNumber(program.id, "program.id");
	assertString(program.title, "program.title");
	assertString(program.duration, "program.duration");
	assertNumber(program.participants, "program.participants");
	assertObject(program.provider, "program.provider");
	assertObject(program.location, "program.location");
	return program;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertScholarship(value) {
	const scholarship = assertObject(value, "scholarship");
	assertNumber(scholarship.id, "scholarship.id");
	assertString(scholarship.name, "scholarship.name");
	assertString(scholarship.summary, "scholarship.summary");
	assertArray(scholarship.categories, "scholarship.categories");
	assertObject(scholarship.provider, "scholarship.provider");
	assertString(scholarship.status, "scholarship.status");
	return scholarship;
}

/**
 * @param {unknown} value
 * @returns {{ results: Record<string, unknown>[]; next: string | null; previous: string | null }}
 */
export function assertPostPage(value) {
	return assertCursorLike(value, assertPost, "post list");
}

/**
 * @param {unknown} value
 * @returns {{ results: Record<string, unknown>[]; next: string | null; previous: string | null }}
 */
export function assertCommentPage(value) {
	return assertCursorLike(value, assertComment, "comment list");
}

/**
 * @param {unknown} value
 * @returns {{ results: Record<string, unknown>[]; next: string | null; previous: string | null }}
 */
export function assertUpdatePage(value) {
	return assertCursorLike(value, assertUpdate, "update list");
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>[]}
 */
export function assertProgramList(value) {
	return assertArray(value, "program list").map(assertProgram);
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>[]}
 */
export function assertScholarshipList(value) {
	return assertArray(value, "scholarship list").map(assertScholarship);
}

/**
 * @param {unknown} value
 * @returns {{ id: number }}
 */
export function assertCreatePostResponse(value) {
	const payload = assertObject(value, "post create response");
	return { id: assertNumber(payload.id, "post.id") };
}

/**
 * @param {unknown} value
 * @returns {{ liked: boolean }}
 */
export function assertLikeToggleResponse(value) {
	const payload = assertObject(value, "like response");
	if (typeof payload.liked !== "boolean") {
		throw createDomainError("invalid_response", 502, "like response must include a boolean liked field.", payload);
	}
	return { liked: payload.liked };
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertCreateCommentResponse(value) {
	return assertComment(value);
}

/**
 * @param {unknown} value
 * @param {(item: unknown) => Record<string, unknown>} itemAssert
 * @param {string} label
 * @returns {{ results: Record<string, unknown>[]; next: string | null; previous: string | null }}
 */
function assertCursorLike(value, itemAssert, label) {
	if (Array.isArray(value)) {
		return {
			results: value.map(itemAssert),
			next: null,
			previous: null
		};
	}

	const page = assertObject(value, label);
	const results = assertArray(page.results, `${label} results`);

	return {
		results: results.map(itemAssert),
		next: typeof page.next === "string" ? page.next : null,
		previous: typeof page.previous === "string" ? page.previous : null
	};
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").CommunityDomainError}
 */
export function asDomainError(value) {
	return /** @type {import("./types.js").CommunityDomainError} */ (
		coerceDomainError(value, {
			missingEnvCode: "missing_env",
			fallbackCode: "upstream_error",
			fallbackMessage: "Unexpected community domain failure."
		})
	);
}
