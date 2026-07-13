import { describe, expect, it } from "vitest";
import { mapPostcardDetail } from "../../../src/domains/postcards/mappers.js";

function buildPostcard(overrides = {}) {
	return {
		id: 42,
		title: "A weekend in Split",
		excerpt: "A practical guide to a sunny weekend on the coast.",
		author: { name: "Test Author", avatar: "/media/avatar.jpg", associated_user: 7 },
		category: { id: 3, name: "Travel" },
		tags: [{ id: 2, name: "Croatia" }],
		banner_img: "/media/banner.jpg",
		location: { city: "Split", country: "Croatia" },
		region: "Europe",
		created_at: "2030-04-10T12:00:00Z",
		updated_at: "2030-04-11T12:00:00Z",
		like_count: 5,
		comment_count: 2,
		views: 100,
		...overrides
	};
}

describe("postcard detail mapping", () => {
	it("migrates and sanitizes CKEditor HTML", () => {
		const postcard = mapPostcardDetail(buildPostcard({
			content: `<h2>Arrival</h2><p onclick="bad()">Hello <strong>Split</strong>.</p><script>alert(1)</script><img src="/media/split.jpg" alt="Split coast">`
		}), { apiUrl: "https://api.example.test/api/v1/" });

		expect(postcard.contentFormat).toBe("legacy_html");
		expect(postcard.articleBlocks).toHaveLength(1);
		expect(postcard.articleBlocks[0]?.kind).toBe("legacy_html");
		expect(postcard.articleBlocks[0]?.html).not.toMatch(/script|onclick/i);
		expect(postcard.gallery).toEqual([{
			src: "https://api.example.test/media/split.jpg",
			alt: "Split coast"
		}]);
		expect(postcard.author.href).toBe("/profiles/7");
		expect(postcard.image).toBe("https://api.example.test/media/banner.jpg");
	});

	it("normalizes Editor.js and StreamField-style modular blocks", () => {
		const postcard = mapPostcardDetail(buildPostcard({
			content_blocks: [
				{ type: "header", data: { text: "Where to stay", level: 3 } },
				{ type: "paragraph", data: { text: `Choose the <strong>old town</strong>.<img src=x onerror="bad()">` } },
				{ type: "image", value: { src: "/media/room.jpg", alt: "A bright room", caption: "Our room" } },
				{ type: "ordered-list", items: ["Book early", { text: "Check transit" }] },
				{ type: "callout", data: { tone: "tip", title: "Local tip", text: "Carry cash." } },
				{ type: "unsupported", text: "Fallback copy" }
			]
		}), { apiUrl: "https://api.example.test/api/v1/" });

		expect(postcard.contentFormat).toBe("modular");
		expect(postcard.articleBlocks.map((block) => block.kind)).toEqual([
			"heading", "paragraph", "image", "list", "callout", "paragraph"
		]);
		expect(postcard.articleBlocks[0]).toMatchObject({ level: 3, text: "Where to stay" });
		expect(postcard.articleBlocks[1]?.html).not.toContain("onerror");
		expect(postcard.articleBlocks[2]).toMatchObject({
			src: "https://api.example.test/media/room.jpg",
			alt: "A bright room"
		});
		expect(postcard.articleBlocks[3]).toMatchObject({ ordered: true, items: ["Book early", "Check transit"] });
	});

	it("accepts a JSON-serialized modular content envelope during migration", () => {
		const postcard = mapPostcardDetail(buildPostcard({
			content: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Serialized story" } }] })
		}), { apiUrl: "https://api.example.test/" });

		expect(postcard.contentFormat).toBe("modular");
		expect(postcard.articleBlocks).toEqual([{ kind: "paragraph", html: "Serialized story" }]);
	});

	it("falls back to the legacy body while an empty modular field is being migrated", () => {
		const postcard = mapPostcardDetail(buildPostcard({
			content_blocks: [],
			content: "<p>Legacy story remains available.</p>"
		}), { apiUrl: "https://api.example.test/" });

		expect(postcard.contentFormat).toBe("legacy_html");
		expect(postcard.articleBlocks).toEqual([{ kind: "legacy_html", html: "<p>Legacy story remains available.</p>" }]);
	});
});
