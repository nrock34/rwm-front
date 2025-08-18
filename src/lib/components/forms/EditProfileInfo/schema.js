
import { bool, mixed, boolean, date, object, string, number } from "yup";
import { CalendarDate, ZonedDateTime } from "@internationalized/date"

export const profileInfoSchema = object({
    first_name: string().max(40).min(2),
    last_name: string().min(2).max(40),
    username: string().min(3).max(45),
    bio: string().max(250),
    avatar: string().url(),
    birthday: mixed().test(
        'is-date',
        'must be a DateValue',
        (value) => {
            return value instanceof CalendarDate || value instanceof ZonedDateTime
        }
    )

})