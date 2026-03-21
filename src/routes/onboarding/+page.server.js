import { fail, superValidate } from "sveltekit-superforms";
import { error, redirect } from "@sveltejs/kit";
import { yup } from "sveltekit-superforms/adapters";
import { parse as parseDevalue } from "devalue";
import {
	academicBackgroundSchema,
	createAcademicBackgroundDefaults,
	createGlobalBackgroundDefaults,
	getOnboardingStep,
	globalBackgroundSchema,
	listOnboardingSteps,
	mapAcademicBackgroundStep,
	mapGlobalBackgroundStep,
	mapOnboardingDraftToPayload
} from "$domains/onboarding/index.js";
import { sanitizeRelativeRedirectTarget } from "$lib/auth/redirect.js";
import { resolveApiUrl } from "../../core/env/server.js";
import { requestJson } from "../../core/http/client.js";

const ONBOARDING_TEST_SUCCESS_COOKIE = "onboarding_test_success_payload";

/**
 * @param {FormDataEntryValue | null} value
 * @returns {import("$domains/onboarding/index.js").OnboardingAcademicBackgroundPayload | null}
 */
function parseAcademicPayload(value) {
	if (typeof value !== "string" || value.length === 0) return null;

	try {
		const parsed = JSON.parse(value);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

		return /** @type {import("$domains/onboarding/index.js").OnboardingAcademicBackgroundPayload} */ (parsed);
	} catch {
		return null;
	}
}

/**
 * @param {unknown} value
 * @returns {import("$domains/onboarding/index.js").OnboardingAcademicBackgroundPayload | null}
 */
function coerceAcademicPayload(value) {
	const directPayload = parseAcademicPayload(
		typeof value === "string" ? value : null
	);
	if (directPayload) return directPayload;

	if (!value || typeof value !== "object" || Array.isArray(value)) return null;

	return /** @type {import("$domains/onboarding/index.js").OnboardingAcademicBackgroundPayload} */ (value);
}

/**
 * @param {FormData} formData
 * @returns {import("$domains/onboarding/index.js").OnboardingAcademicBackgroundPayload | null}
 */
function readAcademicPayloadFromFormData(formData) {
	const directPayload = coerceAcademicPayload(formData.get("academicPayload"));
	if (directPayload) return directPayload;

	const jsonChunks = formData.getAll("__superform_json");
	if (jsonChunks.length === 0) return null;

	const serializedPayload = jsonChunks
		.filter((value) => typeof value === "string")
		.join("");

	if (!serializedPayload) return null;

	try {
		const parsed = parseDevalue(serializedPayload);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

		return coerceAcademicPayload(
			"academicPayload" in parsed ? parsed.academicPayload : null
		);
	} catch {
		return null;
	}
}

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ url, fetch }) => {
	const redirectTo = sanitizeRelativeRedirectTarget(
		url.searchParams.get("redirectTo"),
		"/profile/dashboard"
	);
	const universityListResponse = await requestJson(resolveApiUrl("universities/selectlist"), {
		fetchFn: fetch
	});

	if (!universityListResponse.ok) {
		throw error(
			universityListResponse.status || 500,
			"Failed to load universities."
		);
	}

	return {
		form: await superValidate(
			createAcademicBackgroundDefaults(),
			yup(academicBackgroundSchema),
			{ errors: false }
		),
		GlobalBackgroundForm: await superValidate(
			createGlobalBackgroundDefaults(),
			yup(globalBackgroundSchema),
			{ errors: false }
		),
		steps: listOnboardingSteps(),
		currentStep: getOnboardingStep("academic_background"),
		redirectTo,
		universityList: Array.isArray(universityListResponse.data) ? universityListResponse.data : []
	};
};

/** @type {import("./$types").Actions} */
export const actions = {
	academicBackground: async ({ request }) => {
		const form = await superValidate(request, yup(academicBackgroundSchema));
		if (!form.valid) return fail(400, { form });

		const academicStep = mapAcademicBackgroundStep(form.data);

		return {
			form,
			success: true,
			nextForm: true,
			currentStep: getOnboardingStep("global_background"),
			onboardingDraft: mapOnboardingDraftToPayload({
				academicBackground: academicStep,
				globalBackground: null
			}),
			GlobalBackgroundForm: await superValidate(
				createGlobalBackgroundDefaults(),
				yup(globalBackgroundSchema),
				{ errors: false }
			)
		};
	},

	globalBackground: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const academicBackground = readAcademicPayloadFromFormData(formData);
		const form = await superValidate(formData, yup(globalBackgroundSchema));
		if (!form.valid) return fail(400, { form });

		const globalStep = mapGlobalBackgroundStep(form.data);
		const payload = mapOnboardingDraftToPayload({
			academicBackground,
			globalBackground: globalStep
		});
		const isHttps = url.protocol === "https:";

		cookies.set(ONBOARDING_TEST_SUCCESS_COOKIE, JSON.stringify(payload), {
			path: "/onboarding",
			httpOnly: true,
			sameSite: "lax",
			secure: isHttps,
			maxAge: 60 * 10
		});

		throw redirect(303, "/onboarding/test-success");
	}
};
