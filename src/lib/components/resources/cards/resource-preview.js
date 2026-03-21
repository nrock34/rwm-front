/**
 * @param {string} type
 * @returns {boolean}
 */
export function supportsResourcePreview(type) {
	return ["pdf", "video", "page"].includes(type);
}

/**
 * @param {string} type
 * @returns {boolean}
 */
export function usesDirectContentAction(type) {
	return ["pdf", "video", "link", "interactive"].includes(type);
}

/**
 * @param {number} resourceId
 * @returns {Promise<{ resource: import("../../../../src/domains/resources/types.js").ResourceDetail }>}
 */
export async function fetchResourcePreviewData(resourceId) {
	const response = await fetch(`/resources/${resourceId}/preview-data`);
	if (!response.ok) {
		throw new Error(`Failed to load resource preview (${response.status})`);
	}

	return await response.json();
}

/**
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
export function getVideoEmbedUrl(value) {
	if (!value || typeof value !== "string") return null;

	try {
		const url = new URL(value);
		if (url.hostname.includes("youtube.com")) {
			const videoId = url.searchParams.get("v");
			return videoId ? `https://www.youtube.com/embed/${videoId}` : value;
		}
		if (url.hostname.includes("youtu.be")) {
			const videoId = url.pathname.replace(/^\//, "");
			return videoId ? `https://www.youtube.com/embed/${videoId}` : value;
		}
		if (url.hostname.includes("vimeo.com")) {
			const videoId = url.pathname.replace(/^\//, "");
			return videoId ? `https://player.vimeo.com/video/${videoId}` : value;
		}
		return value;
	} catch {
		return value;
	}
}

/**
 * @param {string | null | undefined} value
 * @returns {boolean}
 */
export function isEmbeddableVideoUrl(value) {
	if (!value || typeof value !== "string") return false;
	return /youtube\.com|youtu\.be|vimeo\.com/i.test(value);
}
