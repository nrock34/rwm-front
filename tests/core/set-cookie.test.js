import { describe, expect, it } from "vitest";
import { getSetCookieValues, parseSetCookieHeader } from "../../src/core/cookies/set-cookie.js";

describe("set-cookie parser", () => {
	it("parses multiple cookies and preserves Expires commas", () => {
		const header = "rfh_tkn=abc; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Wed, 21 Oct 2015 07:28:00 GMT, theme=light; Path=/; SameSite=Lax";
		const parsed = parseSetCookieHeader(header);

		expect(parsed).toHaveLength(2);
		expect(parsed[0]?.key).toBe("rfh_tkn");
		expect(parsed[0]?.options.httpOnly).toBe(true);
		expect(parsed[0]?.options.secure).toBe(true);
		expect(parsed[0]?.options.sameSite).toBe("strict");
		expect(parsed[1]?.key).toBe("theme");
		expect(parsed[1]?.options.sameSite).toBe("lax");
	});

	it("extracts set-cookie values from standard headers", () => {
		const headers = new Headers({
			"set-cookie": "rfh_tkn=abc; Path=/; HttpOnly, theme=light; Path=/"
		});
		const values = getSetCookieValues(headers);
		expect(values).toHaveLength(2);
		expect(values[0]).toContain("rfh_tkn=abc");
		expect(values[1]).toContain("theme=light");
	});
});
