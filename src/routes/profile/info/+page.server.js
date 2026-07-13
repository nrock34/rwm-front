import { message, superValidate } from "sveltekit-superforms";
import { error, fail } from "@sveltejs/kit";
import { yup } from "sveltekit-superforms/adapters";

import * as EditProfileInfoSchema from "$lib/components/forms/EditProfileInfo/schema.js";
import * as EditProfileEducationSchema from "$lib/components/forms/EditProfileEducation/schema.js";
import { resolveApiUrl } from "../../../core/env/server.js";
import { requestJson } from "../../../core/http/client.js";
import {
	loadEditableProfileInfo,
	loadProfileEducationSettings,
	updateProfileEducationSettings,
	updateProfileInfo
} from "../../../domains/profile/index.js";
import { asProfileFailure } from "../../../domains/profile/types.js";

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isObject(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * @param {unknown} details
 * @param {string} fallback
 * @returns {string}
 */
function getApiErrorMessage(details, fallback) {
	if (typeof details === "string" && details.length > 0) {
		return details;
	}

	if (details instanceof Error && typeof details.message === "string" && details.message.length > 0) {
		return details.message;
	}

	if (isObject(details) && typeof details.error === "string" && details.error.length > 0) {
		return details.error;
	}

	if (isObject(details) && typeof details.detail === "string" && details.detail.length > 0) {
		return details.detail;
	}

	return fallback;
}
/** @type {import("./$types").PageServerLoad} */
export const load = async ({ fetch, data, locals }) => {
	const [universityListResponse, profileInfoResult, profileEducationResult] = await Promise.all([
		requestJson(resolveApiUrl("universities/selectlist"), {
			fetchFn: fetch
		}),
		loadEditableProfileInfo({
			fetch,
			accessToken: locals.token
		}),
		loadProfileEducationSettings({
			fetch,
			accessToken: locals.token
		})
	]);

	if (!universityListResponse.ok) {
		throw error(
			universityListResponse.status || 500,
			getApiErrorMessage(universityListResponse.error.details, "Failed to load universities.")
		);
	}

	if (!profileInfoResult.ok) {
		const failure = asProfileFailure(profileInfoResult);
		throw error(
			failure.error.status || 500,
			getApiErrorMessage(failure.error.details, failure.error.message)
		);
	}

	const profileInfoState = profileInfoResult.data;

	if (!profileEducationResult.ok) {
		const failure = asProfileFailure(profileEducationResult);
		throw error(
			failure.error.status || 500,
			getApiErrorMessage(failure.error.details, failure.error.message)
		);
	}

	const editProfileInfoForm = await superValidate(profileInfoState.formData, yup(EditProfileInfoSchema.profileInfoSchema));

	const editProfileEducationForm = await superValidate(
		profileEducationResult.data,
		yup(EditProfileEducationSchema.profileEducationSchema),
		{ errors: false }
	);

	return {
		...data,
		universityList: Array.isArray(universityListResponse.data) ? universityListResponse.data : [],
		currentAvatarUrl: profileInfoState.currentAvatarUrl,
		editProfileInfoForm,
		editProfileEducationForm
	};
};

/** @type {import("./$types").Actions} */
export const actions = {
	info: async ({ request, fetch, locals, platform, url }) => {
		const profileInfoForm = await superValidate(request, yup(EditProfileInfoSchema.profileInfoSchema));

		if (!profileInfoForm.valid) {
			return fail(400, { profileInfoForm });
		}

		const result = await updateProfileInfo(profileInfoForm.data, {
			fetch,
			accessToken: locals.token,
			platform,
			origin: url.origin
		});

		if (!result.ok) {
			const failure = asProfileFailure(result);
			return message(
				profileInfoForm,
				{
					error: "save_failed",
					msg: getApiErrorMessage(failure.error.details, failure.error.message)
				},
				{ status: failure.error.status || 400 }
			);
		}

		profileInfoForm.data.avatar = undefined;

		return message(profileInfoForm, {
			msg: "Profile information updated."
		});
	},

	profileEducation: async ({ request, fetch, locals }) => {
		const profileEducationForm = await superValidate(request, yup(EditProfileEducationSchema.profileEducationSchema));

		if (!profileEducationForm.valid) return fail(400, { profileEducationForm });

		const result = await updateProfileEducationSettings(profileEducationForm.data, {
			fetch,
			accessToken: locals.token
		});

		if (!result.ok) {
			const failure = asProfileFailure(result);
			return message(
				profileEducationForm,
				{
					error: "save_failed",
					msg: getApiErrorMessage(failure.error.details, failure.error.message)
				},
				{ status: failure.error.status || 400 }
			);
		}

		return message(profileEducationForm, {
			msg: "Education information updated."
		});
	}
};
