import { describe, expect, it } from "vitest";
import { getVideoEmbedUrl, isEmbeddableVideoUrl } from "../../../src/lib/components/resources/cards/resource-preview.js";

describe("resource video preview", () => {
	it("normalizes supported providers to privacy-conscious embed URLs", () => {
		expect(getVideoEmbedUrl("https://youtu.be/dQw4w9WgXcQ?t=1")).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
		expect(getVideoEmbedUrl("https://vimeo.com/123456789")).toBe("https://player.vimeo.com/video/123456789");
	});

	it("rejects lookalike and active-content URLs", () => {
		expect(isEmbeddableVideoUrl("https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ")).toBe(false);
		expect(getVideoEmbedUrl("javascript:alert(1)")).toBeNull();
	});
});
