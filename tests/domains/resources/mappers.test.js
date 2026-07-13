import { describe, expect, it } from "vitest";
import { mapResourceDetail } from "../../../src/domains/resources/mappers.js";

describe("resource mappers", () => {
	it("sanitizes API-authored HTML before it reaches the renderer", () => {
		const resource = mapResourceDetail({
			id: 7,
			title: "Visa guide",
			type: "page",
			category: "guides",
			page_content: '<p onclick="steal()">Safe</p><script>alert(1)</script><img src="/media/visa.jpg">'
		}, { apiUrl: "https://api.example.test/v1/" });

		expect(resource.pageContent).toContain("<p>Safe</p>");
		expect(resource.pageContent).toContain('src="https://api.example.test/media/visa.jpg"');
		expect(resource.pageContent).not.toMatch(/onclick|script/iu);
	});

	it("rejects active content URLs and resolves safe API-relative files", () => {
		const unsafe = mapResourceDetail({ id: 1, type: "pdf", category: "guide", content: '<img src="javascript:alert(1)"><script>alert(1)</script>' }, { apiUrl: "https://api.example.test/v1/" });
		const safe = mapResourceDetail({ id: 2, type: "pdf", category: "guide", content: "/media/guide.pdf" }, { apiUrl: "https://api.example.test/v1/" });
		expect(unsafe.contentUrl).toBeNull();
		expect(unsafe.content).toBeNull();
		expect(safe.contentUrl).toBe("https://api.example.test/media/guide.pdf");
	});
});
