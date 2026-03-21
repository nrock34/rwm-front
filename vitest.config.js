import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"$env/dynamic/private": resolve(__dirname, "tests/mocks/env-dynamic-private.js")
		}
	},
	test: {
		environment: "node",
		include: ["tests/**/*.test.js"],
		coverage: {
			reporter: ["text", "html"]
		}
	}
});
