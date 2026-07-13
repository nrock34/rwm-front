
import { mixed, object, string } from "yup";
import { AVATAR_CONTENT_TYPES, AVATAR_MAX_BYTES } from "$domains/profile/avatar.js";

export const profileInfoSchema = object({
    first_name: string().max(40).min(2),
    last_name: string().min(2).max(40),
    username: string().min(3).max(45),
    bio: string().max(250),
    avatar: mixed()
        .notRequired()
        .test("fileSize", "Avatar images must be 5 MB or smaller.", (value) => {
            if (!value) return true
            return value && value?.size <= AVATAR_MAX_BYTES
        })
        .test("fileType", "Avatar images must be JPEG or PNG files.", (value) => {
            if (!value) return true
            return value && AVATAR_CONTENT_TYPES.includes(value?.type)
        }),
    birthday: string().optional()
    // mixed().test(
    //     'is-date',
    //     'must be a DateValue',
    //     (value) => {
    //         return value instanceof CalendarDate || value instanceof ZonedDateTime
    //     }
    // )

})
