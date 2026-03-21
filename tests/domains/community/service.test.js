import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createCommunityPost,
	loadCommunityPostsPage,
	loadCommunityUpdateDetail
} from "../../../src/domains/community/service.js";

function buildPostPayload() {
	return {
		id: 1,
		type: "discussion",
		category: { id: 1, name: "social" },
		title: "Test post",
		author: {
			id: 4,
			name: "Test Author",
			avatar: "https://cdn.example.test/avatar.jpg",
			associated_user: 10
		},
		content: "Hello world",
		media: null,
		created_at: "2030-01-01T00:00:00Z",
		updated_at: "2030-01-01T00:00:00Z",
		published: true,
		views: 12,
		tags: [{ id: 1, name: "rome" }],
		like_count: 2,
		comment_count: 1,
		liked_by_viewer: false
	};
}

describe("community service", () => {
	beforeEach(() => {
		process.env.API_URL = "https://api.example.test/";
	});

	it("maps cursor-paginated post responses and forwards auth headers", async () => {
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({
			next: "https://api.example.test/posts/list?cursor=next-cursor",
			previous: null,
			results: [buildPostPayload()]
		}), {
			status: 200,
			headers: { "content-type": "application/json" }
		}));

		const result = await loadCommunityPostsPage({ q: "rome" }, {
			fetch: fetchMock,
			accessToken: "access-token"
		});

		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data.results).toHaveLength(1);
			expect(result.data.nextCursor).toBe("next-cursor");
		}
		/** @type {unknown[] | undefined} */
		const firstCall = fetchMock.mock.calls[0];
		const requestInit = /** @type {RequestInit | undefined} */ (firstCall?.[1]);
		const headers = new Headers(requestInit?.headers);
		expect(headers.get("Authorization")).toBe("Bearer access-token");
	});

	it("maps an unknown tag filter to not_found", async () => {
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({
			tag: ["Select a valid choice. That choice is not one of the available choices."]
		}), {
			status: 400,
			headers: { "content-type": "application/json" }
		}));

		const result = await loadCommunityPostsPage({ tag: "missing-tag" }, {
			fetch: fetchMock,
			accessToken: null
		});

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.code).toBe("not_found");
			expect(result.error.status).toBe(404);
			expect(result.error.message).toContain("missing-tag");
		}
	});

	it("requires auth before creating a post", async () => {
		const result = await createCommunityPost({
			title: "Hello",
			content: "World",
			type: "discussion",
			category: "social",
			tags: ["rome"],
			published: true
		}, {
			fetch: vi.fn(),
			accessToken: null
		});

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.code).toBe("unauthorized");
		}
	});

	it("requires auth before loading update detail", async () => {
		const result = await loadCommunityUpdateDetail(42, {
			fetch: vi.fn(),
			accessToken: null
		});

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.code).toBe("unauthorized");
		}
	});
});
