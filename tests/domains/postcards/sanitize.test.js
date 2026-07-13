import { describe, expect, it } from "vitest";
import { sanitizeLegacyHtml, sanitizeUrl } from "../../../src/domains/postcards/sanitize.js";

describe("postcard legacy HTML sanitizer", () => {
	it("removes active content, event handlers, styles, and unsafe links", () => {
		const html = sanitizeLegacyHtml(`
			<script>alert('xss')</script>
			<p style="position:fixed" onclick="steal()">Safe <strong>story</strong></p>
			<a href="jav&#x61;script:alert(1)" target="_blank">bad link</a>
			<iframe src="https://evil.example"></iframe>
		`);

		expect(html).toContain("<p>Safe <strong>story</strong></p>");
		expect(html).toContain("<a target=\"_blank\" rel=\"noopener noreferrer\">bad link</a>");
		expect(html).not.toMatch(/script|iframe|onclick|style=|javascript:/i);
	});

	it("keeps safe article images and resolves API-relative media URLs", () => {
		const html = sanitizeLegacyHtml(
			`<figure><img src="/media/postcard.jpg" alt="Coast" onerror="alert(1)"><figcaption>Split</figcaption></figure>`,
			{ baseUrl: "https://api.example.test/api/v1/" }
		);

		expect(html).toContain('src="https://api.example.test/media/postcard.jpg"');
		expect(html).toContain('alt="Coast"');
		expect(html).toContain('loading="lazy"');
		expect(html).not.toContain("onerror");
	});

	it("rejects dangerous and protocol-relative URLs", () => {
		expect(sanitizeUrl("java&Tab;script:alert(1)", { type: "href" })).toBeNull();
		expect(sanitizeUrl("//evil.example/image.jpg", { type: "src" })).toBeNull();
		expect(sanitizeUrl("https://images.example/photo.jpg", { type: "src" })).toBe("https://images.example/photo.jpg");
	});

	it("does not throw on out-of-range numeric entities", () => {
		expect(() => sanitizeUrl("&#999999999999;https://safe.example", { type: "href" })).not.toThrow();
		expect(sanitizeUrl("&#999999999999;javascript:alert(1)", { type: "href" })).toBeNull();
	});
});
