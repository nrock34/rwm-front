import { bool, boolean, date, number, object, string } from "yup";


export const profileEducationSchema = object({
    university: string(),
    major: string(),
    gradYear: number().min(1960)
})
