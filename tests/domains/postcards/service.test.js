import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadPostcardDetailPage, loadPostcardDirectoryPage } from "../../../src/domains/postcards/service.js";

function buildPostcard(id, overrides = {}) {
	return {
		id,
		title: `Postcard ${id}`,
		excerpt: `Story ${id}`,
		author: { name: "Author", avatar: null, associated_user: 2 },
		category: { id: 1, name: "Travel" },
		tags: [{ id: 1, name: "rome" }],
		banner_img: "https://images.example/postcard.jpg",
		location: { city: "Rome", country: "Italy" },
		region: "Europe",
		created_at: "2030-01-01T00:00:00Z",
		updated_at: "2030-01-02T00:00:00Z",
		like_count: 3,
		comment_count: 1,
		views: 10,
		...overrides
	};
}

describe("postcards service", () => {
	beforeEach(() => {
		process.env.API_URL = "https://api.example.test/api/v1/";
	});

	it("forwards supported directory filters and maps page-number pagination", async () => {
		const fetchMock = vi.fn(async (url) => {
			const requestUrl = new URL(String(url));
			expect(requestUrl.pathname).toBe("/api/v1/postcards/list");
			expect(requestUrl.searchParams.get("q")).toBe("Rome");
			expect(requestUrl.searchParams.get("category")).toBe("Travel");
			expect(requestUrl.searchParams.get("tag")).toBe("summer");
			expect(requestUrl.searchParams.get("sort_by")).toBe("-views");
			expect(requestUrl.searchParams.get("page")).toBe("2");
			expect(requestUrl.searchParams.get("page_size")).toBe("12");

			return new Response(JSON.stringify({
				count: 30,
				next: "https://api.example.test/api/v1/postcards/list?page=3",
				previous: "https://api.example.test/api/v1/postcards/list?page=1",
				results: [buildPostcard(13)]
			}), { status: 200, headers: { "content-type": "application/json" } });
		});

		const result = await loadPostcardDirectoryPage({
			q: " Rome ", category: "Travel", tag: "summer", sort_by: "-views", page: "2"
		}, { fetch: fetchMock });

		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data.page).toBe(2);
			expect(result.data.totalPages).toBe(3);
			expect(result.data.nextPage).toBe(3);
			expect(result.data.previousPage).toBe(1);
			expect(result.data.results[0]?.href).toBe("/postcards/13");
		}
	});

	it("loads modular detail and treats related-postcard failure as non-fatal", async () => {
		const fetchMock = vi.fn(async (url) => {
			const href = String(url);
			if (href.endsWith("/postcards/42")) {
				return new Response(JSON.stringify(buildPostcard(42, {
					content_blocks: [{ type: "paragraph", text: "Safe modular story" }]
				})), { status: 200, headers: { "content-type": "application/json" } });
			}
			if (href.includes("/postcards/list")) {
				return new Response(JSON.stringify({ detail: "temporary failure" }), {
					status: 503,
					headers: { "content-type": "application/json" }
				});
			}
			throw new Error(`Unexpected URL: ${href}`);
		});

		const result = await loadPostcardDetailPage(42, { fetch: fetchMock });
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data.postcard.contentFormat).toBe("modular");
			expect(result.data.relatedPostcards).toEqual([]);
		}
	});

	it("maps a missing detail response to a not-found domain error", async () => {
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({ detail: "missing" }), {
			status: 404,
			headers: { "content-type": "application/json" }
		}));

		const result = await loadPostcardDetailPage(999, { fetch: fetchMock });
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.code).toBe("not_found");
			expect(result.error.status).toBe(404);
		}
	});

	it("rejects malformed modular block envelopes", async () => {
		const fetchMock = vi.fn(async () => new Response(JSON.stringify(buildPostcard(42, {
			content_blocks: [{ text: "Missing block discriminator" }]
		})), { status: 200, headers: { "content-type": "application/json" } }));

		const result = await loadPostcardDetailPage(42, { fetch: fetchMock });
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error.code).toBe("invalid_response");
	});
});
