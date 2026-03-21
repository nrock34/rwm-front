/**
 * @typedef {"academic_background" | "global_background"} OnboardingStepId
 */

/**
 * @typedef {"ungrd" | "grad" | "almn"} StudentLevelId
 */

/**
 * @typedef {"none" | "1to3" | "4to7" | "8plus"} TravelExperienceId
 */

/**
 * @typedef {"americas" | "wasia" | "easia" | "neurope" | "seurope" | "nafrica" | "safrica" | "australia"} InterestedRegionId
 */

/**
 * @typedef {{
 *   studentLevel: StudentLevelId;
 *   university: string;
 *   major: string;
 *   year: number;
 * }} OnboardingAcademicBackgroundInput
 */

/**
 * @typedef {{
 *   student_level: StudentLevelId;
 *   university_id: number | null;
 *   university_name: string | null;
 *   major: string;
 *   graduation_year: number;
 * }} OnboardingAcademicBackgroundPayload
 */

/**
 * @typedef {{
 *   travelExperience: TravelExperienceId;
 *   hasTraveledEdu: boolean;
 *   otherLanguageSpoken?: string | null;
 *   interestedRegions: InterestedRegionId[];
 * }} OnboardingGlobalBackgroundInput
 */

/**
 * @typedef {{
 *   travel_experience: TravelExperienceId;
 *   has_traveled_edu: boolean;
 *   other_language_spoken: string | null;
 *   interested_regions: InterestedRegionId[];
 * }} OnboardingGlobalBackgroundPayload
 */

/**
 * @typedef {{
 *   academicBackground: OnboardingAcademicBackgroundPayload | null;
 *   globalBackground: OnboardingGlobalBackgroundPayload | null;
 * }} OnboardingDraft
 */

/**
 * @typedef {{
 *   academic_background: OnboardingAcademicBackgroundPayload | null;
 *   global_background: OnboardingGlobalBackgroundPayload | null;
 *   completed_steps: OnboardingStepId[];
 * }} OnboardingPayload
 */

/**
 * @typedef {{
 *   id: OnboardingStepId;
 *   label: string;
 *   description: string;
 *   action: string;
 *   nextStepId: OnboardingStepId | null;
 * }} OnboardingStepDefinition
 */

export {};
