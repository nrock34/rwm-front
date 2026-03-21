import { describe, expect, it } from "vitest";
import { assertLoginResponse, assertRefreshResponse, assertRequiredAuthEnv } from "../../../src/domains/auth/contracts.js";

describe("auth contracts", () => {
	it("accepts valid login and refresh payloads", () => {
		const login = assertLoginResponse({ acs_tkn: "abc" });
		const refresh = assertRefreshResponse({ acs_tkn: "xyz", meta: true });

		expect(login.acs_tkn).toBe("abc");
		expect(refresh.acs_tkn).toBe("xyz");
	});

	it("rejects malformed login payload", () => {
		expect(() => assertLoginResponse({})).toThrow();
	});

	it("rejects malformed refresh payload", () => {
		expect(() => assertRefreshResponse({ acs_tkn: 123 })).toThrow();
	});

	it("classifies missing API_URL as missing_env", () => {
		delete process.env.API_URL;
		process.env.COOKIE_SECRET = "cookie-secret";

		try {
			assertRequiredAuthEnv();
			expect.unreachable("expected missing_env error");
		} catch (err) {
			expect(err).toMatchObject({ code: "missing_env" });
		}
	});
});
