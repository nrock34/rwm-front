/**
 * @typedef {"invalid_response" | "missing_env" | "upstream_error" | "network_error" | "upload_unavailable"} ProfileErrorCode
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
 *   accessToken: string;
 * }} ProfileFetchDeps
 */

/**
 * @typedef {ProfileFetchDeps & {
 *   platform: import("@sveltejs/kit").RequestEvent["platform"];
 *   host: string;
 * }} ProfileUpdateDeps
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
 * @param {ProfileLoadResult | ProfileUpdateResult} result
 * @returns {ProfileFailure}
 */
export function asProfileFailure(result) {
	return /** @type {ProfileFailure} */ (result);
}

export {};
