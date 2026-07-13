import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitOnboarding } from "../../../src/domains/onboarding/service.js";

function buildPayload() {
	return {
		academic_background: {
			student_level: "grad",
			university_id: 42,
			university_name: null,
			major: "History",
			graduation_year: 2028
		},
		global_background: {
			travel_experience: "4to7",
			has_traveled_edu: true,
			other_language_spoken: "Italian",
			interested_regions: ["seurope"]
		},
		completed_steps: ["academic_background", "global_background"]
	};
}

describe("onboarding service", () => {
	beforeEach(() => {
		process.env.API_URL = "https://api.example.test/v1/";
	});

	it("persists both onboarding steps through the supported education endpoints", async () => {
		const fetchMock = vi.fn(async () => new Response("{}", {
			status: 200,
			headers: { "content-type": "application/json" }
		}));

		const result = await submitOnboarding(buildPayload(), {
			fetch: fetchMock,
			accessToken: "viewer-token"
		});

		expect(result.ok).toBe(true);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		const educationCall = fetchMock.mock.calls[0];
		const globalCall = fetchMock.mock.calls[1];
		expect(String(educationCall?.[0])).toBe("https://api.example.test/v1/users/me/education");
		expect(String(globalCall?.[0])).toBe("https://api.example.test/v1/users/me/gbl_education");
		expect(JSON.parse(String(educationCall?.[1]?.body))).toEqual({
			university: 42,
			major: "History",
			year: 2028
		});
		expect(JSON.parse(String(globalCall?.[1]?.body))).toEqual({
			went_abroad: true
		});
		expect(new Headers(educationCall?.[1]?.headers).get("Authorization"))
			.toBe("Bearer viewer-token");
	});

	it("reports a partial write when global education fails after academics save", async () => {
		const fetchMock = vi.fn(async (url) => {
			if (String(url).endsWith("/gbl_education")) {
				return new Response(JSON.stringify({ detail: "try again" }), {
					status: 503,
					headers: { "content-type": "application/json" }
				});
			}
			return new Response("{}", {
				status: 200,
				headers: { "content-type": "application/json" }
			});
		});

		const result = await submitOnboarding(buildPayload(), {
			fetch: fetchMock,
			accessToken: "viewer-token"
		});

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.code).toBe("partial_failure");
			expect(result.error.status).toBe(503);
			expect(result.error.details).toMatchObject({
				completedSteps: ["academic_background"],
				failedStep: "global_background"
			});
		}
	});

	it("rejects a free-text university that the current API cannot persist", async () => {
		const fetchMock = vi.fn();
		const payload = buildPayload();
		payload.academic_background.university_id = null;
		payload.academic_background.university_name = "Unlisted University";

		const result = await submitOnboarding(payload, {
			fetch: fetchMock,
			accessToken: "viewer-token"
		});

		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error.code).toBe("invalid_university");
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
