import { describe, expect, it } from "vitest";
import {
	getMissingRoles,
	isMissingOnlyOnboardedRole,
	ONBOARDED_ROLE
} from "../../../src/lib/auth/rbac.js";

describe("rbac onboarding helpers", () => {
	it("detects when onboarded is the only missing role", () => {
		expect(
			isMissingOnlyOnboardedRole(["member"], ["member", ONBOARDED_ROLE])
		).toBe(true);
	});

	it("does not treat onboarding as the only blocker when another role is also missing", () => {
		expect(
			getMissingRoles(["member"], ["member", ONBOARDED_ROLE, "admin"])
		).toEqual([ONBOARDED_ROLE, "admin"]);
		expect(
			isMissingOnlyOnboardedRole(["member"], ["member", ONBOARDED_ROLE, "admin"])
		).toBe(false);
	});
});
