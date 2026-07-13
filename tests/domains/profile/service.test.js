import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	AVATAR_MAX_BYTES,
	loadPublicProfile,
	updateProfileEducationSettings,
	updateProfileInfo,
	validateAvatarUpload
} from "../../../src/domains/profile/service.js";

/**
 * @param {number[]} bytes
 * @param {string} type
 * @param {number} [reportedSize]
 */
function fileLike(bytes, type, reportedSize = bytes.length) {
	return {
		name: "avatar.upload",
		size: reportedSize,
		type,
		arrayBuffer: async () => Uint8Array.from(bytes).buffer
	};
}

describe("profile service", () => {
	beforeEach(() => {
		process.env.API_URL = "https://api.example.test/v1/";
	});

	it("accepts valid JPEG signatures and rejects spoofed image MIME types", async () => {
		const valid = await validateAvatarUpload(fileLike([0xff, 0xd8, 0xff, 0x00], "image/jpeg"));
		expect(valid?.contentType).toBe("image/jpeg");
		expect(valid?.extension).toBe("jpg");

		await expect(validateAvatarUpload(fileLike([0x3c, 0x68, 0x74, 0x6d, 0x6c], "image/png")))
			.rejects.toMatchObject({ code: "invalid_upload", status: 400 });
	});

	it("rejects oversized avatars before reading their contents", async () => {
		const arrayBuffer = vi.fn(async () => new ArrayBuffer(1));
		await expect(validateAvatarUpload({
			name: "large.png",
			size: AVATAR_MAX_BYTES + 1,
			type: "image/png",
			arrayBuffer
		})).rejects.toMatchObject({ code: "invalid_upload" });
		expect(arrayBuffer).not.toHaveBeenCalled();
	});

	it("deletes a newly uploaded avatar when the profile API rejects the update", async () => {
		const put = vi.fn(async () => undefined);
		const remove = vi.fn(async () => undefined);
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({ detail: "invalid profile" }), {
			status: 400,
			headers: { "content-type": "application/json" }
		}));

		const result = await updateProfileInfo({
			first_name: "Ada",
			last_name: "Lovelace",
			username: "ada",
			bio: "Mathematician",
			birthday: "1815-12-10",
			avatar: fileLike([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], "image/png")
		}, {
			fetch: fetchMock,
			accessToken: "viewer-token",
			origin: "https://app.example.test",
			platform: { env: { PFP_BUCKET: { put, delete: remove } } }
		});

		expect(result.ok).toBe(false);
		expect(put).toHaveBeenCalledOnce();
		expect(remove).toHaveBeenCalledOnce();
		const key = String(put.mock.calls[0]?.[0]);
		expect(key).toMatch(/^avatar-[0-9a-f-]+\.png$/u);
		expect(remove).toHaveBeenCalledWith(key);
		const metadata = put.mock.calls[0]?.[2]?.httpMetadata;
		expect(metadata).toMatchObject({
			contentType: "image/png",
			cacheControl: "public, max-age=31536000, immutable"
		});
	});

	it("retains an uploaded avatar when the profile write outcome is ambiguous", async () => {
		const put = vi.fn(async () => undefined);
		const remove = vi.fn(async () => undefined);
		const fetchMock = vi.fn(async () => {
			throw new Error("connection reset after request");
		});

		const result = await updateProfileInfo({
			first_name: "Ada",
			last_name: "Lovelace",
			username: "ada",
			bio: "Mathematician",
			birthday: "1815-12-10",
			avatar: fileLike([0xff, 0xd8, 0xff, 0x00], "image/jpeg")
		}, {
			fetch: fetchMock,
			accessToken: "viewer-token",
			origin: "https://app.example.test",
			platform: { env: { PFP_BUCKET: { put, delete: remove } } }
		});

		expect(result.ok).toBe(false);
		expect(put).toHaveBeenCalledOnce();
		expect(remove).not.toHaveBeenCalled();
	});

	it("persists education settings through the profile settings API", async () => {
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({
			university: "12",
			major: "History",
			grad_year: "2029"
		}), {
			status: 200,
			headers: { "content-type": "application/json" }
		}));

		const result = await updateProfileEducationSettings({
			university: "12",
			major: "History",
			grad_year: 2029
		}, {
			fetch: fetchMock,
			accessToken: "viewer-token"
		});

		expect(result.ok).toBe(true);
		if (result.ok) expect(result.data.grad_year).toBe(2029);
		const call = fetchMock.mock.calls[0];
		expect(String(call?.[0])).toBe("https://api.example.test/v1/users/me/education");
		expect(JSON.parse(String(call?.[1]?.body))).toEqual({
			university: 12,
			major: "History",
			year: 2029
		});
	});

	it("loads public profile data with viewer auth and no shared credential", async () => {
		const fetchMock = vi.fn(async (url, init) => {
			const requestUrl = String(url);
			if (requestUrl.endsWith("/users/7/profile")) {
				expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer viewer-token");
				return new Response(JSON.stringify({
					name: "Ada Lovelace",
					username: "ada",
					register_date: "2029-01-01T00:00:00Z",
					profile: { bio: "Mathematician", avatar: null, is_contributer: true },
					badges: [],
					post_count: 1,
					like_count: 3
				}), { status: 200, headers: { "content-type": "application/json" } });
			}
			if (requestUrl.endsWith("/authors/7/posts")) {
				expect(new Headers(init?.headers).has("Authorization")).toBe(false);
				return new Response(JSON.stringify({ posts: [91] }), {
					status: 200,
					headers: { "content-type": "application/json" }
				});
			}
			return new Response(JSON.stringify({
				title: "Hello",
				content: "World",
				updated_at: "2029-01-02T00:00:00Z",
				media: null
			}), { status: 200, headers: { "content-type": "application/json" } });
		});

		const result = await loadPublicProfile({
			fetch: fetchMock,
			accessToken: "viewer-token",
			profileUserId: "7"
		});

		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data.name).toBe("Ada Lovelace");
			expect(result.data.badge).toBeNull();
			expect(result.data.recentPosts).toEqual([{
				id: 91,
				data: {
					title: "Hello",
					content: "World",
					updated_at: "2029-01-02T00:00:00Z"
				},
				image: null
			}]);
		}
	});

	it("uses intentionally public author data for anonymous profile viewers", async () => {
		const requestedUrls = [];
		const fetchMock = vi.fn(async (url, init) => {
			const requestUrl = String(url);
			requestedUrls.push(requestUrl);
			expect(new Headers(init?.headers).has("Authorization")).toBe(false);

			if (requestUrl.endsWith("/authors/7/posts")) {
				return new Response(JSON.stringify({ posts: [] }), {
					status: 200,
					headers: { "content-type": "application/json" }
				});
			}
			if (requestUrl.endsWith("/authors/7")) {
				return new Response(JSON.stringify({ detail: "legacy lookup failure" }), {
					status: 500,
					headers: { "content-type": "application/json" }
				});
			}
			return new Response(JSON.stringify([{
				associated_user: 7,
				name: "Ada Lovelace",
				avatar: "https://cdn.example.test/ada.jpg"
			}]), {
				status: 200,
				headers: { "content-type": "application/json" }
			});
		});

		const result = await loadPublicProfile({
			fetch: fetchMock,
			accessToken: null,
			profileUserId: 7
		});

		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data.name).toBe("Ada Lovelace");
			expect(result.data.avatar).toBe("https://cdn.example.test/ada.jpg");
			expect(result.data.stats).toEqual({ posts: null, likes: null });
		}
		expect(requestedUrls.some((url) => url.includes("/users/7/profile"))).toBe(false);
	});
});
