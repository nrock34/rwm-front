import { describe, expect, it } from "vitest";
import {
	assertPostcardEditorDocument,
	parsePostcardEditorDocument
} from "../../../src/domains/postcards/contracts.js";
import { buildMockPostcardEditorDocument } from "../../../src/domains/postcards/mock-document.js";
import {
	collectPostcardBlockImageSources,
	extractImageSourcesFromHtml,
	getPostcardGalleryImages,
	resolvePostcardPreviewDocument
} from "../../../src/domains/postcards/preview.js";

describe("postcard content contracts", () => {
	it("accepts the happy-path mock document", () => {
		const document = assertPostcardEditorDocument(buildMockPostcardEditorDocument({
			title: "Sunrise in Lisbon",
			location: { city: "Lisbon", country: "Portugal" }
		}));

		expect(document.format).toBe("editorjs");
		expect(document.version).toBe(1);
		expect(document.blocks.length).toBeGreaterThan(0);
		expect(document.blocks.some((block) => block.type === "layout")).toBe(true);
		expect(document.blocks.some((block) => block.type === "header")).toBe(true);
		expect(document.blocks.some((block) => block.type === "subtext")).toBe(true);
	});

	it("rejects unknown block types", () => {
		expect(() => assertPostcardEditorDocument({
			format: "editorjs",
			version: 1,
			blocks: [
				{
					id: "bad-block",
					type: "timeline",
					data: { text: "Nope" }
				}
			]
		})).toThrow();
	});

	it("rejects empty block arrays", () => {
		expect(() => assertPostcardEditorDocument({
			format: "editorjs",
			version: 1,
			blocks: []
		})).toThrow();
	});

	it("rejects invalid embed kinds and malformed urls", () => {
		expect(() => assertPostcardEditorDocument({
			format: "editorjs",
			version: 1,
			blocks: [
				{
					id: "embed-1",
					type: "embed",
					data: {
						kind: "soundcloud",
						url: "not-a-url"
					}
				}
			]
		})).toThrow();
	});

	it("accepts image settings saved by the image tool", () => {
		const document = assertPostcardEditorDocument({
			format: "editorjs",
			version: 1,
			blocks: [
				{
					id: "image-1",
					type: "image",
					data: {
						src: "https://cdn.example.test/photo.jpg",
						caption: "Configured image",
						withBorder: true,
						withBackground: true,
						stretched: false
					}
				}
			]
		});

		expect(document.blocks[0]?.type).toBe("image");
		expect(document.blocks[0]?.data).toMatchObject({
			withBorder: true,
			withBackground: true,
			stretched: false
		});
	});

	it("accepts block.mb when it is a tailwind margin class", () => {
		const document = assertPostcardEditorDocument({
			format: "editorjs",
			version: 1,
			blocks: [
				{
					id: "paragraph-1",
					type: "paragraph",
					mb: "mb-8",
					data: {
						text: "Custom spacing paragraph."
					}
				}
			]
		});

		expect(document.blocks[0]?.mb).toBe("mb-8");
	});

	it("allows arbitrary tailwind-style block.mb values", () => {
		const document = assertPostcardEditorDocument({
			format: "editorjs",
			version: 1,
			blocks: [
				{
					id: "paragraph-1",
					type: "paragraph",
					mb: "mb-[3.25rem]",
					data: {
						text: "Arbitrary spacing paragraph."
					}
				}
			]
		});

		expect(document.blocks[0]?.mb).toBe("mb-[3.25rem]");
	});

	it("rejects nested layouts inside layout columns", () => {
		expect(() => assertPostcardEditorDocument({
			format: "editorjs",
			version: 1,
			blocks: [
				{
					id: "layout-1",
					type: "layout",
					data: {
						columns: [
							{
								width: "1fr",
								blocks: [
									{
										id: "nested-layout",
										type: "layout",
										data: {
											columns: [
												{
													width: "1fr",
													blocks: [
														{
															id: "child-paragraph",
															type: "paragraph",
															data: { text: "Nested content" }
														}
													]
												},
												{
													width: "1fr",
													blocks: [
														{
															id: "child-paragraph-2",
															type: "paragraph",
															data: { text: "Nested content 2" }
														}
													]
												}
											]
										}
									}
								]
							},
							{
								width: "1fr",
								blocks: [
									{
										id: "paragraph-1",
										type: "paragraph",
										data: { text: "Sibling column" }
									}
								]
							}
						]
					}
				}
			]
		})).toThrow();
	});

	it("accepts header and subtext blocks with font size options", () => {
		const document = assertPostcardEditorDocument({
			format: "editorjs",
			version: 1,
			blocks: [
				{
					id: "header-1",
					type: "header",
					data: {
						text: "Neighborhood rhythm",
						fontSize: "lg",
					}
				},
				{
					id: "subtext-1",
					type: "subtext",
					data: {
						text: "A short intro that frames the row before readers scan the columns.",
						fontSize: "sm"
					}
				}
			]
		});

		expect(document.blocks[0]?.type).toBe("header");
		expect(document.blocks[0]?.data).toMatchObject({
			text: "Neighborhood rhythm",
			fontSize: "lg"
		});
		expect(document.blocks[1]?.type).toBe("subtext");
		expect(document.blocks[1]?.data).toMatchObject({
			text: "A short intro that frames the row before readers scan the columns.",
			fontSize: "sm"
		});
	});

	it("returns null for invalid optional payloads", () => {
		expect(parsePostcardEditorDocument({ nope: true })).toBeNull();
	});
});

describe("postcard preview helpers", () => {
	it("uses mock content when contentBlocks is absent", () => {
		const preview = resolvePostcardPreviewDocument({
			title: "Evening Ferry",
			location: { city: "Athens", country: "Greece" },
			contentBlocks: null
		});

		expect(preview.source).toBe("mock");
		expect(preview.document.blocks.some((block) => block.type === "poll")).toBe(true);
	});

	it("prefers api content when contentBlocks is present", () => {
		const apiDocument = assertPostcardEditorDocument({
			format: "editorjs",
			version: 1,
			blocks: [
				{
					id: "intro-1",
					type: "paragraph",
					data: { text: "Live API content." }
				}
			]
		});

		const preview = resolvePostcardPreviewDocument({
			title: "API Story",
			contentBlocks: apiDocument
		});

		expect(preview.source).toBe("api");
		expect(preview.document.blocks[0]?.data).toMatchObject({ text: "Live API content." });
	});

	it("collects block-based gallery images and falls back to legacy html images", () => {
		const document = buildMockPostcardEditorDocument();
		const blockImages = collectPostcardBlockImageSources(document);

		expect(blockImages.length).toBeGreaterThan(1);
		expect(blockImages[0]).toContain("https://");

		const htmlImages = extractImageSourcesFromHtml(`
			<p>hello</p>
			<img src="https://cdn.example.test/one.jpg" alt="one" />
			<img src='https://cdn.example.test/two.jpg' alt='two' />
		`);
		expect(htmlImages).toEqual([
			"https://cdn.example.test/one.jpg",
			"https://cdn.example.test/two.jpg"
		]);

		expect(getPostcardGalleryImages({
			contentBlocks: document,
			content: "<img src='https://cdn.example.test/legacy.jpg' />"
		})).toEqual(blockImages);

		expect(getPostcardGalleryImages({
			contentBlocks: null,
			content: "<img src='https://cdn.example.test/legacy.jpg' />"
		})).toEqual(["https://cdn.example.test/legacy.jpg"]);
	});
});
