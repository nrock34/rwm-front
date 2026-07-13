import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { signCookieValue, verifySignedCookieValue } from "../../../src/core/cookies/signed-cookie.js";
import { reconcileRequestSession } from "../../../src/lib/auth/server.js";

/**
 * @param {Record<string, string>} initial
 */
function createCookies(initial = {}) {
	const values = new Map(Object.entries(initial));
	const set = vi.fn((name, value) => values.set(name, value));
	const remove = vi.fn((name) => values.delete(name));

	return {
		values,
		set,
		delete: remove,
		cookies: /** @type {import("@sveltejs/kit").Cookies} */ ({
			get: (name) => values.get(name),
			getAll: () => Array.from(values, ([name, value]) => ({ name, value })),
			set,
			delete: remove,
			serialize: () => ""
		})
	};
}

/**
 * @param {ReturnType<typeof createCookies>["cookies"]} cookies
 * @param {typeof fetch} fetchFn
 */
function createEvent(cookies, fetchFn) {
	return /** @type {import("@sveltejs/kit").RequestEvent} */ ({
		cookies,
		fetch: fetchFn,
		locals: {},
		url: new URL("https://app.example.test/profile/dashboard")
	});
}

function accessToken(expiresInSeconds) {
	return jwt.sign(
		{ sub: "user-1", exp: Math.floor(Date.now() / 1000) + expiresInSeconds },
		"jwt-secret",
		{ algorithm: "HS256" }
	);
}

describe("request auth session reconciliation", () => {
	beforeEach(() => {
		process.env.API_URL = "https://api.example.test/";
		process.env.COOKIE_SECRET = "cookie-secret";
		process.env.ACS_JWT_SECRET = "jwt-secret";
	});

	it("does not call refresh for an anonymous request", async () => {
		const { cookies, set, delete: remove } = createCookies();
		const fetchMock = vi.fn();
		const event = createEvent(cookies, fetchMock);

		expect(await reconcileRequestSession(event)).toBeNull();
		expect(fetchMock).not.toHaveBeenCalled();
		expect(set).not.toHaveBeenCalled();
		expect(remove).not.toHaveBeenCalled();
	});

	it("uses a valid access token without refreshing", async () => {
		const token = accessToken(300);
		const { cookies } = createCookies({
			acs_tkn: signCookieValue(token, { secret: "cookie-secret" })
		});
		const fetchMock = vi.fn();
		const event = createEvent(cookies, fetchMock);

		expect(await reconcileRequestSession(event)).toBe(token);
		expect(event.locals.token).toBe(token);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("refreshes an expired access token and rotates both cookies", async () => {
		const expired = accessToken(-30);
		const replacement = accessToken(300);
		const { cookies, values, set } = createCookies({
			acs_tkn: signCookieValue(expired, { secret: "cookie-secret" }),
			rfh_tkn: "refresh:signature"
		});
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({ acs_tkn: replacement }), {
			status: 200,
			headers: {
				"content-type": "application/json",
				"set-cookie": "rfh_tkn=rotated:signature; Path=/; HttpOnly; Secure; SameSite=Lax"
			}
		}));
		const event = createEvent(cookies, fetchMock);

		expect(await reconcileRequestSession(event)).toBe(replacement);
		expect(event.locals.token).toBe(replacement);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(values.get("rfh_tkn")).toBe("rotated:signature");
		expect(
			verifySignedCookieValue(values.get("acs_tkn") ?? "", { secret: "cookie-secret" })
		).toBe(replacement);
		expect(set).toHaveBeenCalledTimes(2);
	});

	it("refreshes when the access cookie is missing but a refresh cookie exists", async () => {
		const replacement = accessToken(300);
		const { cookies } = createCookies({ rfh_tkn: "refresh:signature" });
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({ acs_tkn: replacement }), {
			status: 200,
			headers: {
				"content-type": "application/json",
				"set-cookie": "rfh_tkn=rotated:signature; Path=/; HttpOnly; Secure; SameSite=Lax"
			}
		}));

		expect(await reconcileRequestSession(createEvent(cookies, fetchMock))).toBe(replacement);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("clears local auth cookies when upstream rejects refresh", async () => {
		const { cookies, delete: remove } = createCookies({ rfh_tkn: "refresh:signature" });
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({ detail: "invalid" }), {
			status: 401,
			headers: { "content-type": "application/json" }
		}));

		expect(await reconcileRequestSession(createEvent(cookies, fetchMock))).toBeNull();
		expect(remove).toHaveBeenCalledTimes(2);
	});
});
