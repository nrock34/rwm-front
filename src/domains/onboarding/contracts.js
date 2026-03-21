import * as yup from "yup";

export const STUDENT_LEVEL_VALUES = Object.freeze(["ungrd", "grad", "almn"]);
export const TRAVEL_EXPERIENCE_VALUES = Object.freeze(["none", "1to3", "4to7", "8plus"]);
export const INTERESTED_REGION_VALUES = Object.freeze([
	"americas",
	"wasia",
	"easia",
	"neurope",
	"seurope",
	"nafrica",
	"safrica",
	"australia"
]);

export const CURRENT_GRADUATION_YEAR = new Date().getFullYear();
export const MIN_GRADUATION_YEAR = CURRENT_GRADUATION_YEAR - 30;
export const MAX_GRADUATION_YEAR = CURRENT_GRADUATION_YEAR + 10;

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isObject(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * @param {unknown} value
 * @returns {string | undefined}
 */
function normalizeOptionalString(value) {
	if (typeof value !== "string") return undefined;
	const normalized = value.trim();
	return normalized.length > 0 ? normalized : undefined;
}

export const academicBackgroundSchema = yup.object({
	studentLevel: yup
		.string()
		.oneOf(STUDENT_LEVEL_VALUES)
		.required("Please choose the status that best represents you."),
	university: yup
		.string()
		.transform((value) => (typeof value === "string" ? value.trim() : ""))
		.test(
			"valid-university-value",
			"Enter your university.",
			(value) => {
				if (typeof value !== "string") return false;
				if (value.length === 0) return false;
				if (/^\d+$/u.test(value)) return true;
				return value.length >= 2;
			}
		)
		.required("Enter your university."),
	major: yup
		.string()
		.transform((value) => (typeof value === "string" ? value.trim() : value))
		.min(2, "Enter your major.")
		.required("Enter your major."),
	year: yup
		.number()
		.transform((value, originalValue) => {
			if (originalValue === "" || originalValue == null) return Number.NaN;
			return Number(originalValue);
		})
		.integer("Enter a valid graduation year.")
		.min(MIN_GRADUATION_YEAR, "Enter a realistic graduation year.")
		.max(MAX_GRADUATION_YEAR, "Enter a realistic graduation year.")
		.required("Enter your graduation year.")
});

export const globalBackgroundSchema = yup.object({
	travelExperience: yup
		.string()
		.oneOf(TRAVEL_EXPERIENCE_VALUES)
		.required("Choose your travel experience."),
	hasTraveledEdu: yup
		.boolean()
		.typeError("Select whether you have studied abroad before.")
		.required("Select whether you have studied abroad before."),
	otherLanguageSpoken: yup
		.string()
		.transform((value) => (typeof value === "string" ? value.trim() : ""))
		.max(80, "Keep the language response under 80 characters.")
		.optional(),
	interestedRegions: yup
		.array()
		.of(yup.string().oneOf(INTERESTED_REGION_VALUES).required())
		.min(1, "Choose at least one region.")
		.required("Choose at least one region.")
});

export const contributorSchema = yup.object({
	wantToContribute: yup
		.boolean()
		.typeError("Choose whether you want to contribute.")
		.required("Choose whether you want to contribute."),
	whereHaveYouBeen: yup
		.string()
		.transform((value) => (typeof value === "string" ? value.trim() : value))
		.min(3, "Tell us at least one place you have been.")
		.required("Tell us at least one place you have been.")
});

/**
 * @param {unknown} value
 * @returns {import("./types.js").OnboardingAcademicBackgroundInput}
 */
export function assertAcademicBackgroundInput(value) {
	return /** @type {import("./types.js").OnboardingAcademicBackgroundInput} */ (
		academicBackgroundSchema.validateSync(value, {
			abortEarly: false,
			stripUnknown: true
		})
	);
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").OnboardingGlobalBackgroundInput}
 */
export function assertGlobalBackgroundInput(value) {
	return /** @type {import("./types.js").OnboardingGlobalBackgroundInput} */ (
		globalBackgroundSchema.validateSync(value, {
			abortEarly: false,
			stripUnknown: true
		})
	);
}

/**
 * @param {unknown} value
 * @returns {asserts value is import("./types.js").OnboardingStepId}
 */
export function assertOnboardingStepId(value) {
	if (value === "academic_background" || value === "global_background") return;
	throw new TypeError("Onboarding step id is invalid.");
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").OnboardingDraft}
 */
export function assertOnboardingDraft(value) {
	if (!isObject(value)) {
		return {
			academicBackground: null,
			globalBackground: null
		};
	}

	return {
		academicBackground: value.academicBackground && isObject(value.academicBackground)
			? /** @type {import("./types.js").OnboardingAcademicBackgroundPayload} */ (value.academicBackground)
			: null,
		globalBackground: value.globalBackground && isObject(value.globalBackground)
			? /** @type {import("./types.js").OnboardingGlobalBackgroundPayload} */ (value.globalBackground)
			: null
	};
}

/**
 * @param {unknown} value
 * @returns {string | null}
 */
export function normalizeLanguageValue(value) {
	return normalizeOptionalString(value) ?? null;
}
