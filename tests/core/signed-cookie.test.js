import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { signCookieValue, verifyJwtNotExpired, verifySignedCookieValue } from "../../src/core/cookies/signed-cookie.js";

describe("signed-cookie", () => {
	it("verifies a valid signed value", () => {
		process.env.COOKIE_SECRET = "test-cookie-secret";
		const signed = signCookieValue("token-value");
		expect(verifySignedCookieValue(signed)).toBe("token-value");
	});

	it("rejects a tampered signed value", () => {
		process.env.COOKIE_SECRET = "test-cookie-secret";
		const signed = signCookieValue("token-value");
		const tampered = `${signed}x`;
		expect(verifySignedCookieValue(tampered)).toBeUndefined();
	});

	it("falls back when COOKIE_SECRET is missing", () => {
		delete process.env.COOKIE_SECRET;
		const signed = signCookieValue("token-value");
		expect(verifySignedCookieValue(signed)).toBe("token-value");
	});

	it("returns false when jwt is expired", () => {
		process.env.ACS_JWT_SECRET = "jwt-secret";
		const token = jwt.sign({ sub: "1", exp: Math.floor(Date.now() / 1000) - 10 }, process.env.ACS_JWT_SECRET);
		expect(verifyJwtNotExpired(token)).toBe(false);
	});
});
