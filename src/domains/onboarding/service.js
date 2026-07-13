import { asHttpFailure, buildApiUrl, createHttpFailureMapper, withBearerAuth } from "../../core/domain/http.js";
import { coerceDomainError, createDomainError } from "../../core/domain/errors.js";
import { requestJson } from "../../core/http/client.js";
import {
	mapAcademicBackgroundToEducationUpdate,
	mapGlobalBackgroundToEducationUpdate
} from "./mappers.js";

const onboardingHttpFailureMapper = createHttpFailureMapper({
	fallbackCode: "upstream_error",
	fallbackMessage: "Failed to save onboarding information.",
	network: {
		code: "network_error",
		message: "The onboarding service is unreachable.",
		status: 503
	},
	invalidResponse: {
		code: "invalid_response",
		message: "The onboarding service returned an invalid response.",
		status: 502
	}
});

/**
 * @param {unknown} value
 * @returns {import("./types.js").OnboardingDomainError}
 */
function asDomainError(value) {
	return /** @type {import("./types.js").OnboardingDomainError} */ (
		coerceDomainError(value, {
			missingEnvCode: "missing_env",
			fallbackCode: "upstream_error",
			fallbackMessage: "Unexpected onboarding failure."
		})
	);
}

/**
 * @param {import("../../core/http/client.js").HttpFailure} failure
 * @param {string} message
 * @returns {import("./types.js").OnboardingDomainError}
 */
function mapHttpFailure(failure, message) {
	return /** @type {import("./types.js").OnboardingDomainError} */ (
		onboardingHttpFailureMapper(failure, { fallbackMessage: message })
	);
}

/**
 * Saves onboarding through the two existing user-education endpoints. The
 * requests are deliberately sequential so a failure can identify exactly
 * what was persisted. The API does not expose a cross-endpoint transaction,
 * so callers receive a `partial_failure` when the second write fails.
 *
 * @param {import("./types.js").OnboardingPayload} payload
 * @param {import("./types.js").OnboardingSubmitDeps} deps
 * @returns {Promise<import("./types.js").OnboardingSubmitResult>}
 */
export async function submitOnboarding(payload, { fetch, accessToken }) {
	if (!payload.academic_background || !payload.global_background) {
		return {
			ok: false,
			error: createDomainError(
				"incomplete_draft",
				400,
				"Complete every onboarding step before continuing."
			)
		};
	}

	let educationUpdate;
	try {
		educationUpdate = mapAcademicBackgroundToEducationUpdate(payload.academic_background);
	} catch (err) {
		return {
			ok: false,
			error: createDomainError(
				"invalid_university",
				400,
				err instanceof Error ? err.message : "Choose a valid university."
			)
		};
	}

	try {
		const educationResponse = await requestJson(buildApiUrl("users/me/education"), {
			method: "PATCH",
			fetchFn: fetch,
			headers: withBearerAuth(accessToken),
			body: educationUpdate
		});

		if (!educationResponse.ok) {
			return {
				ok: false,
				error: mapHttpFailure(
					asHttpFailure(educationResponse),
					"Failed to save your academic background."
				)
			};
		}

		const globalResponse = await requestJson(buildApiUrl("users/me/gbl_education"), {
			method: "PATCH",
			fetchFn: fetch,
			headers: withBearerAuth(accessToken),
			body: mapGlobalBackgroundToEducationUpdate(payload.global_background)
		});

		if (!globalResponse.ok) {
			const cause = mapHttpFailure(
				asHttpFailure(globalResponse),
				"Failed to save your global education background."
			);
			return {
				ok: false,
				error: createDomainError(
					"partial_failure",
					cause.status,
					"Your academic background was saved, but your global education background was not. Please try again.",
					{
						completedSteps: ["academic_background"],
						failedStep: "global_background",
						cause
					}
				)
			};
		}

		return {
			ok: true,
			data: {
				completedSteps: ["academic_background", "global_background"]
			}
		};
	} catch (err) {
		return {
			ok: false,
			error: asDomainError(err)
		};
	}
}

/**
 * @param {import("./types.js").OnboardingSubmitResult} result
 * @returns {import("./types.js").OnboardingSubmitFailure}
 */
export function asOnboardingFailure(result) {
	return /** @type {import("./types.js").OnboardingSubmitFailure} */ (result);
}
