import { getApiUrl, resolveApiUrl } from "../../core/env/server.js";

/** @typedef {Record<string, unknown>} SiteConfig */

/** @type {SiteConfig | null} */
let cachedConfig = null;

export function newConfig() {
	/** @type {SiteConfig | null} */
	let config = cachedConfig;

	async function loadConfig() {
		if (cachedConfig) return;
		const apiUrl = getApiUrl();

		const endpoint = resolveApiUrl("site-properties", apiUrl);
		const res = await fetch(endpoint, {
			headers: { Accept: "application/json" }
		});

		if (!res.ok) {
			const body = await res.text();
			throw new Error(`Failed config fetch (${res.status}) from ${endpoint}: ${body.slice(0, 200)}`);
		}

		const contentType = res.headers.get("content-type") ?? "";
		if (!contentType.includes("application/json")) {
			const body = await res.text();
			throw new Error(`Expected JSON from ${endpoint}, got "${contentType}". Body starts with: ${body.slice(0, 200)}`);
		}

		cachedConfig = /** @type {SiteConfig} */ (await res.json());
		config = cachedConfig;
	}

	return {
		get config() {
			return cachedConfig ?? config;
		},
		loadConfig
	};
}
