import { describe, expect, it } from "vitest";
import { buildMockPostcardEditorDocument } from "../../../src/domains/postcards/mock-document.js";
import {
	buildPostcardDocumentFromLayoutEditorData,
	buildPostcardLayoutEditorData,
	buildPostcardLayoutEditorHtml
} from "../../../src/domains/postcards/layout-editor.js";

describe("postcard layout editor helpers", () => {
	it("seeds the popup editor with the postcard document block data", () => {
		const document = buildMockPostcardEditorDocument({
			title: "Layout Study",
			location: { city: "Seville", country: "Spain" }
		});

		const editorData = buildPostcardLayoutEditorData(document);

		expect(editorData.blocks).toEqual(document.blocks);
		expect(editorData.blocks.some((block) => block.type === "layout")).toBe(true);
		expect(editorData.blocks.find((block) => block.type === "layout")?.data.columns).toHaveLength(2);
	});

	it("builds a standalone custom postcard editor html document", () => {
		const html = buildPostcardLayoutEditorHtml(buildMockPostcardEditorDocument(), {
			title: "Postcard layout playground"
		});

		expect(html).toContain("Postcard layout playground");
		expect(html).toContain("/postcards/postcard-editorjs-plugin.css");
		expect(html).toContain("/postcards/postcard-editorjs-plugin.js");
		expect(html).toContain("@editorjs/editorjs@latest/dist/editorjs.umd.js");
		expect(html).toContain("window.PostcardEditorPlugin");
		expect(html).toContain("createPostcardTools");
		expect(html).toContain("normalizeBlock");
		expect(html).toContain("Apply to postcard preview");
		expect(html).toContain("shared Editor.js postcard plugin bundle");
	});

	it("restores saved editor data back into a validated postcard document", () => {
		const document = buildMockPostcardEditorDocument();
		const editorData = buildPostcardLayoutEditorData(document);
		const layoutBlock = editorData.blocks.find((block) => block.id === "layout-note-quote-1");
		const headerBlock = editorData.blocks.find((block) => block.id === "layout-note-quote-header-1");

		headerBlock.data.mb = "mb-8";

		layoutBlock.data.columns = [
			{
				width: "2fr",
				blocks: [layoutBlock.data.columns[1].blocks[0]]
			},
			{
				width: "1fr",
				blocks: [layoutBlock.data.columns[0].blocks[0]]
			},
			{
				width: "1.5fr",
				blocks: [
					{
						id: "extra-paragraph-1",
						type: "paragraph",
						data: { text: "A new third column block." }
					}
				]
			}
		];
		const restored = buildPostcardDocumentFromLayoutEditorData(editorData);
		const restoredLayoutBlock = restored.blocks.find((block) => block.id === "layout-note-quote-1");

		expect(restoredLayoutBlock?.type).toBe("layout");
		expect(restoredLayoutBlock?.data.columns).toHaveLength(3);
		expect(restoredLayoutBlock?.data.columns[0]?.width).toBe("2fr");
		expect(restoredLayoutBlock?.data.columns[0]?.blocks[0]?.id).toBe("quote-1");
		expect(restoredLayoutBlock?.data.columns[1]?.blocks[0]?.id).toBe("aside-1");
		expect(restoredLayoutBlock?.data.columns[2]?.blocks[0]?.id).toBe("extra-paragraph-1");
		expect(restored.blocks.find((block) => block.id === "layout-note-quote-header-1")?.mb).toBe("mb-8");
	});
});
