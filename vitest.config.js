import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
	plugins: [sveltekit()],
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
