import { API_URL } from '$env/static/private'
import { fail, superValidate } from 'sveltekit-superforms'
import AcademicBackgroundForm from './forms/academic-background-form.svelte'
import { yup } from 'sveltekit-superforms/adapters'
import { academicBackgroundSchema, globalBackgroundSchema } from './schema.js'
import GlobalBackgroundForm from './forms/global-background-form.svelte'


export const load = async ({fetch}) => {
    let universityList
    const universityListResp = await fetch(`${API_URL}universities/selectlist`)
    if (!universityListResp.ok) error(universityListResp.status)
    else {
        universityList = await universityListResp.json()
    }


    return {
        form: await superValidate(yup(academicBackgroundSchema), {'studentLevel': null}),
        GlobalBackgroundForm: await superValidate(yup(globalBackgroundSchema)),
        universityList,
    }
}


export const actions = {
    acdBackground: async ({ request }) => {

        const form = await superValidate(request, yup(academicBackgroundSchema));

        if (!form.valid) return fail(400, { form })

        return {
            form,
            success: true,
            nextForm: true,
            GlobalBackgroundForm: await superValidate(yup(globalBackgroundSchema)),
        }
    },
    glbBackground: async ({ request }) => {

        const form = await superValidate(request, yup(globalBackgroundSchema))

        if (!form.valid) return fail(400, { form })

        if (form.data.hasTraveledEdu || form.data.travelExperience === '8plus' || form.data.travelExperience === '4to7') {

        }
    }
}