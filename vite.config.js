import { sentrySvelteKit } from "@sentry/sveltekit";
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
    const shouldAnalyze = mode === "analyze" || process.env.ANALYZE === "true";
    return {
	plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "romewithme",
            project: "javascript-sveltekit"
        }
    }), tailwindcss(), enhancedImages(), sveltekit(), ...(shouldAnalyze ? [visualizer({
        emitFile: true,
        filename: 'bundle-stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
    })] : [])],
	optimizeDeps: {
		exclude: ['svelte-sonner']
	}
    };
});
