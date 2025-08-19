
import { bool, mixed, boolean, date, object, string, number } from "yup";
import { CalendarDate, ZonedDateTime } from "@internationalized/date"
import { yup } from "sveltekit-superforms/adapters";

export const profileInfoSchema = object({
    first_name: string().max(40).min(2),
    last_name: string().min(2).max(40),
    username: string().min(3).max(45),
    bio: string().max(250),
    avatar: mixed()
        .test("fileSize", "file size to large", (value) => {
            console.log(value.type)
            return value && value?.size <= 10 * 1024 * 1024
        })
        .test("fileType", "unsupported file format", (value) => {
            return value && ["image/jpeg", "image/png"].includes(value?.type)
        }).optional(),
    birthday: string().optional()
    // mixed().test(
    //     'is-date',
    //     'must be a DateValue',
    //     (value) => {
    //         return value instanceof CalendarDate || value instanceof ZonedDateTime
    //     }
    // )

})