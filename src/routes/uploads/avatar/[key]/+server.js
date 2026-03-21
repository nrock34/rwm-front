import { error } from "@sveltejs/kit";

/**
 * @param {import("./$types").RequestEvent} event
 */
export async function GET({ params, platform }) {
	const platformState = /** @type {{ env?: { PFP_BUCKET?: { get?: (key: string) => Promise<unknown> } } } | null | undefined} */ (platform);
	const bucket = platformState?.env?.PFP_BUCKET;

	if (!bucket || typeof bucket.get !== "function") {
		throw error(500, "Avatar storage is unavailable.");
	}

	const object = /** @type {null | { body?: ReadableStream | null; httpMetadata?: { contentType?: string; cacheControl?: string; contentDisposition?: string; contentEncoding?: string; contentLanguage?: string; contentTypeCharset?: string } }} */ (await bucket.get(params.key));

	if (!object || !object.body) {
		throw error(404, "Avatar not found.");
	}

	const headers = new Headers();
	if (object.httpMetadata?.contentType) {
		headers.set("content-type", object.httpMetadata.contentType);
	}
	if (object.httpMetadata?.cacheControl) {
		headers.set("cache-control", object.httpMetadata.cacheControl);
	}
	if (object.httpMetadata?.contentDisposition) {
		headers.set("content-disposition", object.httpMetadata.contentDisposition);
	}
	if (object.httpMetadata?.contentEncoding) {
		headers.set("content-encoding", object.httpMetadata.contentEncoding);
	}
	if (object.httpMetadata?.contentLanguage) {
		headers.set("content-language", object.httpMetadata.contentLanguage);
	}
	if (object.httpMetadata?.contentTypeCharset && !headers.has("content-type")) {
		headers.set("content-type", `application/octet-stream; charset=${object.httpMetadata.contentTypeCharset}`);
	}

	return new Response(object.body, {
		headers
	});
}
