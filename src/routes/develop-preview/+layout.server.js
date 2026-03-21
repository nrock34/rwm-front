import { redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

/** @type {import("./$types").LayoutServerLoad} */
export const load = async () => {
	if (env.ENABLE_PREVIEW_ROUTES !== "true") {
		throw redirect(307, "/");
	}
	return {};
};
