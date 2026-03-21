export const POST_TOPIC_OPTIONS = Object.freeze([
	{ id: "opp", label: "Opportunities" },
	{ id: "social", label: "Social" },
	{ id: "academic", label: "Academic" },
	{ id: "housing", label: "Housing" },
	{ id: "events", label: "Events" }
]);

export const POST_TOPIC_FILTER_OPTIONS = Object.freeze([
	{ id: "all", label: "All topics" },
	...POST_TOPIC_OPTIONS
]);

export const POST_TYPE_OPTIONS = Object.freeze([
	{ id: "discussion", label: "Discussion" },
	{ id: "announcement", label: "Announcement" },
	{ id: "photo", label: "Photo" },
	{ id: "question", label: "Question" }
]);

export const POST_TYPE_FILTER_OPTIONS = Object.freeze([
	{ id: "all", label: "All types" },
	...POST_TYPE_OPTIONS
]);

export const POST_SORT_OPTIONS = Object.freeze([
	{ id: "-created_at", label: "Latest first" },
	{ id: "created_at", label: "Oldest first" },
	{ id: "-views", label: "Most viewed" }
]);

export const COMMENT_SORT_OPTIONS = Object.freeze([
	{ id: "-created_at", label: "Newest first" },
	{ id: "created_at", label: "Oldest first" }
]);

/**
 * @param {ReadonlyArray<{ id: string; label: string }>} options
 * @param {string | null | undefined} value
 * @param {string} [fallback]
 */
export function getPostOptionLabel(options, value, fallback = "") {
	return options.find((option) => option.id === value)?.label ?? fallback ?? options[0]?.label ?? "";
}
