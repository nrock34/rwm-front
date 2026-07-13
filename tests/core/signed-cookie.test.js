import jwt from "jsonwebtoken";
import { afterEach, describe, expect, it } from "vitest";
import { signCookieValue, verifyJwtNotExpired, verifySignedCookieValue } from "../../src/core/cookies/signed-cookie.js";

describe("signed-cookie", () => {
	afterEach(() => {
		delete process.env.COOKIE_SECRET;
		delete process.env.ACS_JWT_SECRET;
		delete process.env.JWT_SECRET;
	});

	it("verifies a valid signed value", () => {
		const signed = signCookieValue("token-value", { secret: "test-cookie-secret" });
		expect(verifySignedCookieValue(signed, { secret: "test-cookie-secret" })).toBe("token-value");
	});

	it("rejects a tampered signed value", () => {
		const signed = signCookieValue("token-value", { secret: "test-cookie-secret" });
		const tampered = `${signed}x`;
		expect(verifySignedCookieValue(tampered, { secret: "test-cookie-secret" })).toBeUndefined();
	});

	it("fails closed when COOKIE_SECRET is missing", () => {
		delete process.env.COOKIE_SECRET;
		expect(() => signCookieValue("token-value")).toThrow(/COOKIE_SECRET/u);
	});

	it("rejects a value with an appended signature segment", () => {
		const signed = signCookieValue("token-value", { secret: "test-cookie-secret" });
		expect(
			verifySignedCookieValue(`${signed}....extra`, { secret: "test-cookie-secret" })
		).toBeUndefined();
	});

	it("returns false when jwt is expired", () => {
		const token = jwt.sign({ sub: "1", exp: Math.floor(Date.now() / 1000) - 10 }, "jwt-secret");
		expect(verifyJwtNotExpired(token, { secret: "jwt-secret" })).toBe(false);
	});

	it("rejects JWT algorithms other than HS256", () => {
		const token = jwt.sign({ sub: "1" }, "jwt-secret", { algorithm: "HS512" });
		expect(verifyJwtNotExpired(token, { secret: "jwt-secret" })).toBe(false);
	});
});
