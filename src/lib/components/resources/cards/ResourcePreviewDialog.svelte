<script>
	import { Badge } from "$lib/components/ui/badge";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import { FileText, LoaderCircle, TriangleAlert, Video } from "lucide-svelte";
	import {
		fetchResourcePreviewData,
		getVideoEmbedUrl,
		isEmbeddableVideoUrl
	} from "./resource-preview.js";

	let { resource } = $props();

	let open = $state(false);
	let preview = $state(null);
	let previewError = $state("");
	let loadingPreview = $state(false);

	async function ensurePreviewLoaded() {
		if (preview || loadingPreview) return;
		loadingPreview = true;
		previewError = "";

		try {
			const payload = await fetchResourcePreviewData(resource.id);
			preview = payload.resource;
		} catch (err) {
			previewError = err instanceof Error ? err.message : "Failed to load preview.";
		} finally {
			loadingPreview = false;
		}
	}

	$effect(() => {
		if (open) {
			void ensurePreviewLoaded();
		}
	});

	const previewContentUrl = $derived(preview?.contentUrl ?? null);
	const previewPageContent = $derived(preview?.pageContent ?? null);
	const videoEmbedUrl = $derived(previewContentUrl ? getVideoEmbedUrl(previewContentUrl) : null);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: "secondary" })}>
		Preview
	</Dialog.Trigger>
	<Dialog.Content class="max-w-5xl gap-5 sm:p-6">
		<div class="space-y-5">
			<div class="space-y-2">
				<div class="flex flex-wrap items-center gap-2">
					<h2 class="text-xl font-semibold text-foreground">{resource.title}</h2>
					<Badge>{resource.typeLabel}</Badge>
					<Badge variant="outline">{resource.categoryLabel}</Badge>
				</div>
				<p class="text-sm text-secondary-foreground">{resource.description}</p>
			</div>

			{#if loadingPreview}
				<div class="flex min-h-80 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20">
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<LoaderCircle class="h-4 w-4 animate-spin" />
						Loading preview...
					</div>
				</div>
			{:else if previewError}
				<div class="flex min-h-80 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-destructive/40 bg-destructive/5 p-6 text-center">
					<TriangleAlert class="h-6 w-6 text-destructive" />
					<p class="max-w-md text-sm text-muted-foreground">{previewError}</p>
					<Button href={resource.href} variant="outline">Open resource page</Button>
				</div>
			{:else if resource.type === "pdf" && previewContentUrl}
				<div class="overflow-hidden rounded-lg border border-border/70">
					<iframe
						title={`${resource.title} PDF preview`}
						src={previewContentUrl}
						class="h-[70svh] w-full"
					></iframe>
				</div>
			{:else if resource.type === "video" && previewContentUrl}
				<div class="overflow-hidden rounded-lg border border-border/70 bg-black">
					{#if isEmbeddableVideoUrl(previewContentUrl) && videoEmbedUrl}
						<iframe
							title={`${resource.title} video preview`}
							src={videoEmbedUrl}
							class="aspect-video w-full"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						></iframe>
					{:else}
						<video class="aspect-video w-full" controls src={previewContentUrl}></video>
					{/if}
				</div>
			{:else if resource.type === "page" && previewPageContent}
				<div class="prose max-w-none rounded-lg border border-border/70 p-6 prose-sm text-foreground/90">
					{@html previewPageContent}
				</div>
			{:else}
				<div class="flex min-h-80 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/70 bg-muted/20 p-6 text-center">
					{#if resource.type === "page"}
						<FileText class="h-6 w-6 text-muted-foreground" />
						<p class="max-w-md text-sm text-muted-foreground">This page resource does not have preview content yet.</p>
					{:else}
						<Video class="h-6 w-6 text-muted-foreground" />
						<p class="max-w-md text-sm text-muted-foreground">A preview is not available for this resource.</p>
					{/if}
				</div>
			{/if}

			<div class="flex flex-wrap gap-3 pt-1">
				<Button href={resource.href} variant="outline">Open resource page</Button>
				{#if previewContentUrl}
					<Button href={previewContentUrl} target="_blank" rel="noreferrer">Open source</Button>
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
