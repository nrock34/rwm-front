import { fileFieldProxy, message, superValidate } from "sveltekit-superforms"
import { error, fail } from "@sveltejs/kit";
import { yup } from "sveltekit-superforms/adapters"

import { today, getLocalTimeZone } from "@internationalized/date";

import * as EditProfileInfoSchema from '$lib/components/forms/EditProfileInfo/schema.js'
import * as EditProfileEducationSchema from '$lib/components/forms/EditProfileEducation/schema.js'
import { ACS_TKN, API_URL } from "$env/static/private";
import { env } from "$env/dynamic/private";

export const load = async ({ locals, fetch, data }) => {

    let ACS_TKN = locals.token

    let universityList
    const universityListResp = await fetch(`${API_URL}universities/selectlist`)
    if (!universityListResp.ok) error(universityListResp.status)
    else {
        universityList = await universityListResp.json()
    }

    console.log(universityList)

    // GET profile data info 
    const profileInfoDataRespone = await fetch(`${API_URL}users/me/settings/profile`, {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${ACS_TKN}`
            }
        }
    )
    let profileInfoData
    if (!profileInfoDataRespone.ok) {
        error(profileInfoDataRespone.status)
    } else {
        profileInfoData = await profileInfoDataRespone.json()
        //console.log(profileInfoData)
    }

    //GET profile edcatiion info
    const profileEducationDataRespone = await fetch(`${API_URL}users/me/settings/edu`, {
        headers : {
            'Content-Type': 'applications/json',
            'Authorization': `Bearer ${ACS_TKN}`
        }
    })
    let profileEducationData
    if (!profileEducationDataRespone.ok) {
        error(profileEducationDataRespone.status)
    } else {
        profileEducationData = await profileEducationDataRespone.json()
    }

    //cast data to fit schema 
    let parsedEduData = EditProfileEducationSchema.profileEducationSchema.cast(
        {
            ...profileEducationData
        }
    )

    const editProfileInfoForm = await superValidate(
        {
            ...profileInfoData,
            avatar: undefined
            //prefill form slots
        },
        yup(EditProfileInfoSchema.profileInfoSchema)
    )

    const editProfileEducationForm = await superValidate(
        {
            ...parsedEduData
            // prefill form slots
        },
        yup(EditProfileEducationSchema.profileEducationSchema)
    )

    return {
        ...data,
        universityList,
        editProfileInfoForm,
        editProfileEducationForm,
    }
}


export const actions = {
    
    info: async ({ locals, request, platform }) => {
        let ACS_TKN = locals.token

        console.log(platform)
        console.log(2133)
        const profileInfoForm = await superValidate(request,
            yup(EditProfileInfoSchema.profileInfoSchema)
        );

        if (!profileInfoForm.valid) return fail(400, { profileInfoForm });

        const pfpfile = profileInfoForm.data.avatar || null
        let imgUrl
        console.log(pfpfile)
        if (pfpfile) {
            const key = `profile-${crypto.randomUUID()}-${fileFieldProxy.name}`;
            const arrayBuffer = await pfpfile.arrayBuffer();
            await platform.env.pfprwm.put(key, arrayBuffer, {
                httpMetadata: { contentType: pfpfile.type }
            });
            imgUrl = `https://pub-befc936fce3341a29efe8e635e01f241.r2.dev/${key}`
            console.log(imgUrl)
        } else {
            imgUrl = null
            delete profileInfoForm.data.avatar
        }


        
        const infoUpdateResp = await fetch(`${API_URL}users/me/settings/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACS_TKN}`
            },
            body: JSON.stringify({
                ...profileInfoForm.data,
            })

        })

        console.log(await infoUpdateResp.json())

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