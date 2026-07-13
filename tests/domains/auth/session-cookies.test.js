import { describe, expect, it, vi } from "vitest";
import {
	clearAuthCookies,
	passRefreshTokenCookie,
	setSignedAccessCookie
} from "../../../src/domains/auth/session-cookies.js";

describe("auth session cookies", () => {
	it("applies the upstream refresh token with app-owned security attributes", () => {
		const cookies = {
			set: vi.fn(),
			get: vi.fn(),
			getAll: vi.fn(() => []),
			delete: vi.fn(),
			serialize: vi.fn(() => "")
		};
		const headers = new Headers({
			"set-cookie": "rfh_tkn=rotated:signature; Path=/api; Max-Age=3600; SameSite=Lax"
		});

		const applied = passRefreshTokenCookie(
			/** @type {import("@sveltejs/kit").Cookies} */ (cookies),
			headers,
			{ secureOverride: true }
		);

		expect(applied).toBe(true);
		expect(cookies.set).toHaveBeenCalledWith(
			"rfh_tkn",
			"rotated:signature",
			expect.objectContaining({
				httpOnly: true,
				maxAge: 3600,
				path: "/",
				sameSite: "lax",
				secure: true
			})
		);
	});

	it("uses secure, HTTP-only cookie defaults", () => {
		process.env.COOKIE_SECRET = "cookie-secret";
		const cookies = {
			set: vi.fn(),
			get: vi.fn(),
			getAll: vi.fn(() => []),
			delete: vi.fn(),
			serialize: vi.fn(() => "")
		};

		setSignedAccessCookie(
			/** @type {import("@sveltejs/kit").Cookies} */ (cookies),
			"access-token"
		);

		expect(cookies.set).toHaveBeenCalledWith(
			"acs_tkn",
			expect.any(String),
			expect.objectContaining({
				httpOnly: true,
				path: "/",
				sameSite: "strict",
				secure: true
			})
		);
	});

	it("clears both auth cookies using matching root-path attributes", () => {
		const cookies = {
			set: vi.fn(),
			get: vi.fn(),
			getAll: vi.fn(() => []),
			delete: vi.fn(),
			serialize: vi.fn(() => "")
		};

		clearAuthCookies(
			/** @type {import("@sveltejs/kit").Cookies} */ (cookies),
			{ secure: false }
		);

		expect(cookies.delete).toHaveBeenCalledTimes(2);
		expect(cookies.delete).toHaveBeenCalledWith(
			"rfh_tkn",
			expect.objectContaining({ path: "/", secure: false })
		);
		expect(cookies.delete).toHaveBeenCalledWith(
			"acs_tkn",
			expect.objectContaining({ path: "/", secure: false })
		);
	});
});
