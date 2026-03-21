import {
	isObject,
	objectArray,
	objectOrNull,
	stringArray,
	textOrEmpty,
	toFiniteNumber,
	toNullableFiniteNumber
} from "../../core/domain/coerce.js";

const PROGRAM_PLACEHOLDER_IMAGE =
	"https://images.pexels.com/photos/28838309/pexels-photo-28838309.jpeg";

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function mapFields(value) {
	if (!Array.isArray(value)) return [];
	return value
		.map((item) => {
			if (typeof item === "string") return item;
			if (isObject(item)) return textOrEmpty(item.name);
			return "";
		})
		.map((item) => item.trim())
		.filter(Boolean);
}

/**
 * @param {Record<string, unknown> | null} value
 * @returns {string}
 */
function formatLocation(value) {
	if (!value) return "Location TBD";
	const parts = [textOrEmpty(value.city), textOrEmpty(value.country)].filter(Boolean);
	return parts.length > 0 ? parts.join(", ") : "Location TBD";
}

/**
 * @param {Record<string, unknown> | null} value
 * @returns {import("./types.js").ProgramRequirements}
 */
function mapRequirements(value) {
	return {
		gpa: textOrEmpty(value?.gpa) || "TBD",
		prerequisites: textOrEmpty(value?.prerequisites) || "Not provided",
		active_credits_needed: textOrEmpty(value?.active_credits_needed) || "TBD",
		language: textOrEmpty(value?.language) || "TBD",
		level: textOrEmpty(value?.level) || "TBD"
	};
}

/**
 * @param {Record<string, unknown> | null} value
 * @returns {{ program_fee: number; accommodation_fee: number; extra_fee: number; additional: string }}
 */
function mapCosts(value) {
	return {
		program_fee: toFiniteNumber(value?.program_fee),
		accommodation_fee: toFiniteNumber(value?.accommodation_fee),
		extra_fee: toFiniteNumber(value?.extra_fee),
		additional: textOrEmpty(value?.additional) || "Additional cost details were not provided."
	};
}

/**
 * @param {{ program_fee: number; accommodation_fee: number; extra_fee: number }} cost
 * @returns {number}
 */
function totalCost(cost) {
	return cost.program_fee + cost.accommodation_fee + cost.extra_fee;
}

/**
 * @param {number} value
 * @returns {string}
 */
function deriveCostRange(value) {
	if (value >= 20000) return "high";
	if (value >= 10000) return "medium";
	if (value > 0) return "low";
	return "unknown";
}

/**
 * @param {string} value
 * @returns {string}
 */
function countryToId(value) {
	return value.replaceAll(" ", "_").replaceAll("&", "and");
}

/**
 * @param {Record<string, unknown>} program
 * @returns {import("./types.js").ProgramCard}
 */
export function mapProgramCard(program) {
	const provider = objectOrNull(program.provider);
	const location = objectOrNull(program.location);
	const requirements = objectOrNull(program.requirements);
	const cost = mapCosts(objectOrNull(program.cost));
	const id = toFiniteNumber(program.id);

	return {
		id,
		title: textOrEmpty(program.title) || "Untitled program",
		provider: textOrEmpty(provider?.name) || "Program Provider",
		location: formatLocation(location),
		country: textOrEmpty(location?.country).toLowerCase(),
		duration: textOrEmpty(program.duration) || "Duration TBD",
		cost: totalCost(cost),
		costRange: deriveCostRange(totalCost(cost)),
		fields: mapFields(program.fields),
		language: textOrEmpty(program.language) || textOrEmpty(requirements?.language) || "TBD",
		rating: toFiniteNumber(program.rating),
		participants: toFiniteNumber(program.participants),
		description: textOrEmpty(program.shortDescription) || textOrEmpty(program.description) || "Program details are being updated.",
		highlights: stringArray(program.highlights),
		image: textOrEmpty(program.image) || PROGRAM_PLACEHOLDER_IMAGE,
		featured: Boolean(program.featured),
		requirements: mapRequirements(requirements),
		href: `/programs/${id}`
	};
}

/**
 * @param {Record<string, unknown>} value
 * @returns {import("./types.js").ProgramCountryOption}
 */
export function mapProgramCountryOption(value) {
	const country = textOrEmpty(value.country);
	return {
		id: countryToId(country),
		name: country,
		count: toFiniteNumber(value.count)
	};
}

/**
 * @param {Record<string, unknown> | null} value
 * @returns {{ courses: string[]; fieldTrips: string[]; faculty: string; classSize: string }}
 */
function mapAcademics(value) {
	return {
		courses: stringArray(value?.courses),
		fieldTrips: stringArray(value?.trips ?? value?.fieldTrips),
		faculty: textOrEmpty(value?.faculty),
		classSize: textOrEmpty(value?.class_size ?? value?.classSize) || "Not provided"
	};
}

/**
 * @param {Record<string, unknown> | null} value
 * @returns {{ description: string; type: string; location: string; amenities: string[]; cost: string }}
 */
function mapHousing(value) {
	return {
		description: textOrEmpty(value?.description) || "Accommodation details are being updated.",
		type: textOrEmpty(value?.type) || "Not provided",
		location: textOrEmpty(value?.location) || "Not provided",
		amenities: stringArray(value?.amenities),
		cost: textOrEmpty(value?.cost) || "Accommodation fee located in Cost tab"
	};
}

/**
 * @param {unknown} value
 * @returns {Array<{ step: number; title: string; description: string; deadline: string }>}
 */
function mapApplicationProcess(value) {
	return objectArray(value).map((item, index) => ({
		step: toFiniteNumber(item.step) || index + 1,
		title: textOrEmpty(item.title) || "Application step",
		description: textOrEmpty(item.description) || "Additional step details were not provided.",
		deadline: textOrEmpty(item.complete_by) || textOrEmpty(item.deadline) || "Deadline not provided"
	}));
}

/**
 * @param {unknown} value
 * @returns {Array<{ name: string; program: string; rating: number; text: string; avatar: string }>}
 */
function mapTestimonials(value) {
	return objectArray(value).map((item) => ({
		name: textOrEmpty(item.name) || "Student",
		program: textOrEmpty(item.program) || "Program participant",
		rating: toFiniteNumber(item.rating),
		text: textOrEmpty(item.text) || "Feedback was not provided.",
		avatar: textOrEmpty(item.avatar) || PROGRAM_PLACEHOLDER_IMAGE
	}));
}

/**
 * @param {Record<string, unknown> | null} value
 * @returns {{ email: string | null; phone: string | null; website: string | null; address: { state: string } }}
 */
function mapContact(value) {
	const address = objectOrNull(value?.address);
	return {
		email: textOrEmpty(value?.email) || null,
		phone: textOrEmpty(value?.phone) || null,
		website: textOrEmpty(value?.website) || null,
		address: {
			state: textOrEmpty(address?.state) || textOrEmpty(value?.address)
		}
	};
}

/**
 * @param {Record<string, unknown> | null} university
 * @param {string} fallbackName
 * @returns {{ name: string; ranking: string; accreditation: string; founded: string; students: string; description: string }}
 */
function mapUniversity(university, fallbackName) {
	return {
		name: textOrEmpty(university?.name) || fallbackName || "University information coming soon",
		ranking: textOrEmpty(university?.ranking) || "",
		accreditation: textOrEmpty(university?.accreditation) || "",
		founded: textOrEmpty(university?.founded) || "",
		students: textOrEmpty(university?.size ?? university?.students) || "",
		description: textOrEmpty(university?.description) || "University information is being updated."
	};
}

/**
 * @param {Record<string, unknown>} program
 * @param {Record<string, unknown> | null} university
 * @returns {import("./types.js").ProgramDetail}
 */
export function mapProgramDetail(program, university = null) {
	const provider = objectOrNull(program.provider);
	const location = objectOrNull(program.location);
	const requirements = mapRequirements(objectOrNull(program.requirements));
	const cost = mapCosts(objectOrNull(program.cost));
	const academics = mapAcademics(objectOrNull(program.academics));
	const housing = mapHousing(objectOrNull(program.accomodations ?? program.accommodations));
	const providerName = textOrEmpty(provider?.name) || "Program Provider";
	const id = toFiniteNumber(program.id);

	return {
		id,
		title: textOrEmpty(program.title),
		provider: {
			name: providerName,
			universityId: toNullableFiniteNumber(provider?.university)
		},
		location: {
			city: textOrEmpty(location?.city),
			country: textOrEmpty(location?.country)
		},
		duration: textOrEmpty(program.duration) || "Duration TBD",
		cost,
		image: textOrEmpty(program.image) || PROGRAM_PLACEHOLDER_IMAGE,
		participants: toFiniteNumber(program.participants),
		description: textOrEmpty(program.shortDescription) || textOrEmpty(program.description) || "Program details are being updated.",
		fullDescription: textOrEmpty(program.description) || textOrEmpty(program.shortDescription) || "Program details are being updated.",
		highlights: stringArray(program.highlights),
		gallery: stringArray(program.gallery),
		featured: Boolean(program.featured),
		requirements,
		fields: mapFields(program.fields),
		academics,
		housing,
		applicationProcess: mapApplicationProcess(program.application_steps),
		testimonials: mapTestimonials(program.testimonials),
		contact: mapContact(objectOrNull(provider?.contact)),
		appDeadline: textOrEmpty(program.application_deadline) || null,
		applicationLink: textOrEmpty(program.application_link) || null,
		infoLink: textOrEmpty(program.info_link) || null,
		university: mapUniversity(university, providerName),
		href: `/programs/${id}`
	};
}

/**
 * @param {import("./types.js").ProgramDetail} program
 * @returns {string[]}
 */
export function getProgramDetailMissingFields(program) {
	/** @type {string[]} */
	const missing = [];

	if (!textOrEmpty(program.title)) missing.push("title");
	if (!textOrEmpty(program.provider.name)) missing.push("provider");
	if (!textOrEmpty(program.location.city) && !textOrEmpty(program.location.country)) missing.push("location");
	if (!textOrEmpty(program.description) && !textOrEmpty(program.fullDescription)) missing.push("description");

	return missing;
}
