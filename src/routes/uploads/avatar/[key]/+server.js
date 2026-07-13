import { error } from "@sveltejs/kit";

const AVATAR_KEY_PATTERN = /^avatar-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:jpg|png)$/iu;
const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png"]);

/**
 * @param {import("./$types").RequestEvent} event
 */
export async function GET({ params, platform }) {
	if (!AVATAR_KEY_PATTERN.test(params.key)) {
		throw error(404, "Avatar not found.");
	}

	const platformState = /** @type {{ env?: { PFP_BUCKET?: { get?: (key: string) => Promise<unknown> } } } | null | undefined} */ (platform);
	const bucket = platformState?.env?.PFP_BUCKET;

	if (!bucket || typeof bucket.get !== "function") {
		throw error(500, "Avatar storage is unavailable.");
	}

	const object = /** @type {null | { body?: ReadableStream | null; httpEtag?: string; httpMetadata?: { contentType?: string; cacheControl?: string; contentDisposition?: string } }} */ (await bucket.get(params.key));

	if (!object || !object.body) {
		throw error(404, "Avatar not found.");
	}

	const contentType = object.httpMetadata?.contentType ?? "";
	if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
		throw error(404, "Avatar not found.");
	}

	const headers = new Headers();
	headers.set("content-type", contentType);
	headers.set(
		"cache-control",
		object.httpMetadata?.cacheControl ?? "public, max-age=31536000, immutable"
	);
	headers.set("content-disposition", object.httpMetadata?.contentDisposition ?? "inline");
	headers.set("x-content-type-options", "nosniff");
	headers.set("cross-origin-resource-policy", "same-site");
	headers.set("content-security-policy", "default-src 'none'; sandbox");
	if (object.httpEtag) headers.set("etag", object.httpEtag);

	return new Response(object.body, {
		headers
	});
}
