import { afterEach, describe, expect, it } from "vitest";
import {
	MissingEnvError,
	getAuthJwtSecret,
	getCookieSecret
} from "../../src/core/env/server.js";

const SECRET_NAMES = ["ACS_JWT_SECRET", "JWT_SECRET", "COOKIE_SECRET"];

describe("server auth environment", () => {
	afterEach(() => {
		for (const name of SECRET_NAMES) delete process.env[name];
	});

	it("fails closed when the cookie-signing secret is missing", () => {
		delete process.env.COOKIE_SECRET;
		expect(() => getCookieSecret()).toThrow(MissingEnvError);
	});

	it("fails closed when every JWT secret alias is missing", () => {
		for (const name of SECRET_NAMES) delete process.env[name];
		expect(() => getAuthJwtSecret()).toThrow(MissingEnvError);
	});

	it("uses the configured backend JWT secret", () => {
		process.env.JWT_SECRET = "configured-jwt-secret";
		expect(getAuthJwtSecret()).toBe("configured-jwt-secret");
	});
});
