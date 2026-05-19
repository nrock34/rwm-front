import { buildMockPostcardEditorDocument } from "./mock-document.js";

/**
 * @param {{ contentBlocks?: import("./types.js").PostcardEditorDocument | null; title?: string | null; location?: { city?: string | null; country?: string | null } | null }} postcard
 * @returns {{ document: import("./types.js").PostcardEditorDocument; source: "api" | "mock" }}
 */
export function resolvePostcardPreviewDocument(postcard) {
	if (postcard.contentBlocks) {
		return {
			document: postcard.contentBlocks,
			source: "api"
		};
	}

	return {
		document: buildMockPostcardEditorDocument(postcard),
		source: "mock"
	};
}

/**
 * @param {import("./types.js").PostcardEditorBlock | import("./types.js").PostcardLayoutChildBlock} block
 * @param {string[]} sources
 */
function collectImagesFromBlock(block, sources) {
	if (block.type === "layout") {
		for (const column of block.data.columns) {
			for (const childBlock of column.blocks) {
				collectImagesFromBlock(childBlock, sources);
			}
		}
		return;
	}

	if (block.type === "image") {
		sources.push(block.data.src);
	}

	if (block.type === "slideshow") {
		for (const slide of block.data.slides) {
			sources.push(slide.src);
		}
	}
}

/**
 * @param {import("./types.js").PostcardEditorDocument | null | undefined} document
 * @returns {string[]}
 */
export function collectPostcardBlockImageSources(document) {
	if (!document) {
		return [];
	}

	/** @type {string[]} */
	const sources = [];
	for (const block of document.blocks) {
		collectImagesFromBlock(block, sources);
	}

	return sources;
}

/**
 * @param {string | null | undefined} html
 * @returns {string[]}
 */
export function extractImageSourcesFromHtml(html) {
	if (!html) {
		return [];
	}

	return Array.from(
		html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/giu),
		(match) => match[1] ?? ""
	).filter((src) => src.length > 0);
}

/**
 * @param {{ contentBlocks?: import("./types.js").PostcardEditorDocument | null; content?: string | null }} postcard
 * @returns {string[]}
 */
export function getPostcardGalleryImages(postcard) {
	const blockImages = collectPostcardBlockImageSources(postcard.contentBlocks);
	if (blockImages.length > 0) {
		return blockImages;
	}

	return extractImageSourcesFromHtml(postcard.content);
}
