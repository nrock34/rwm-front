import { describe, expect, it } from "vitest";
import { render } from "svelte/server";
import PostcardContentPreview from "../../../../src/lib/components/postcards/PostcardContentPreview.svelte";
import { buildMockPostcardEditorDocument } from "../../../../src/domains/postcards/mock-document.js";

describe("PostcardContentPreview", () => {
	it("renders the default preview without showing JSON", () => {
		const { body } = render(PostcardContentPreview, {
			props: {
				document: buildMockPostcardEditorDocument(),
				source: "mock"
			}
		});

		expect(body).toContain("Block Content Preview");
		expect(body).toContain("Mock content");
		expect(body).toContain("Show JSON");
		expect(body).toContain("grid-template-columns:1fr 1fr;");
		expect(body).toContain("Field Notes and One Borrowed Line");
		expect(body).toContain("A section intro should be a real content block");
		expect(body).not.toContain("Rendered payload");
	});

	it("shows JSON when requested and renders captions and poll placeholder copy", () => {
		const { body } = render(PostcardContentPreview, {
			props: {
				document: buildMockPostcardEditorDocument(),
				source: "edited",
				showJsonByDefault: true
			}
		});

		expect(body).toContain("Edited preview");
		expect(body).toContain("Rendered payload");
		expect(body).toContain("Poll placeholder");
		expect(body).toContain("Slide one: a slower interior moment");
		expect(body).toContain("Hero image block with an editorial-style caption");
		expect(body).toContain("Open in Spotify");
		expect(body).not.toContain("Open source");
	});

	it("uses block.mb when present and falls back to default spacing otherwise", () => {
		const document = buildMockPostcardEditorDocument();
		document.blocks[0].mb = "mb-8";

		const { body } = render(PostcardContentPreview, {
			props: {
				document,
				source: "edited"
			}
		});

		expect(body).toContain('class="mb-8"');
		expect(body).toContain('class="mb-5 last:mb-0"');
	});
});
