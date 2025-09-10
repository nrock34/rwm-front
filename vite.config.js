import { sentrySvelteKit } from "@sentry/sveltekit";
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
	plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "romewithme",
            project: "javascript-sveltekit"
        }
    }), tailwindcss(), enhancedImages(), sveltekit(), visualizer({
        emitFile: true,
        //filename: './build/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
    })],
	optimizeDeps: {
		exclude: ['svelte-sonner']
	}
});