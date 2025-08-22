import * as yup from "yup"

export const academicBackgroundSchema = yup.object({
    studentLevel: yup.string()
        .required(),
    university: yup.string()
        .required(),
    major: yup.string()
        .required(),
    year: yup.number()
        .required()
})


export const globalBackgroundSchema = yup.object({
    travelExperience: yup.string()
        .required(),
    hasTraveledEdu: yup.boolean()
        .required(),
    otherLanguageSpoken: yup.string()
        .optional(),
    interestedRegions: yup.array()
        .of(yup.string())
        .min(1)
        .required(),
})


export const contributorSchema = yup.object({
    wantToCOntribute: yup.boolean()
        .required(),
    whereHaveYouBeen: yup.string()
        .required()
        .min(3)
})