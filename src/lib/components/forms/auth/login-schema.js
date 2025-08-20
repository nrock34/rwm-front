import * as yup from "yup"
import YupPassword from 'yup-password'

YupPassword(yup)

export const schema = yup.object({
		email: yup.string()
			.email("Must be an email")
			.min(4)
			.required("Email is required"),
		password: yup.string().password()
			.min(8, "Must be at least 8 characters")
            .minNumbers(0)
            .minSymbols(0)
			.required()
	})