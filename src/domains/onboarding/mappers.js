import {
	CURRENT_GRADUATION_YEAR,
	assertAcademicBackgroundInput,
	assertGlobalBackgroundInput,
	assertOnboardingDraft,
	assertOnboardingStepId,
	normalizeLanguageValue
} from "./contracts.js";

export const ONBOARDING_STEP_IDS = Object.freeze({
	academic: "academic_background",
	global: "global_background"
});

export const ONBOARDING_STEPS = Object.freeze({
	[ONBOARDING_STEP_IDS.academic]: {
		id: ONBOARDING_STEP_IDS.academic,
		label: "Academic Background",
		description: "School, major, and graduation details.",
		action: "academicBackground",
		nextStepId: ONBOARDING_STEP_IDS.global
	},
	[ONBOARDING_STEP_IDS.global]: {
		id: ONBOARDING_STEP_IDS.global,
		label: "Travel Experience",
		description: "Travel history and global interests.",
		action: "globalBackground",
		nextStepId: null
	}
});

export const ONBOARDING_STEP_ORDER = Object.freeze([
	ONBOARDING_STEP_IDS.academic,
	ONBOARDING_STEP_IDS.global
]);

/**
 * @returns {import("./types.js").OnboardingStepDefinition[]}
 */
export function listOnboardingSteps() {
	return ONBOARDING_STEP_ORDER.map((stepId) => ONBOARDING_STEPS[stepId]);
}

/**
 * @param {import("./types.js").OnboardingStepId} stepId
 * @returns {import("./types.js").OnboardingStepDefinition}
 */
export function getOnboardingStep(stepId) {
	assertOnboardingStepId(stepId);
	return ONBOARDING_STEPS[stepId];
}

/**
 * @returns {{ studentLevel: string; university: string; major: string; year: number | string }}
 */
export function createAcademicBackgroundDefaults() {
	return {
		studentLevel: "",
		university: "",
		major: "",
		year: CURRENT_GRADUATION_YEAR
	};
}

/**
 * @returns {{ travelExperience: string; hasTraveledEdu: boolean | null; otherLanguageSpoken: string; interestedRegions: string[] }}
 */
export function createGlobalBackgroundDefaults() {
	return {
		travelExperience: "",
		hasTraveledEdu: null,
		otherLanguageSpoken: "",
		interestedRegions: []
	};
}

/**
 * @returns {import("./types.js").OnboardingDraft}
 */
export function createOnboardingDraft() {
	return {
		academicBackground: null,
		globalBackground: null
	};
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").OnboardingAcademicBackgroundPayload}
 */
export function mapAcademicBackgroundStep(value) {
	const input = assertAcademicBackgroundInput(value);
	const universityValue = input.university.trim();
	const universityId = /^\d+$/u.test(universityValue) ? Number(universityValue) : null;

	return {
		student_level: input.studentLevel,
		university_id: universityId,
		university_name: universityId ? null : universityValue,
		major: input.major.trim(),
		graduation_year: input.year
	};
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").OnboardingGlobalBackgroundPayload}
 */
export function mapGlobalBackgroundStep(value) {
	const input = assertGlobalBackgroundInput(value);

	return {
		travel_experience: input.travelExperience,
		has_traveled_edu: input.hasTraveledEdu,
		other_language_spoken: normalizeLanguageValue(input.otherLanguageSpoken),
		interested_regions: [...input.interestedRegions]
	};
}

/**
 * @param {import("./types.js").OnboardingDraft | unknown} draftValue
 * @param {import("./types.js").OnboardingStepId} stepId
 * @param {unknown} stepValue
 * @returns {import("./types.js").OnboardingDraft}
 */
export function mergeOnboardingStep(draftValue, stepId, stepValue) {
	const draft = assertOnboardingDraft(draftValue);
	assertOnboardingStepId(stepId);

	if (stepId === ONBOARDING_STEP_IDS.academic) {
		return {
			...draft,
			academicBackground: mapAcademicBackgroundStep(stepValue)
		};
	}

	return {
		...draft,
		globalBackground: mapGlobalBackgroundStep(stepValue)
	};
}

/**
 * @param {import("./types.js").OnboardingDraft | unknown} draftValue
 * @returns {import("./types.js").OnboardingPayload}
 */
export function mapOnboardingDraftToPayload(draftValue) {
	const draft = assertOnboardingDraft(draftValue);
	/** @type {import("./types.js").OnboardingStepId[]} */
	const completedSteps = [];

	if (draft.academicBackground) completedSteps.push(ONBOARDING_STEP_IDS.academic);
	if (draft.globalBackground) completedSteps.push(ONBOARDING_STEP_IDS.global);

	return {
		academic_background: draft.academicBackground,
		global_background: draft.globalBackground,
		completed_steps: completedSteps
	};
}
