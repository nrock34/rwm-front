import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadResourceCollections, loadResourceDetailPage } from "../../../src/domains/resources/service.js";

function buildResource(id, overrides = {}) {
	return {
		id,
		title: `Resource ${id}`,
		description: `Description ${id}`,
		category: "guides",
		type: "pdf",
		rating: 4.5,
		views: 100,
		author: {
			name: "Author Name",
			avatar: "/media/avatars/author.png",
			associated_user: 1
		},
		thumbnail: "/media/resources/thumb.jpg",
		tags: [{ name: "rome" }],
		...overrides
	};
}

describe("resources service", () => {
	beforeEach(() => {
		process.env.API_URL = "https://api.example.test/";
	});

	it("loads collections and groups resources by the API category field", async () => {
		const fetchMock = vi.fn(async (url) => {
			const href = String(url);
			expect(href).toContain("resources/list");

			return new Response(JSON.stringify({
				count: 2,
				next: null,
				previous: null,
				results: [
					buildResource(1, { category: "guides" }),
					buildResource(6, { category: "academic" })
				]
			}), {
				status: 200,
				headers: { "content-type": "application/json" }
			});
		});

		const result = await loadResourceCollections({ fetch: fetchMock });
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data.guides[0]?.id).toBe(1);
			expect(result.data.academic[0]?.category).toBe("academic");
			expect(result.data.academic[0]?.thumbnail).toBe("https://api.example.test/media/resources/thumb.jpg");
		}
	});

	it("loads resource detail data and related resources", async () => {
		const fetchMock = vi.fn(async (url) => {
			const href = String(url);
			if (href.endsWith("/resources/42")) {
				return new Response(JSON.stringify({
					...buildResource(42, { category: "tips", type: "page" }),
					content: null,
					page_content: "<p>Helpful content</p>"
				}), {
					status: 200,
					headers: { "content-type": "application/json" }
				});
			}

			if (href.includes("resources/list") && href.includes("category=tips")) {
				return new Response(JSON.stringify({
					count: 2,
					next: null,
					previous: null,
					results: [
						buildResource(42, { category: "tips", type: "page" }),
						buildResource(43, { category: "tips", type: "link" })
					]
				}), {
					status: 200,
					headers: { "content-type": "application/json" }
				});
			}

			throw new Error(`Unexpected URL: ${href}`);
		});

		const result = await loadResourceDetailPage(42, { fetch: fetchMock });
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data.resource.id).toBe(42);
			expect(result.data.resource.pageContent).toContain("Helpful content");
			expect(result.data.relatedResources).toHaveLength(1);
			expect(result.data.relatedResources[0]?.id).toBe(43);
		}
	});
});
