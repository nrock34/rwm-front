import { addContact } from "$lib/server/newsletter/add-contact";
import { fail } from "@sveltejs/kit";


export const newsletterSignup = async ({cookies, request}) => {
    const data = await request.formData();
    const result = await addContact(data.get('email'));

    if (result.errors) {
        console.log('something')
        return fail(422, {
            error: result.errors[0].title,
            description: result.errors[0].detail
        })
    } else {
        return {
            status: 'success',
            id: result
        }
    }
}