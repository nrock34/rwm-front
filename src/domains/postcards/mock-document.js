import { POSTCARD_EDITOR_FORMAT, POSTCARD_EDITOR_VERSION } from "./contracts.js";

/**
 * @param {{ title?: string | null; location?: { city?: string | null; country?: string | null } | null }} [postcard]
 * @returns {import("./types.js").PostcardEditorDocument}
 */
export function buildMockPostcardEditorDocument(postcard = {}) {
	const locationBits = [
		postcard.location?.city?.trim(),
		postcard.location?.country?.trim()
	].filter(Boolean);
	const locationLabel = locationBits.length > 0 ? locationBits.join(", ") : "a place that still felt brand new by sunrise";
	const storyTitle = postcard.title?.trim() || "A postcard worth lingering on";

	return {
		format: POSTCARD_EDITOR_FORMAT,
		version: POSTCARD_EDITOR_VERSION,
		blocks: [
			{
				id: "intro-1",
				type: "paragraph",
				data: {
					text: `${storyTitle} works best when the page slows down and lets people move through it in scenes instead of one long wall of text. The morning in ${locationLabel} began with shutters opening, scooters echoing off stone, and the kind of light that makes every corner feel like it has been waiting to be photographed.`
				}
			},
			{
				id: "layout-note-quote-header-1",
				type: "header",
				data: {
					text: "Field Notes and One Borrowed Line",
					fontSize: "md"
				}
			},
			{
				id: "layout-note-quote-subtext-1",
				type: "subtext",
				data: {
					text: "A section intro should be a real content block that can sit before a layout row, move around, or be reused elsewhere in the article.",
					fontSize: "sm"
				}
			},
			{
				id: "layout-note-quote-1",
				type: "layout",
				data: {
					columns: [
						{
							width: "1fr",
							blocks: [
								{
									id: "aside-1",
									type: "smallText",
									data: {
										text: "This small-text block is useful for side observations, translator notes, sourcing context, or practical travel advice that should feel lighter than the main body copy."
									}
								}
							]
						},
						{
							width: "1fr",
							blocks: [
								{
									id: "quote-1",
									type: "quote",
									data: {
										text: "A good postcard makes you feel like you borrowed someone else's afternoon for a minute.",
										attribution: "Field notes from the RWM editorial mock"
									}
								}
							]
						}
					]
				}
			},
			{
				id: "image-1",
				type: "image",
				data: {
					src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
					alt: "Warm sunrise over a narrow city street",
					caption: "Hero image block with an editorial-style caption. This is the kind of visual break that makes a long article easier to stay with."
				}
			},
			{
				id: "layout-embed-row-header-1",
				type: "header",
				data: {
					text: "Soundtrack and Street Context",
					fontSize: "sm"
				}
			},
			{
				id: "layout-embed-row-subtext-1",
				type: "subtext",
				data: {
					text: "Headers and supporting subtext can now live as their own text blocks before a media-heavy layout row.",
					fontSize: "sm"
				}
			},
			{
				id: "layout-embed-row-1",
				type: "layout",
				data: {
					columns: [
						{
							width: "1fr",
							blocks: [
								{
									id: "embed-spotify-1",
									type: "embed",
									data: {
										kind: "spotify",
										url: "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P",
										caption: "Song embed example: a soundtrack block can deepen the mood without forcing it into the article copy itself."
									}
								}
							]
						},
						{
							width: "1fr",
							blocks: [
								{
									id: "embed-map-1",
									type: "embed",
									data: {
										kind: "map",
										url: "https://www.openstreetmap.org/export/embed.html?bbox=12.455%2C41.882%2C12.492%2C41.903&layer=mapnik&marker=41.892%2C12.474",
										caption: "Map embed example: useful for grounding a postcard in a walkable neighborhood, study-abroad district, or scholarship destination."
									}
								}
							]
						}
					]
				}
			},
			{
				id: "slideshow-1",
				type: "slideshow",
				data: {
					slides: [
						{
							src: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=80",
							alt: "Cafe table by a window",
							caption: "Slide one: a slower interior moment that contrasts with the busier street photography."
						},
						{
							src: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1400&q=80",
							alt: "People walking through a historic street",
							caption: "Slide two: crowd movement, architecture, and scale in one frame."
						},
						{
							src: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1400&q=80",
							alt: "Night lights along a river",
							caption: "Slide three: a captioned ending image that shifts the postcard from daylight into evening."
						}
					]
				}
			},
			{
				id: "poll-1",
				type: "poll",
				data: {
					question: "Which section format would make this postcard more fun to explore?",
					options: [
						{ id: "image-caption", label: "Image with caption breaks" },
						{ id: "music", label: "Song or ambient audio embeds" },
						{ id: "map", label: "Map moments with neighborhood context" },
						{ id: "slideshow", label: "Captioned mini slideshows" }
					]
				}
			},
			{
				id: "closing-1",
				type: "paragraph",
				data: {
					text: "This mock payload is intentionally editorial instead of generic. It gives the backend a realistic reference for how paragraphs, notes, images, layout rows, embeds, and interactive placeholders can live together in one postcard/article document."
				}
			}
		]
	};
}
