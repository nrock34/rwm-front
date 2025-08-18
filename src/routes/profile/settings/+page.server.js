import { superValidate } from "sveltekit-superforms"
import { fail } from "@sveltejs/kit";
import { yup } from "sveltekit-superforms/adapters"

import * as EditProfileSettingSchema from '$lib/components/forms/EditProfileSettings/schema.js'
import { error } from "@sveltejs/kit";
import { profileData } from "$lib/components/profile-page/test.js";


export const load = async ( { fetch } ) => {


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