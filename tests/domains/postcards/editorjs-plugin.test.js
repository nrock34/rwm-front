import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("postcard editorjs plugin asset", () => {
	it("exports a browser-ready global plugin bundle", () => {
		const source = readFileSync(
			resolve(process.cwd(), "static/postcards/postcard-editorjs-plugin.js"),
			"utf8"
		);

		expect(source).toContain("global.PostcardEditorPlugin");
		expect(source).toContain("function createPostcardTools");
		expect(source).toContain("class PostcardLayoutTool");
		expect(source).toContain("Set margin bottom");
	});
});
