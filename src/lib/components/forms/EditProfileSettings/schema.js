
import { object, ref, string } from "yup";

export const profileSettingsSchema = object({
    email: string().email("Must be a valid email").required("Email is required"),
    first_name: string().min(2, "First name is too short").max(40, "First name is too long").required("First name is required"),
    last_name: string().min(2, "Last name is too short").max(40, "Last name is too long").required("Last name is required"),
    username: string().min(3).max(45).required()
});

export const passwordChangeSchema = object({
    old_pwd: string().min(8, "Current password is required").required("Current password is required"),
    new_pwd1: string().min(8, "New password must be at least 8 characters").required("New password is required"),
    new_pwd2: string()
        .oneOf([ref("new_pwd1")], "Passwords must match")
        .required("Please confirm your new password")
});
