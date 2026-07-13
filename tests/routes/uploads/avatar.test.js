import { describe, expect, it, vi } from "vitest";
import { GET } from "../../../src/routes/uploads/avatar/[key]/+server.js";

const VALID_KEY = "avatar-123e4567-e89b-42d3-a456-426614174000.png";

describe("avatar delivery route", () => {
	it("rejects keys outside the generated avatar namespace before reading storage", async () => {
		const get = vi.fn();
		await expect(GET({
			params: { key: "../../private.txt" },
			platform: { env: { PFP_BUCKET: { get } } }
		})).rejects.toMatchObject({ status: 404 });
		expect(get).not.toHaveBeenCalled();
	});

	it("serves allow-listed images with immutable and no-sniff headers", async () => {
		const get = vi.fn(async () => ({
			body: new Blob([Uint8Array.from([0x89, 0x50, 0x4e, 0x47])]).stream(),
			httpEtag: '"etag-value"',
			httpMetadata: {
				contentType: "image/png",
				cacheControl: "public, max-age=31536000, immutable"
			}
		}));

		const response = await GET({
			params: { key: VALID_KEY },
			platform: { env: { PFP_BUCKET: { get } } }
		});

		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toBe("image/png");
		expect(response.headers.get("cache-control")).toBe("public, max-age=31536000, immutable");
		expect(response.headers.get("x-content-type-options")).toBe("nosniff");
		expect(response.headers.get("etag")).toBe('"etag-value"');
		expect(get).toHaveBeenCalledWith(VALID_KEY);
	});

	it("does not serve an object with unexpected content metadata", async () => {
		const get = vi.fn(async () => ({
			body: new Blob(["<svg></svg>"]).stream(),
			httpMetadata: { contentType: "image/svg+xml" }
		}));

		await expect(GET({
			params: { key: VALID_KEY },
			platform: { env: { PFP_BUCKET: { get } } }
		})).rejects.toMatchObject({ status: 404 });
	});
});
