import {
	assertArray,
	assertNullableString,
	assertNumber,
	assertObject,
	assertString
} from "../../core/domain/contracts.js";
import { coerceDomainError } from "../../core/domain/errors.js";

/**
 * @param {unknown} value
 * @returns {Record<string, unknown> | null}
 */
function assertAuthor(value) {
	if (value == null) return null;
	const author = assertObject(value, "author");
	assertString(author.name, "author.name");
	return author;
}

/**
 * @param {unknown} value
 * @returns {Array<Record<string, unknown>>}
 */
function assertTags(value) {
	return assertArray(value, "tags").map((tag) => {
		const resourceTag = assertObject(tag, "tag");
		assertString(resourceTag.name, "tag.name");
		return resourceTag;
	});
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertResourceSummary(value) {
	const resource = assertObject(value, "resource");
	assertNumber(resource.id, "resource.id");
	assertString(resource.title, "resource.title");
	assertString(resource.description, "resource.description");
	assertString(resource.category, "resource.category");
	assertString(resource.type, "resource.type");
	assertNumber(resource.rating, "resource.rating");
	assertNumber(resource.views, "resource.views");
	assertAuthor(resource.author);
	assertString(resource.thumbnail, "resource.thumbnail");
	assertTags(resource.tags);
	return resource;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertResourceDetail(value) {
	const resource = assertResourceSummary(value);
	assertNullableString(resource.content, "resource.content");
	assertNullableString(resource.page_content, "resource.page_content");
	return resource;
}

/**
 * @param {unknown} value
 * @returns {{ count: number; next: string | null; previous: string | null; results: Record<string, unknown>[] }}
 */
export function assertResourceListPage(value) {
	if (Array.isArray(value)) {
		return {
			count: value.length,
			next: null,
			previous: null,
			results: value.map(assertResourceSummary)
		};
	}

	const page = assertObject(value, "resource list page");
	const results = assertArray(page.results, "resource list page.results");

	return {
		count: typeof page.count === "number" ? page.count : results.length,
		next: typeof page.next === "string" ? page.next : null,
		previous: typeof page.previous === "string" ? page.previous : null,
		results: results.map(assertResourceSummary)
	};
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").ResourceDomainError}
 */
export function asDomainError(value) {
	return /** @type {import("./types.js").ResourceDomainError} */ (
		coerceDomainError(value, {
			missingEnvCode: "missing_env",
			fallbackCode: "upstream_error",
			fallbackMessage: "Unexpected resource domain failure."
		})
	);
}
