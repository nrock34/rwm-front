import { superValidate } from "sveltekit-superforms"
import { fail } from "@sveltejs/kit";
import { yup } from "sveltekit-superforms/adapters"

import * as EditProfileSettingSchema from '$lib/components/forms/EditProfileSettings/schema.js'
import * as EditProfileInfoSchema from '$lib/components/forms/EditProfileInfo/schema.js'
import * as EditProfileEducationSchema from '$lib/components/forms/EditProfileEducation/schema.js'

import { today, getLocalTimeZone } from "@internationalized/date"

/** @type {import("./$types").PageServerLoad} */
export const load = async () => {

    return {
        editProfileSettingsForm: await superValidate(
            {
                email: '',
                first_name: '',
                last_name: '',
                username: ''
            },
            yup(EditProfileSettingSchema.profileSettingsSchema),
            { errors: false }
        ),
        changePasswordForm: await superValidate(
            {
                old_pwd: '',
                new_pwd1: '',
                new_pwd2: ''
            },
            yup(EditProfileSettingSchema.passwordChangeSchema),
            { errors: false }
        ),
        editProfileInfoForm: await superValidate(
            {
                birthday: today(getLocalTimeZone()).toString()
            },
            yup(EditProfileInfoSchema.profileInfoSchema),
            { errors: false }
        ),
        editProfileEducationForm: await superValidate(
            {

            },
            yup(EditProfileEducationSchema.profileEducationSchema),
            { errors: false }
        )
    };
};

/** @type {import("./$types").Actions} */
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
