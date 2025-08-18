import { message, superValidate } from "sveltekit-superforms"
import { fail } from "@sveltejs/kit";
import { yup } from "sveltekit-superforms/adapters"

import { today, getLocalTimeZone } from "@internationalized/date";

import * as EditProfileInfoSchema from '$lib/components/forms/EditProfileInfo/schema.js'
import * as EditProfileEducationSchema from '$lib/components/forms/EditProfileEducation/schema.js'

export const load = async ({ data, props }) => {

    const editProfileInfoForm = await superValidate(
        {
            birthday: today(getLocalTimeZone()).toString()
            //prefill form slots
        },
        yup(EditProfileInfoSchema.profileInfoSchema)
    )

    const editProfileEducationForm = await superValidate(
        {
            // prefill form slots
        },
        yup(EditProfileEducationSchema.profileEducationSchema)
    )

    return {
        ...data,
        editProfileInfoForm,
        editProfileEducationForm,
    }

}


export const actions = {
    profileInfo: async (event) => {
        const profileInfoForm = await superValidate(event,
            yup(EditProfileInfoSchema.profileInfoSchema)
        );

        if (!profileInfoForm.valid) return fail(400, { profileInfoForm });

        return message(profileInfoForm, "form submitted");

    },

    profileEducation: async (event) => {
        const profileEducationForm = await superValidate(event, 
            yup(EditProfileEducationSchema.profileEducationSchema)
        );

        if (!profileEducationForm.valid) return fail(400, { profileEducationForm });

        return message(profileEducationForm, "form submitted");
    }
} 