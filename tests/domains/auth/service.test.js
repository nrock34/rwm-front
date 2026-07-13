import { beforeEach, describe, expect, it, vi } from "vitest";
import { loginUser, logoutUser, refreshSession } from "../../../src/domains/auth/service.js";

/**
 * @param {(key: string) => string | undefined} getter
 * @returns {import("@sveltejs/kit").Cookies}
 */
function mockCookies(getter) {
	return {
		get: getter,
		getAll: () => [],
		set: () => {},
		delete: () => {},
		serialize: () => ""
	};
}

describe("auth service", () => {
	beforeEach(() => {
		process.env.API_URL = "https://api.example.test/";
		process.env.COOKIE_SECRET = "cookie-secret";
		process.env.ACS_JWT_SECRET = "jwt-secret";
	});

	it("maps login 403 to invalid_creds", async () => {
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({ detail: "forbidden" }), {
			status: 403,
			headers: { "content-type": "application/json" }
		}));

		const result = await loginUser({ email: "a@b.com", password: "pw" }, { fetch: fetchMock });
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.code).toBe("invalid_creds");
			expect(result.error.status).toBe(403);
		}
	});

	it("returns success data for valid login response", async () => {
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({ acs_tkn: "token" }), {
			status: 200,
			headers: {
				"content-type": "application/json",
				"set-cookie": "rfh_tkn=signed-refresh; Path=/; HttpOnly; Secure; SameSite=Lax"
			}
		}));

		const result = await loginUser({ email: "a@b.com", password: "pw" }, { fetch: fetchMock });
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data.acs_tkn).toBe("token");
		}
	});

	it("forwards the refresh cookie and accepts a rotated cookie", async () => {
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({ acs_tkn: "new-access" }), {
			status: 200,
			headers: {
				"content-type": "application/json",
				"set-cookie": "rfh_tkn=rotated-refresh; Path=/; HttpOnly; Secure; SameSite=Lax"
			}
		}));

		const result = await refreshSession({
			fetch: fetchMock,
			cookies: mockCookies((key) => (key === "rfh_tkn" ? "signed-refresh:signature" : undefined))
		});

		expect(result.ok).toBe(true);
		/** @type {unknown[] | undefined} */
		const refreshCall = fetchMock.mock.calls[0];
		const headers = /** @type {{ headers?: HeadersInit } | undefined} */ (refreshCall?.[1])?.headers;
		const requestHeaders = headers instanceof Headers ? headers : new Headers(headers);
		expect(requestHeaders.get("Cookie")).toBe("rfh_tkn=signed-refresh:signature");
	});

	it("rejects a malformed refresh cookie without contacting upstream", async () => {
		const fetchMock = vi.fn();
		const result = await refreshSession({
			fetch: fetchMock,
			cookies: mockCookies((key) => (key === "rfh_tkn" ? "bad; injected=value" : undefined))
		});

		expect(result.ok).toBe(false);
		expect(fetchMock).not.toHaveBeenCalled();
		if (!result.ok) expect(result.error.code).toBe("invalid_token");
	});

	it("rejects refresh success without a rotated refresh cookie", async () => {
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({ acs_tkn: "new-access" }), {
			status: 200,
			headers: { "content-type": "application/json" }
		}));

		const result = await refreshSession({
			fetch: fetchMock,
			cookies: mockCookies((key) => (key === "rfh_tkn" ? "signed-refresh" : undefined))
		});

		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error.code).toBe("invalid_response");
	});

	it("returns missing_refresh_token when cookie is absent", async () => {
		const result = await refreshSession({
			fetch: vi.fn(),
			cookies: mockCookies(() => undefined)
		});

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.code).toBe("missing_refresh_token");
		}
	});

	it("maps refresh non-json upstream response to upstream_error", async () => {
		const fetchMock = vi.fn(async () => new Response("<!doctype html><html></html>", {
			status: 500,
			headers: { "content-type": "text/html" }
		}));

		const result = await refreshSession({
			fetch: fetchMock,
			cookies: mockCookies((key) => (key === "rfh_tkn" ? "token" : undefined))
		});

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.code).toBe("upstream_error");
			expect(result.error.status).toBe(500);
		}
	});

	it("treats logout without refresh cookie as local success", async () => {
		const fetchMock = vi.fn();

		const result = await logoutUser({
			fetch: fetchMock,
			cookies: mockCookies(() => undefined),
			accessToken: null
		});

		expect(result.ok).toBe(true);
		expect(fetchMock).not.toHaveBeenCalled();
		if (result.ok) {
			expect(result.data.detail).toBe("Logged out successfully.");
		}
	});

	it("calls upstream logout with refresh cookie header", async () => {
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({ detail: "Logged out Successfully" }), {
			status: 200,
			headers: { "content-type": "application/json" }
		}));

		const result = await logoutUser({
			fetch: fetchMock,
			cookies: mockCookies((key) => (key === "rfh_tkn" ? "refresh-token" : undefined)),
			accessToken: "access-token"
		});

		expect(result.ok).toBe(true);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		/** @type {unknown[] | undefined} */
		const logoutCall = fetchMock.mock.calls[0];
		const headers = /** @type {{ headers?: HeadersInit } | undefined} */ (logoutCall?.[1])?.headers;
		const requestHeaders = headers instanceof Headers ? headers : new Headers(headers);
		expect(requestHeaders.get("Cookie")).toBe("rfh_tkn=refresh-token");
		expect(requestHeaders.get("Authorization")).toBe("Bearer access-token");
	});
});
