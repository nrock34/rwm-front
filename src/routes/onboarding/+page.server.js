import { API_URL } from '$env/static/private'
import { superValidate } from 'sveltekit-superforms'
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
        GlobalBackgroundForm: await superValidate(yup(globalBackgroundSchema)),
        AcademicBackgroundForm: await superValidate(yup(academicBackgroundSchema), {'studentLevel': null}),
        universityList,
    }
}