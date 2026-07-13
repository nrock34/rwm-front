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
		if (!['http:', 'https:'].includes(url.protocol)) return null;
		const hostname = url.hostname.toLowerCase();
		/** @param {unknown} id @returns {id is string} */
		const isSafeId = (id) => typeof id === "string" && /^[a-zA-Z0-9_-]{6,64}$/u.test(id);
		if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(hostname)) {
			const pathParts = url.pathname.split("/").filter(Boolean);
			const videoId = pathParts[0] === "embed" ? pathParts[1] : url.searchParams.get("v");
			return isSafeId(videoId) ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
		}
		if (hostname === "youtu.be") {
			const videoId = url.pathname.split("/").filter(Boolean)[0];
			return isSafeId(videoId) ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
		}
		if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(hostname)) {
			const pathParts = url.pathname.split("/").filter(Boolean);
			const videoId = pathParts[0] === "video" ? pathParts[1] : pathParts[0];
			return typeof videoId === "string" && /^\d{5,16}$/u.test(videoId)
				? `https://player.vimeo.com/video/${videoId}`
				: null;
		}
		return null;
	} catch {
		return null;
	}
}

/**
 * @param {string | null | undefined} value
 * @returns {boolean}
 */
export function isEmbeddableVideoUrl(value) {
	return getVideoEmbedUrl(value) !== null;
}
