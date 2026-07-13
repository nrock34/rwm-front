const ALLOWED_TAGS = new Set([
	"a", "b", "blockquote", "br", "code", "del", "em", "figcaption", "figure", "h2", "h3", "h4",
	"hr", "i", "img", "li", "ol", "p", "pre", "s", "strong", "sub", "sup", "table", "tbody",
	"td", "th", "thead", "tr", "u", "ul"
]);

const VOID_TAGS = new Set(["br", "hr", "img"]);
const DANGEROUS_CONTAINERS = /<\s*(script|style|iframe|object|embed|svg|math|template|form)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/giu;
const DANGEROUS_TAGS = /<\/?\s*(?:script|style|iframe|object|embed|svg|math|template|form)\b[^>]*>/giu;
const HTML_TOKEN = /<!--[\s\S]*?-->|<![^>]*>|<\/?[A-Za-z][^>]*>/gu;
const ATTRIBUTE = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gu;
/** @type {Readonly<Record<string, string>>} */
const URL_ENTITY_REPLACEMENTS = Object.freeze({ colon: ":", tab: "\t", newline: "\n" });

/**
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

/**
 * Decode entity forms that browsers normalize before checking a URL protocol.
 *
 * @param {string} value
 * @returns {string}
 */
function decodeUrlEntities(value) {
	return value
		.replace(/&#x([0-9a-f]+);?/giu, (_, code) => decodeCodePoint(code, 16))
		.replace(/&#([0-9]+);?/gu, (_, code) => decodeCodePoint(code, 10))
		.replace(/&(colon|tab|newline);?/giu, (_, name) => URL_ENTITY_REPLACEMENTS[name.toLowerCase()] ?? "")
		.replace(/&amp;/giu, "&");
}

/**
 * @param {string} value
 * @param {number} radix
 * @returns {string}
 */
function decodeCodePoint(value, radix) {
	const codePoint = Number.parseInt(value, radix);
	return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
		? String.fromCodePoint(codePoint)
		: "";
}

/**
 * @param {string} value
 * @param {{ type: "href" | "src"; baseUrl?: string }} options
 * @returns {string | null}
 */
export function sanitizeUrl(value, options) {
	const decoded = decodeUrlEntities(value).trim();
	if (!decoded || decoded.startsWith("//")) return null;

	const protocolProbe = decoded.replace(/[\u0000-\u0020\u007f]+/gu, "").toLowerCase();
	if (
		protocolProbe.startsWith("javascript:")
		|| protocolProbe.startsWith("vbscript:")
		|| protocolProbe.startsWith("data:")
		|| protocolProbe.startsWith("file:")
	) return null;

	if (options.type === "href" && /^(?:mailto|tel):/iu.test(decoded)) return decoded;
	if (/^https?:/iu.test(decoded)) {
		try {
			const url = new URL(decoded);
			return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
		} catch {
			return null;
		}
	}

	if (/^[a-z][a-z\d+.-]*:/iu.test(protocolProbe)) return null;
	if (options.type === "src" && options.baseUrl) {
		try {
			return new URL(decoded, options.baseUrl).toString();
		} catch {
			return null;
		}
	}
	return decoded;
}

/**
 * @param {string} rawAttributes
 * @param {string} tag
 * @param {string | undefined} baseUrl
 * @returns {string}
 */
function sanitizeAttributes(rawAttributes, tag, baseUrl) {
	/** @type {Record<string, string>} */
	const attributes = {};
	for (const match of rawAttributes.matchAll(ATTRIBUTE)) {
		const name = (match[1] ?? "").toLowerCase();
		const value = match[2] ?? match[3] ?? match[4] ?? "";
		if (name.startsWith("on") || name === "style" || name === "srcset") continue;

		if (tag === "a" && name === "href") {
			const href = sanitizeUrl(value, { type: "href" });
			if (href) attributes.href = href;
		} else if (tag === "a" && name === "title") {
			attributes.title = value;
		} else if (tag === "a" && name === "target" && ["_blank", "_self"].includes(value)) {
			attributes.target = value;
		} else if (tag === "img" && name === "src") {
			const src = sanitizeUrl(value, { type: "src", baseUrl });
			if (src) attributes.src = src;
		} else if (tag === "img" && ["alt", "title"].includes(name)) {
			attributes[name] = value;
		} else if (tag === "img" && ["width", "height"].includes(name) && /^\d{1,4}$/u.test(value)) {
			attributes[name] = value;
		} else if (["td", "th"].includes(tag) && ["colspan", "rowspan"].includes(name) && /^\d{1,2}$/u.test(value)) {
			attributes[name] = value;
		} else if (tag === "th" && name === "scope" && ["row", "col", "rowgroup", "colgroup"].includes(value)) {
			attributes.scope = value;
		}
	}

	if (tag === "a" && attributes.target === "_blank") attributes.rel = "noopener noreferrer";
	if (tag === "img") {
		attributes.loading = "lazy";
		attributes.decoding = "async";
		if (!attributes.alt) attributes.alt = "";
	}

	return Object.entries(attributes)
		.map(([name, value]) => ` ${name}="${escapeHtml(value)}"`)
		.join("");
}

/**
 * Sanitize CKEditor-era HTML into a small, deterministic allowlist. All event
 * handlers, inline styles, active content, unsafe protocols, and unknown tags
 * are removed before the result reaches Svelte's HTML renderer.
 *
 * @param {unknown} value
 * @param {{ baseUrl?: string }} [options]
 * @returns {string}
 */
export function sanitizeLegacyHtml(value, options = {}) {
	if (typeof value !== "string" || !value.trim()) return "";

	let source = value.replaceAll("\u0000", "");
	let previous = "";
	do {
		previous = source;
		source = source.replace(DANGEROUS_CONTAINERS, "");
	} while (source !== previous);
	source = source.replace(DANGEROUS_TAGS, "");

	let result = "";
	let cursor = 0;
	for (const match of source.matchAll(HTML_TOKEN)) {
		const index = match.index ?? cursor;
		result += source.slice(cursor, index).replaceAll("<", "&lt;").replaceAll(">", "&gt;");
		const token = match[0];
		cursor = index + token.length;
		if (token.startsWith("<!--") || token.startsWith("<!")) continue;

		const parsed = /^<\s*(\/?)\s*([a-z\d]+)([\s\S]*?)\/?\s*>$/iu.exec(token);
		if (!parsed) continue;
		const closing = Boolean(parsed[1]);
		const tag = (parsed[2] ?? "").toLowerCase();
		if (!ALLOWED_TAGS.has(tag)) continue;
		if (closing) {
			if (!VOID_TAGS.has(tag)) result += `</${tag}>`;
			continue;
		}

		const attributes = sanitizeAttributes(parsed[3] ?? "", tag, options.baseUrl);
		if (tag === "img" && !attributes.includes(" src=")) continue;
		result += `<${tag}${attributes}>`;
	}
	result += source.slice(cursor).replaceAll("<", "&lt;").replaceAll(">", "&gt;");
	return result.trim();
}
