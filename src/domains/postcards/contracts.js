import { assertArray, assertObject, assertString } from "../../core/domain/contracts.js";
import { createDomainError } from "../../core/domain/errors.js";

/**
 * @param {unknown} value
 * @param {string} label
 * @returns {number | string}
 */
function assertId(value, label) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim()) return value;
	throw createDomainError("invalid_response", 502, `${label} must be a string or number.`, value);
}

/**
 * Validate a modular block envelope without coupling the frontend to one CMS.
 * Supported producers use `type`, `kind`, or `block_type` as the discriminator.
 *
 * @param {unknown} value
 * @param {string} label
 * @returns {Record<string, unknown>[]}
 */
function assertBlockArray(value, label) {
	return assertArray(value, label).map((entry, index) => {
		const block = assertObject(entry, `${label}[${index}]`);
		const discriminator = block.type ?? block.kind ?? block.block_type;
		if (typeof discriminator !== "string" || !discriminator.trim()) {
			throw createDomainError(
				"invalid_response",
				502,
				`${label}[${index}] must include a block type.`,
				entry
			);
		}
		return block;
	});
}

/**
 * @param {Record<string, unknown>} postcard
 */
function validateModularContent(postcard) {
	const directKeys = ["blocks", "content_blocks", "article_blocks"];
	for (const key of directKeys) {
		if (postcard[key] != null) assertBlockArray(postcard[key], `postcard.${key}`);
	}

	if (Array.isArray(postcard.content)) {
		assertBlockArray(postcard.content, "postcard.content");
	} else if (postcard.content != null && typeof postcard.content !== "string") {
		const content = assertObject(postcard.content, "postcard.content");
		if (content.blocks != null) assertBlockArray(content.blocks, "postcard.content.blocks");
	}

	for (const key of ["article", "body"]) {
		if (postcard[key] == null) continue;
		const envelope = assertObject(postcard[key], `postcard.${key}`);
		if (envelope.blocks != null) assertBlockArray(envelope.blocks, `postcard.${key}.blocks`);
	}
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertPostcardSummary(value) {
	const postcard = assertObject(value, "postcard");
	assertId(postcard.id, "postcard.id");
	const title = assertString(postcard.title, "postcard.title");
	if (!title.trim()) {
		throw createDomainError("invalid_response", 502, "postcard.title cannot be empty.", value);
	}
	return postcard;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function assertPostcardDetailPayload(value) {
	const postcard = assertPostcardSummary(value);
	validateModularContent(postcard);
	return postcard;
}

/**
 * @param {unknown} value
 * @returns {{ count: number; next: string | null; previous: string | null; results: Record<string, unknown>[] }}
 */
export function assertPostcardListPage(value) {
	if (Array.isArray(value)) {
		return {
			count: value.length,
			next: null,
			previous: null,
			results: value.map(assertPostcardSummary)
		};
	}

	const page = assertObject(value, "postcard list page");
	const results = assertArray(page.results, "postcard list page.results").map(assertPostcardSummary);
	const count = page.count == null ? results.length : page.count;
	if (typeof count !== "number" || !Number.isFinite(count) || count < 0) {
		throw createDomainError("invalid_response", 502, "postcard list page.count must be a non-negative number.", count);
	}

	return {
		count,
		next: typeof page.next === "string" ? page.next : null,
		previous: typeof page.previous === "string" ? page.previous : null,
		results
	};
}
