import { superValidate } from "sveltekit-superforms"
import { fail } from "@sveltejs/kit";
import { yup } from "sveltekit-superforms/adapters"

import * as EditProfileSettingSchema from '$lib/components/forms/EditProfileSettings/schema.js'
import { scholarship } from "$lib/components/scholarship-single-page/testdata";

export const load = async () => {

    return {
        editProfileSettingsForm: await superValidate(
            {
                profileVisibility: 'private',
                emailNotifications: {
                    scholarshipOpportunities: false
                }
            },
            yup(EditProfileSettingSchema.profileSettingsSchema)
    ),
    };
};

export const actions = {
    default: async (event) => {
        const form = await superValidate(event,
             yup(EditProfileSettingSchema.profileSettingsSchema))

        if (!form.valid) {
            return fail(400, {form})
        }

        return { editProfileSettingsForm: form };
    },
}