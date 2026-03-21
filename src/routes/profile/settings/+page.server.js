import { message, superValidate } from "sveltekit-superforms"
import { error, fail } from "@sveltejs/kit";
import { yup } from "sveltekit-superforms/adapters"

import { resolveApiUrl } from "../../../core/env/server.js";
import { requestJson } from "../../../core/http/client.js";
import { loadProfileAccountSettings } from "../../../domains/profile/index.js";
import { asProfileFailure } from "../../../domains/profile/types.js";
import * as EditProfileSettingSchema from '$lib/components/forms/EditProfileSettings/schema.js'

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

    if (isObject(details) && typeof details.error === "string" && details.error.length > 0) {
        return details.error;
    }

    if (isObject(details) && typeof details.detail === "string" && details.detail.length > 0) {
        return details.detail;
    }

    return fallback;
}

export const load = async ( { fetch, locals } ) => {
    const accountSettingsResult = await loadProfileAccountSettings({
        fetch,
        accessToken: locals.token
    });

    if (!accountSettingsResult.ok) {
        const failure = asProfileFailure(accountSettingsResult);
        throw error(
            failure.error.status || 500,
            getApiErrorMessage(failure.error.details, "Failed to load account settings.")
        );
    }

    const accountInfo = accountSettingsResult.data;
    return {
        editProfileSettingsForm: await superValidate(
            {
                email: accountInfo.email,
                first_name: accountInfo.first_name,
                last_name: accountInfo.last_name,
                username: accountInfo.username
            },
            yup(EditProfileSettingSchema.profileSettingsSchema),
            { errors: false }
        ),
        changePasswordForm: await superValidate(
            {
                old_pwd: "",
                new_pwd1: "",
                new_pwd2: ""
            },
            yup(EditProfileSettingSchema.passwordChangeSchema),
            { errors: false }
        )
    };
};


export const actions = {
    accountInfo: async ({ request, fetch, locals }) => {
        const form = await superValidate(request, yup(EditProfileSettingSchema.profileSettingsSchema))

        if (!form.valid) {
            return fail(400, {form})
        }

        const response = await requestJson(resolveApiUrl("auth/info"), {
            method: "PATCH",
            fetchFn: fetch,
            headers: {
                Authorization: `Bearer ${locals.token}`
            },
            body: {
                email: form.data.email,
                first_name: form.data.first_name,
                last_name: form.data.last_name
            }
        });

        if (!response.ok) {
            return message(form, {
                error: "save_failed",
                msg: getApiErrorMessage(response.error.details, "Failed to update account information.")
            }, { status: response.status || 400 });
        }

        return message(form, {
            msg: "Account information updated."
        });
    },

    passwordChange: async ({ request, fetch, locals }) => {
        const form = await superValidate(request, yup(EditProfileSettingSchema.passwordChangeSchema))

        if (!form.valid) {
            return fail(400, { form })
        }

        const response = await requestJson(resolveApiUrl("auth/pwd-change"), {
            method: "POST",
            fetchFn: fetch,
            headers: {
                Authorization: `Bearer ${locals.token}`
            },
            body: form.data
        });

        if (!response.ok) {
            return message(form, {
                error: "save_failed",
                msg: getApiErrorMessage(response.error.details, "Failed to update password.")
            }, { status: response.status || 400 });
        }

        form.data.old_pwd = "";
        form.data.new_pwd1 = "";
        form.data.new_pwd2 = "";

        return message(form, {
            msg: "Password updated successfully."
        });
    }
}
