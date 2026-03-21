import { getDaysUntil, getTimeAgo } from "../../lib/helper-funcs/funcs.js";
import { toFiniteNumber, toTitleCase } from "../../core/domain/coerce.js";

/** @type {Readonly<Record<string, string>>} */
const POST_CATEGORY_LABELS = Object.freeze({
	opp: "Opportunities",
	social: "Social",
	academic: "Academic",
	housing: "Housing",
	events: "Events"
});

/** @type {Readonly<Record<string, string>>} */
const POST_TYPE_LABELS = Object.freeze({
	discussion: "Discussion",
	announcement: "Announcement",
	photo: "Photo",
	question: "Question"
});

/** @type {Readonly<Record<string, string>>} */
const PROGRAM_DURATION_LABELS = Object.freeze({
	sem: "Semester",
	yr: "Year",
	sum: "Summer",
	brk: "Break",
	twowks: "1-2 Weeks",
	sxwks: "4-6 Weeks"
});

/**
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
export function extractCursorValue(value) {
	if (!value) return null;
	try {
		const parsed = new URL(value);
		return parsed.searchParams.get("cursor");
	} catch {
		return null;
	}
}

/**
 * @template TIn
 * @template TOut
 * @param {{ results: TIn[]; next: string | null; previous: string | null }} page
 * @param {(item: TIn) => TOut} mapItem
 * @returns {import("./types.js").CommunityCursorPage<TOut>}
 */
export function mapCursorPage(page, mapItem) {
	return {
		results: page.results.map(mapItem),
		nextCursor: extractCursorValue(page.next),
		previousCursor: extractCursorValue(page.previous),
		nextUrl: page.next,
		previousUrl: page.previous
	};
}

/**
 * @param {Record<string, unknown>} author
 * @returns {import("./types.js").CommunityAuthor}
 */
function mapAuthor(author) {
	return {
		id: typeof author.id === "number" ? author.id : 0,
		name: typeof author.name === "string" ? author.name : "Community Member",
		avatar: typeof author.avatar === "string" && author.avatar.length > 0 ? author.avatar : null,
		associatedUser: typeof author.associated_user === "number" ? author.associated_user : null
	};
}

/**
 * @param {Record<string, unknown> | null | undefined} category
 * @returns {{ id: string; label: string }}
 */
function mapCategory(category) {
	const id = category && typeof category.name === "string" ? category.name : "general";
	return {
		id,
		label: POST_CATEGORY_LABELS[id] ?? toTitleCase(id)
	};
}

/**
 * @param {Record<string, unknown>} post
 * @returns {import("./types.js").CommunityPostCard}
 */
export function mapCommunityPost(post) {
	const category = mapCategory(
		post.category && typeof post.category === "object"
			? /** @type {Record<string, unknown>} */ (post.category)
			: null
	);
	const type = typeof post.type === "string" ? post.type : "discussion";
	const tags = Array.isArray(post.tags)
		? post.tags
				.map((tag) => {
					if (typeof tag === "string") return tag;
					if (tag && typeof tag === "object" && typeof tag.name === "string") return tag.name;
					return "";
				})
				.filter(Boolean)
		: [];

	return {
		id: toFiniteNumber(post.id),
		title: typeof post.title === "string" ? post.title : "",
		content: typeof post.content === "string" ? post.content : "",
		image: typeof post.media === "string" && post.media.length > 0 ? post.media : null,
		type,
		typeLabel: POST_TYPE_LABELS[type] ?? toTitleCase(type),
		category: category.id,
		categoryLabel: category.label,
		author: mapAuthor(/** @type {Record<string, unknown>} */ (post.author)),
		createdAt: typeof post.created_at === "string" ? post.created_at : "",
		updatedAt: typeof post.updated_at === "string" ? post.updated_at : "",
		timestampLabel: typeof post.created_at === "string" ? getTimeAgo(post.created_at) : "",
		published: Boolean(post.published),
		views: toFiniteNumber(post.views),
		likes: toFiniteNumber(post.like_count),
		comments: toFiniteNumber(post.comment_count),
		tags,
		viewerLiked: Boolean(post.liked_by_viewer),
		href: `/community/posts/${toFiniteNumber(post.id)}`
	};
}

/**
 * @param {Record<string, unknown>} comment
 * @returns {import("./types.js").CommunityComment}
 */
export function mapCommunityComment(comment) {
	return {
		id: toFiniteNumber(comment.id),
		author: mapAuthor(/** @type {Record<string, unknown>} */ (comment.author)),
		content: typeof comment.content === "string" ? comment.content : "",
		createdAt: typeof comment.created_at === "string" ? comment.created_at : "",
		updatedAt: typeof comment.updated_at === "string" ? comment.updated_at : "",
		timestampLabel: typeof comment.created_at === "string" ? getTimeAgo(comment.created_at) : ""
	};
}

/**
 * @param {Record<string, unknown>} update
 * @returns {import("./types.js").CommunityUpdateCard}
 */
export function mapCommunityUpdate(update) {
	const rawCategory = update.category && typeof update.category === "object"
		? /** @type {Record<string, unknown>} */ (update.category)
		: null;
	const categoryId = rawCategory && typeof rawCategory.name === "string" ? rawCategory.name : "update";
	return {
		id: toFiniteNumber(update.id),
		title: typeof update.title === "string" ? update.title : "",
		category: categoryId,
		categoryLabel: rawCategory && typeof rawCategory.name === "string" ? toTitleCase(rawCategory.name) : "Update",
		image: typeof update.image === "string" && update.image.length > 0 ? update.image : null,
		urgent: Boolean(update.urgent),
		summary: typeof update.summary === "string" ? update.summary : "",
		expiresAt: typeof update.expires_at === "string" && update.expires_at.length > 0 ? update.expires_at : null,
		updatedAt: typeof update.updated_at === "string" ? update.updated_at : "",
		createdAt: typeof update.created_at === "string" ? update.created_at : "",
		views: toFiniteNumber(update.views),
		shares: toFiniteNumber(update.shares),
		comments: toFiniteNumber(update.comment_count),
		likes: toFiniteNumber(update.like_count),
		timeAgo: typeof update.updated_at === "string" ? getTimeAgo(update.updated_at) : "",
		href: `/community/news-and-updates/${toFiniteNumber(update.id)}`
	};
}

/**
 * @param {Record<string, unknown>} update
 * @returns {import("./types.js").CommunityUpdateDetail}
 */
export function mapCommunityUpdateDetail(update) {
	return {
		...mapCommunityUpdate(update),
		content: typeof update.content === "string" ? update.content : ""
	};
}

/**
 * @param {Record<string, unknown>} program
 * @returns {import("./types.js").CommunityProgramCard}
 */
export function mapCommunityProgram(program) {
	const provider = program.provider && typeof program.provider === "object"
		? /** @type {Record<string, unknown>} */ (program.provider)
		: null;
	const location = program.location && typeof program.location === "object"
		? /** @type {Record<string, unknown>} */ (program.location)
		: null;
	const cost = program.cost && typeof program.cost === "object"
		? /** @type {Record<string, unknown>} */ (program.cost)
		: null;
	const city = location && typeof location.city === "string" ? location.city : "";
	const country = location && typeof location.country === "string" ? location.country : "";
	const duration = typeof program.duration === "string" ? program.duration : "";

	return {
		id: toFiniteNumber(program.id),
		title: typeof program.title === "string" ? program.title : "",
		provider: provider && typeof provider.name === "string" ? provider.name : "Program Provider",
		location: [city, country].filter(Boolean).join(", "),
		country,
		region: mapCountryToRegion(country),
		duration: PROGRAM_DURATION_LABELS[duration] ?? toTitleCase(duration),
		cost: formatProgramCost(cost),
		rating: toFiniteNumber(program.rating),
		participants: toFiniteNumber(program.participants),
		description: typeof program.shortDescription === "string" ? program.shortDescription : "",
		highlights: Array.isArray(program.highlights)
			? program.highlights.filter((item) => typeof item === "string")
			: [],
		featured: Boolean(program.featured),
		deadline: typeof program.application_deadline === "string" && program.application_deadline.length > 0
			? program.application_deadline
			: null,
		href: `/programs/${toFiniteNumber(program.id)}`
	};
}

/**
 * @param {Record<string, unknown>} scholarship
 * @returns {import("./types.js").CommunityScholarshipCard}
 */
export function mapCommunityScholarship(scholarship) {
	const provider = scholarship.provider && typeof scholarship.provider === "object"
		? /** @type {Record<string, unknown>} */ (scholarship.provider)
		: null;
	const requirements = scholarship.requirements && typeof scholarship.requirements === "object"
		? /** @type {Record<string, unknown>} */ (scholarship.requirements)
		: null;
	const categories = Array.isArray(scholarship.categories)
		? scholarship.categories.filter((item) => typeof item === "string")
		: [];
	const field = requirements && typeof requirements.field === "string" ? requirements.field : "";
	const gradYear = requirements && typeof requirements.grad_year === "string" ? requirements.grad_year : "";
	const country = requirements && typeof requirements.study_country === "string" ? requirements.study_country : "";

	return {
		id: toFiniteNumber(scholarship.id),
		title: typeof scholarship.name === "string" ? scholarship.name : "",
		provider: provider && typeof provider.name === "string" ? provider.name : "Scholarship Provider",
		amount: formatScholarshipAmount(scholarship.lower_bound, scholarship.upper_bound),
		deadline: typeof scholarship.deadline === "string" && scholarship.deadline.length > 0 ? scholarship.deadline : null,
		categories,
		category: categories[0] ?? "all",
		location: country || "Worldwide",
		description: typeof scholarship.summary === "string" ? scholarship.summary : "",
		eligibilitySummary: requirements && typeof requirements.eligibility === "string" ? requirements.eligibility : "Eligibility details not provided.",
		qualifications: [field, mapGradYearLabel(gradYear), country].filter(Boolean),
		status: typeof scholarship.status === "string" ? scholarship.status : "upcoming",
		featured: Boolean(scholarship.featured),
		rating: toFiniteNumber(scholarship.rating),
		href: "/scholarships"
	};
}

/**
 * @param {import("./types.js").CommunityProgramCard[]} programs
 * @param {import("./types.js").CommunityScholarshipCard[]} scholarships
 * @returns {import("./types.js").CommunityDeadlineItem[]}
 */
export function deriveUpcomingDeadlines(programs, scholarships) {
	const deadlineItems = [
		...programs
			.filter((program) => Boolean(program.deadline))
			.map((program) => createDeadlineItem(program.title, program.deadline, program.href, "program")),
		...scholarships
			.filter((scholarship) => Boolean(scholarship.deadline))
			.map((scholarship) => createDeadlineItem(scholarship.title, scholarship.deadline, scholarship.href, "scholarship"))
	].filter((item) => item !== null);

	return deadlineItems
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.slice(0, 4);
}

/**
 * @param {string} name
 * @param {string | null} date
 * @param {string} href
 * @param {"program" | "scholarship"} type
 * @returns {import("./types.js").CommunityDeadlineItem | null}
 */
function createDeadlineItem(name, date, href, type) {
	if (!date) return null;
	return {
		name,
		date,
		displayDate: formatDate(date),
		href,
		type
	};
}

/**
 * @param {string} value
 * @returns {string}
 */
function formatDate(value) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}

/**
 * @param {Record<string, unknown> | null} cost
 * @returns {string}
 */
function formatProgramCost(cost) {
	const total =
		toFiniteNumber(cost?.program_fee) +
		toFiniteNumber(cost?.accommodation_fee) +
		toFiniteNumber(cost?.extra_fee);
	if (total <= 0) return "TBD";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	}).format(total);
}

/**
 * @param {unknown} lowerBound
 * @param {unknown} upperBound
 * @returns {string}
 */
function formatScholarshipAmount(lowerBound, upperBound) {
	const lower = toFiniteNumber(typeof lowerBound === "string" ? Number(lowerBound) : lowerBound);
	const upper = toFiniteNumber(typeof upperBound === "string" ? Number(upperBound) : upperBound);
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	});

	if (lower > 0 && upper > 0 && upper !== lower) {
		return `${formatter.format(lower)} - ${formatter.format(upper)}`;
	}
	if (upper > 0) return `Up to ${formatter.format(upper)}`;
	if (lower > 0) return formatter.format(lower);
	return "Funding varies";
}

/**
 * @param {string} value
 * @returns {string}
 */
function mapGradYearLabel(value) {
	/** @type {Record<string, string>} */
	const labels = {
		fr: "Freshman",
		sp: "Sophomore",
		jn: "Junior",
		sn: "Senior",
		gr: "Graduate",
		al: "Alumni"
	};
	return labels[value] ?? "";
}

/**
 * @param {string} country
 * @returns {string}
 */
function mapCountryToRegion(country) {
	const normalized = country.trim().toLowerCase();
	if (!normalized) return "other";
	if (["italy", "spain", "france", "germany", "united kingdom", "ireland", "portugal", "netherlands", "greece"].includes(normalized)) {
		return "europe";
	}
	if (["japan", "china", "south korea", "india", "singapore", "thailand", "vietnam"].includes(normalized)) {
		return "asia";
	}
	if (["united states", "canada", "mexico", "brazil", "argentina", "chile", "colombia"].includes(normalized)) {
		return "americas";
	}
	if (["australia", "new zealand", "fiji"].includes(normalized)) {
		return "oceania";
	}
	if (["south africa", "ghana", "kenya", "morocco", "egypt"].includes(normalized)) {
		return "africa";
	}
	return "other";
}

/**
 * @param {string | null | undefined} deadline
 * @returns {string}
 */
export function getDeadlineLabel(deadline) {
	if (!deadline) return "Deadline TBD";
	const daysUntil = getDaysUntil(deadline);
	if (daysUntil === "TODAY") return "Due today";
	if (typeof daysUntil === "number" && daysUntil < 0) return "Deadline passed";
	if (typeof daysUntil === "number") return `${daysUntil} days left`;
	return String(daysUntil);
}
