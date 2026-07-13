import { afterEach, describe, expect, it, vi } from "vitest";
import { addContact } from "../../../src/lib/server/newsletter/add-contact.js";

describe("newsletter service", () => {
	afterEach(() => {
		delete process.env.KEILA_URL;
		delete process.env.KEILA_TKN;
	});

	it("submits a normalized contact payload over the configured endpoint", async () => {
		process.env.KEILA_URL = "https://newsletter.example.test/api/v1/contacts";
		process.env.KEILA_TKN = "newsletter-token";
		const fetchFn = vi.fn(async () => new Response(JSON.stringify({ data: { id: "contact-1" } }), {
			status: 201,
			headers: { "content-type": "application/json" }
		}));

		const result = await addContact("ada@example.test", "Ada", "Lovelace", ["website"], { fetchFn });

		expect(result).toBe("contact-1");
		expect(fetchFn).toHaveBeenCalledOnce();
		const [url, init] = fetchFn.mock.calls[0];
		expect(String(url)).toBe(process.env.KEILA_URL);
		expect(new Headers(init.headers).get("Authorization")).toBe("Bearer newsletter-token");
		expect(JSON.parse(init.body)).toEqual({
			data: {
				data: { tags: ["website"] },
				email: "ada@example.test",
				first_name: "Ada",
				last_name: "Lovelace"
			}
		});
	});

	it("fails closed when configuration is absent or insecure", async () => {
		await expect(addContact("ada@example.test")).rejects.toThrow(/not configured/u);
		process.env.KEILA_URL = "http://newsletter.example.test/api/v1/contacts";
		process.env.KEILA_TKN = "newsletter-token";
		await expect(addContact("ada@example.test")).rejects.toThrow(/HTTPS/u);
	});
});
