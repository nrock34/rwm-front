/**
 * @typedef {"invalid_response" | "missing_env" | "upstream_error" | "network_error" | "upload_unavailable" | "invalid_upload" | "invalid_profile_id"} ProfileErrorCode
 */

/**
 * @typedef {{
 *   code: ProfileErrorCode;
 *   status: number;
 *   message: string;
 *   details?: unknown;
 * }} ProfileDomainError
 */

/**
 * @typedef {{
 *   first_name: string;
 *   last_name: string;
 *   username: string;
 *   bio: string;
 *   birthday: string;
 *   avatar: undefined;
 * }} EditableProfileInfoFormData
 */

/**
 * @typedef {{
 *   formData: EditableProfileInfoFormData;
 *   currentAvatarUrl: string | null;
 * }} EditableProfileInfoState
 */

/**
 * @typedef {{
 *   name: string;
 *   username: string;
 *   email: string;
 *   phone: string;
 *   location: string;
 *   university: string;
 *   major: string;
 *   bio: string;
 *   avatar: string | null;
 *   isIncompleteProfile: boolean;
 * }} ProfileSummaryState
 */

/**
 * @typedef {{
 *   email: string;
 *   first_name: string;
 *   last_name: string;
 *   username: string;
 * }} ProfileAccountSettingsState
 */

/**
 * @typedef {{
 *   university: string;
 *   major: string;
 *   grad_year: number | undefined;
 * }} ProfileEducationSettingsState
 */

/**
 * @typedef {{
 *   university: string;
 *   major: string;
 *   grad_year?: number;
 * }} ProfileEducationSettingsInput
 */

/**
 * @typedef {{
 *   name: string;
 *   tone: "blue" | "purple" | "green" | "neutral";
 * }} PublicProfileBadge
 */

/**
 * @typedef {{
 *   id: number;
 *   data: {
 *     title: string;
 *     content: string;
 *     updated_at: string;
 *   };
 *   image: string | null;
 * }} PublicProfilePost
 */

/**
 * @typedef {{
 *   id: number;
 *   name: string;
 *   username: string;
 *   avatar: string | null;
 *   badge: string | null;
 *   location: string;
 *   university: string;
 *   currentProgram: string;
 *   major: string;
 *   year: number | null;
 *   wentAbroad: boolean | null;
 *   joinDate: string | null;
 *   bio: string;
 *   isVerified: boolean;
 *   staff: boolean;
 *   stats: {
 *     posts: number | null;
 *     likes: number | null;
 *   };
 *   badges: PublicProfileBadge[];
 *   recentPosts: PublicProfilePost[];
 * }} PublicProfileState
 */

/**
 * @typedef {{
 *   id: number;
 *   type: string;
 *   action: string;
 *   target: string;
 *   targetObjId: number | null;
 *   user: string;
 *   timestamp: string;
 * }} ProfileActivityItem
 */

/**
 * @typedef {{
 *   id: number;
 *   title: string;
 *   provider: string;
 *   type: string;
 *   status: string;
 *   deadline: string;
 *   submitted: string | null;
 *   progress: number;
 * }} ProfileApplicationItem
 */

/**
 * @typedef {{
 *   id: number;
 *   type: string;
 *   title: string;
 *   provider: string;
 *   author: string;
 *   amount: string;
 *   cost: string;
 *   downloads: number;
 *   views: number;
 *   dateSaved: string;
 * }} ProfileSavedItem
 */

/**
 * @typedef {{
 *   first_name: string;
 *   last_name: string;
 *   username: string;
 *   bio: string;
 *   birthday: string;
 *   avatar?: unknown;
 * }} EditableProfileInfoInput
 */

/**
 * @typedef {{
 *   fetch: typeof fetch;
 *   accessToken?: string | null;
 * }} ProfileFetchDeps
 */

/**
 * @typedef {ProfileFetchDeps & {
 *   profileUserId: string | number;
 * }} PublicProfileFetchDeps
 */

/**
 * @typedef {ProfileFetchDeps & {
 *   platform: import("@sveltejs/kit").RequestEvent["platform"];
 *   origin: string;
 * }} ProfileUpdateDeps
 */

/**
 * Minimal R2-compatible bucket contract used by the profile domain.
 *
 * @typedef {{
 *   put: (key: string, value: ArrayBuffer, options?: {
 *     httpMetadata?: {
 *       contentType?: string;
 *       cacheControl?: string;
 *       contentDisposition?: string;
 *     };
 *   }) => Promise<unknown>;
 *   delete?: (key: string) => Promise<unknown>;
 * }} ProfileAvatarBucket
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: EditableProfileInfoState;
 * }} ProfileLoadSuccess
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: ProfileSummaryState;
 * }} ProfileSummaryLoadSuccess
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: ProfileAccountSettingsState;
 * }} ProfileAccountSettingsSuccess
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: ProfileEducationSettingsState;
 * }} ProfileEducationSettingsSuccess
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: ProfileActivityItem[];
 * }} ProfileActivitySuccess
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: ProfileApplicationItem[];
 * }} ProfileApplicationsSuccess
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: ProfileSavedItem[];
 * }} ProfileSavedItemsSuccess
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: {
 *     avatarUrl: string | null;
 *   };
 * }} ProfileUpdateSuccess
 */

/**
 * @typedef {{
 *   ok: false;
 *   error: ProfileDomainError;
 * }} ProfileFailure
 */

/**
 * @typedef {ProfileLoadSuccess | ProfileFailure} ProfileLoadResult
 */

/**
 * @typedef {ProfileSummaryLoadSuccess | ProfileFailure} ProfileSummaryResult
 */

/**
 * @typedef {ProfileAccountSettingsSuccess | ProfileFailure} ProfileAccountSettingsResult
 */

/**
 * @typedef {ProfileEducationSettingsSuccess | ProfileFailure} ProfileEducationSettingsResult
 */

/**
 * @typedef {ProfileActivitySuccess | ProfileFailure} ProfileActivityResult
 */

/**
 * @typedef {ProfileApplicationsSuccess | ProfileFailure} ProfileApplicationsResult
 */

/**
 * @typedef {ProfileSavedItemsSuccess | ProfileFailure} ProfileSavedItemsResult
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: PublicProfileState;
 * }} PublicProfileSuccess
 */

/**
 * @typedef {PublicProfileSuccess | ProfileFailure} PublicProfileResult
 */

/**
 * @typedef {ProfileUpdateSuccess | ProfileFailure} ProfileUpdateResult
 */

/**
 * @typedef {{
 *   arrayBuffer: () => Promise<ArrayBuffer>;
 *   name: string;
 *   size: number;
 *   type: string;
 * }} ProfileUploadFile
 */

/**
 * `checkJs` does not always narrow discriminated unions in JS files.
 *
 * @param {ProfileLoadResult | ProfileUpdateResult | ProfileEducationSettingsResult | PublicProfileResult} result
 * @returns {ProfileFailure}
 */
export function asProfileFailure(result) {
	return /** @type {ProfileFailure} */ (result);
}

export {};
