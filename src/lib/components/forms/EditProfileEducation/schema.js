import { bool, boolean, date, number, object, string } from "yup";


export const profileEducationSchema = object({
    university: string(),
    major: string(),
    grad_year: number().min(2010)
})
