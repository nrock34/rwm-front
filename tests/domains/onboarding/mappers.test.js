import { describe, expect, it } from "vitest";
import {
	academicBackgroundSchema,
	globalBackgroundSchema,
	mapAcademicBackgroundStep,
	mapGlobalBackgroundStep,
	mapOnboardingDraftToPayload,
	mergeOnboardingStep,
	ONBOARDING_STEP_IDS
} from "../../../src/domains/onboarding/index.js";

describe("onboarding mapping and validation", () => {
	it("maps academic form data into a backend-ready payload", async () => {
		const validInput = await academicBackgroundSchema.validate({
			studentLevel: "grad",
			university: "42",
			major: "History",
			year: "2028"
		});

		const step = mapAcademicBackgroundStep(validInput);
		expect(step).toEqual({
			student_level: "grad",
			university_id: 42,
			university_name: null,
			major: "History",
			graduation_year: 2028
		});
	});

	it("accepts a single-digit university id from the select list", async () => {
		const validInput = await academicBackgroundSchema.validate({
			studentLevel: "ungrd",
			university: "7",
			major: "Biology",
			year: new Date().getFullYear()
		});

		expect(validInput.university).toBe("7");
	});

	it("maps global form data and derives completed steps from a merged draft", async () => {
		const academicDraft = mergeOnboardingStep(
			{},
			ONBOARDING_STEP_IDS.academic,
			{
				studentLevel: "ungrd",
				university: "Sapienza University",
				major: "Art History",
				year: 2027
			}
		);

		const globalInput = await globalBackgroundSchema.validate({
			travelExperience: "4to7",
			hasTraveledEdu: true,
			otherLanguageSpoken: " Italian ",
			interestedRegions: ["seurope", "easia"]
		});
		const draft = mergeOnboardingStep(
			academicDraft,
			ONBOARDING_STEP_IDS.global,
			globalInput
		);
		const payload = mapOnboardingDraftToPayload(draft);

		expect(payload.completed_steps).toEqual([
			ONBOARDING_STEP_IDS.academic,
			ONBOARDING_STEP_IDS.global
		]);
		expect(payload.global_background).toEqual({
			travel_experience: "4to7",
			has_traveled_edu: true,
			other_language_spoken: "Italian",
			interested_regions: ["seurope", "easia"]
		});
	});
});
