import { bool, boolean, date, number, object, string } from "yup";


export const profileEducationSchema = object({
    university: string(),
    major: string(),
    grad_year: number()
        .transform((value, originalValue) => {
            if (originalValue === null || originalValue === undefined || originalValue === "") {
                return undefined;
            }

            return value;
        })
        .min(2010)
})
