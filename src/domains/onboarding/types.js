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
 * The current API stores academic and global education separately. These are
 * the exact request shapes accepted by those endpoints.
 *
 * @typedef {{
 *   university: number;
 *   major: string;
 *   year: number;
 * }} OnboardingEducationUpdate
 */

/**
 * @typedef {{
 *   went_abroad: boolean;
 * }} OnboardingGlobalEducationUpdate
 */

/**
 * @typedef {"incomplete_draft" | "invalid_university" | "invalid_response" | "missing_env" | "upstream_error" | "network_error" | "partial_failure"} OnboardingErrorCode
 */

/**
 * @typedef {{
 *   code: OnboardingErrorCode;
 *   status: number;
 *   message: string;
 *   details?: unknown;
 * }} OnboardingDomainError
 */

/**
 * @typedef {{
 *   fetch: typeof fetch;
 *   accessToken?: string | null;
 * }} OnboardingSubmitDeps
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: {
 *     completedSteps: OnboardingStepId[];
 *   };
 * }} OnboardingSubmitSuccess
 */

/**
 * @typedef {{
 *   ok: false;
 *   error: OnboardingDomainError;
 * }} OnboardingSubmitFailure
 */

/**
 * @typedef {OnboardingSubmitSuccess | OnboardingSubmitFailure} OnboardingSubmitResult
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
