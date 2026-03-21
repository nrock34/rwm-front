import {
	objectArray,
	stringArray,
	textOrEmpty,
	toFiniteNumber,
	toTitleCase
} from "../../core/domain/coerce.js";

/**
 * @param {string} value
 * @returns {string}
 */
function humanize(value) {
	return toTitleCase(value);
}

/**
 * @param {number} lower
 * @param {number} upper
 * @returns {string}
 */
function formatScholarshipAmount(lower, upper) {
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	});

	if (lower > 0 && upper > 0) {
		return `${formatter.format(lower)} - ${formatter.format(upper)}`;
	}
	if (upper > 0) {
		return `Up to ${formatter.format(upper)}`;
	}
	if (lower > 0) {
		return formatter.format(lower);
	}
	return "Amount not provided";
}

/**
 * @param {string | null} value
 * @returns {string}
 */
function formatDateLabel(value) {
	if (!value) return "TBD";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "TBD";
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}

/**
 * @param {string} value
 * @returns {string[]}
 */
function splitEligibility(value) {
	return value
		.split(/\n|;|,/)
		.map((item) => item.trim())
		.filter(Boolean);
}

/**
 * @param {Record<string, unknown> | null} requirements
 * @returns {string[]}
 */
function mapEligibility(requirements) {
	if (!requirements) return [];
	const eligibilityText = textOrEmpty(requirements.eligibility);
	const items = splitEligibility(eligibilityText);
	if (items.length > 0) return items;

	const fallbacks = [
		textOrEmpty(requirements.field) ? `Field: ${humanize(textOrEmpty(requirements.field))}` : "",
		textOrEmpty(requirements.grad_year) ? `Level: ${humanize(textOrEmpty(requirements.grad_year))}` : "",
		textOrEmpty(requirements.study_country) ? `Study country: ${humanize(textOrEmpty(requirements.study_country))}` : ""
	].filter(Boolean);

	return fallbacks;
}

/**
 * @param {Record<string, unknown> | null} requirements
 * @returns {import("./types.js").ScholarshipRequirementItem[]}
 */
function mapRequirementChecklist(requirements) {
	return mapEligibility(requirements).map((req, index) => ({
		id: `req-${index + 1}`,
		req
	}));
}

/**
 * @param {Record<string, unknown> | null} requirements
 * @returns {{ category: string, categories: string[], country: string, level: string, field: string, location: string }}
 */
function mapRequirementMeta(requirements) {
	/** @type {string[]} */
	const categories = [];
	const field = requirements ? textOrEmpty(requirements.field) : "";
	const level = requirements ? textOrEmpty(requirements.grad_year) : "";
	const country = requirements ? textOrEmpty(requirements.study_country) : "";

	return {
		category: "all",
		categories,
		country: country.toLowerCase(),
		level,
		field,
		location: country ? humanize(country) : "Worldwide"
	};
}

/**
 * @param {Record<string, unknown>} scholarship
 * @returns {import("./types.js").ScholarshipCard}
 */
export function mapScholarshipCard(scholarship) {
	const provider = scholarship.provider && typeof scholarship.provider === "object"
		? /** @type {Record<string, unknown>} */ (scholarship.provider)
		: null;
	const requirements = scholarship.requirements && typeof scholarship.requirements === "object"
		? /** @type {Record<string, unknown>} */ (scholarship.requirements)
		: null;
	const categories = stringArray(scholarship.categories);
	const meta = mapRequirementMeta(requirements);
	const lowerBound = toFiniteNumber(scholarship.lower_bound);
	const upperBound = toFiniteNumber(scholarship.upper_bound);
	const id = toFiniteNumber(scholarship.id);

	return {
		id,
		title: textOrEmpty(scholarship.name) || "Untitled scholarship",
		provider: provider ? textOrEmpty(provider.name) || "Scholarship Provider" : "Scholarship Provider",
		amount: formatScholarshipAmount(lowerBound, upperBound),
		amountValue: upperBound || lowerBound || 0,
		deadline: textOrEmpty(scholarship.deadline) || null,
		deadlineLabel: formatDateLabel(textOrEmpty(scholarship.deadline) || null),
		categories,
		category: categories[0] ?? meta.category,
		country: meta.country,
		level: meta.level,
		field: meta.field,
		location: meta.location,
		description: textOrEmpty(scholarship.summary),
		eligibility: mapEligibility(requirements),
		status: textOrEmpty(scholarship.status) || "upcoming",
		featured: Boolean(scholarship.featured),
		rating: toFiniteNumber(scholarship.rating),
		applicants: null,
		awarded: null,
		href: `/scholarships/${id}`
	};
}

/**
 * @param {Record<string, unknown>[]} events
 * @param {string | null} deadline
 * @returns {import("./types.js").ScholarshipTimelineItem[]}
 */
function mapTimeline(events, deadline) {
	const now = Date.now();
	/** @type {import("./types.js").ScholarshipTimelineItem[]} */
	const timeline = events
		.map((event) => {
			const status = /** @type {"past" | "upcoming" | "current" | "future"} */ ((() => {
				const timestamp = Date.parse(textOrEmpty(event.date));
				if (Number.isNaN(timestamp)) return "future";
				const diff = timestamp - now;
				if (Math.abs(diff) < 1000 * 60 * 60 * 24) return "current";
				if (diff < 0) return "past";
				if (diff < 1000 * 60 * 60 * 24 * 7) return "upcoming";
				return "future";
			})());

			return {
				event: textOrEmpty(event.name) || "Important date",
				date: textOrEmpty(event.date),
				status
			};
		})
		.filter((event) => Boolean(event.date));

	if (deadline && !timeline.some((event) => event.date === deadline)) {
		const deadlineTimestamp = Date.parse(deadline);
		timeline.push({
			event: "Application deadline",
			date: deadline,
			status: Number.isNaN(deadlineTimestamp)
				? "future"
				: Math.abs(deadlineTimestamp - now) < 1000 * 60 * 60 * 24
					? "current"
					: deadlineTimestamp < now
						? "past"
						: deadlineTimestamp - now < 1000 * 60 * 60 * 24 * 7
							? "upcoming"
							: "future"
		});
	}

	return timeline.sort((left, right) => Date.parse(left.date) - Date.parse(right.date));
}

/**
 * @param {Record<string, unknown>} scholarship
 * @returns {import("./types.js").ScholarshipDetail}
 */
export function mapScholarshipDetail(scholarship) {
	const base = mapScholarshipCard(scholarship);
	const requirements = scholarship.requirements && typeof scholarship.requirements === "object"
		? /** @type {Record<string, unknown>} */ (scholarship.requirements)
		: null;
	const description = textOrEmpty(scholarship.description) || base.description;
	const benefits = stringArray(scholarship.benefits);
	const steps = objectArray(scholarship.application_steps).map((step) => ({
		step: toFiniteNumber(step.step),
		title: textOrEmpty(step.title) || "Application step",
		description: textOrEmpty(step.description) || "Additional step details were not provided.",
		timeframe: textOrEmpty(step.complete_by)
			? `Complete by ${formatDateLabel(textOrEmpty(step.complete_by))}`
			: "Date not provided"
	}));
	const events = objectArray(scholarship.events);
	const link = textOrEmpty(scholarship.link) || null;
	const applicationLink = textOrEmpty(scholarship.application_link)
		|| textOrEmpty(scholarship.applicationLink)
		|| null;

	return {
		...base,
		location: base.location,
		description: base.description,
		fullDescription: description || "A full scholarship description is not available yet.",
		benefits,
		eligibility: mapEligibility(requirements),
		requirements: mapRequirementChecklist(requirements),
		applicationProcess: steps,
		timeline: mapTimeline(events, base.deadline),
		applicationLink,
		contact: {
			email: null,
			phone: null,
			website: link,
			address: null
		},
		successRate: "Not provided",
		updatedAt: textOrEmpty(scholarship.updated_at) || null
	};
}
