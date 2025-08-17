import { superValidate } from "sveltekit-superforms"
import { fail } from "@sveltejs/kit";
import { yup } from "sveltekit-superforms/adapters"

import * as EditProfileSettingSchema from '$lib/components/forms/EditProfileSettings/schema.js'
import * as EditProfileInfoSchema from '$lib/components/forms/EditProfileInfo/schema.js'
import * as EditProfileEducationSchema from '$lib/components/forms/EditProfileEducation/schema.js'

import { today, getLocalTimeZone } from "@internationalized/date"
import { scholarship } from "$lib/components/scholarship-single-page/testdata";
import { getLocalTimeZone } from "@internationalized/date";

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
        editProfileInfoForm: await superValidate(
            {
                birthday: today(getLocalTimeZone()).toString()
            },
            yup(EditProfileInfoSchema.profileInfoSchema)
        ),
        editProfileEducationForm: await superValidate(
            {

            },
            yup(EditProfileEducationSchema.profileEducationSchema)
        )
    };
};

export const actions = {
    updateProfileSettings: async (event) => {
        const form = await superValidate(event,
             yup(EditProfileSettingSchema.profileSettingsSchema),)

        if (!form.valid) {
            return fail(400, {form})
        }

        return { editProfileSettingsForm: form };
    },

    updateProfileInfo: async (event) => {
        const form = await superValidate(event,
            yup(EditProfileInfoSchema.profileInfoSchema)
        )
        if (!form.valid) {
            return fail(400, {form})
        }
        return { editProfileInfoForm: form };
    },

    
}