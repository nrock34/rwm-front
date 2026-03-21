<script>
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { ExternalLink, FileText, Video } from "lucide-svelte";
	import { getVideoEmbedUrl, isEmbeddableVideoUrl } from "$lib/components/resources/cards/resource-preview.js";

	let { resource } = $props();

	const videoEmbedUrl = $derived(resource.contentUrl ? getVideoEmbedUrl(resource.contentUrl) : null);
	const showPdfEmbed = $derived(resource.type === "pdf" && Boolean(resource.contentUrl));
	const showVideoEmbed = $derived(resource.type === "video" && Boolean(resource.contentUrl));
	const showPageContent = $derived(resource.type === "page" && Boolean(resource.pageContent));
	const showHtmlContent = $derived(resource.type !== "page" && Boolean(resource.content) && !resource.contentUrl);
	const showExternalLinkCard = $derived((resource.type === "link" || resource.type === "interactive") && Boolean(resource.contentUrl));
	const sectionTitle = $derived.by(() => {
		if (showPdfEmbed) return "Document Preview";
		if (showVideoEmbed) return "Video Preview";
		if (showPageContent) return "Page Content";
		if (showHtmlContent) return "Resource Content";
		if (showExternalLinkCard) return "External Resource";
		return "Resource Overview";
	});
</script>

<Card.Root class="overflow-hidden border-border/70 bg-card/95 p-0 shadow-sm">
	<div class="border-b border-border/70 bg-secondary/15 px-6 py-4">
		<p class="text-xs uppercase tracking-[0.2em] text-primary/80">{resource.typeLabel}</p>
		<h2 class="mt-1 text-xl font-semibold text-foreground sm:text-2xl">{sectionTitle}</h2>
	</div>

	{#if showPdfEmbed}
		<div class="border-t border-border/60 bg-background">
			<iframe
				title={`${resource.title} PDF preview`}
				src={resource.contentUrl}
				class="h-[82svh] w-full"
			></iframe>
		</div>
	{:else if showVideoEmbed}
		<div class="bg-black">
			{#if isEmbeddableVideoUrl(resource.contentUrl) && videoEmbedUrl}
				<iframe
					title={`${resource.title} video preview`}
					src={videoEmbedUrl}
					class="aspect-video w-full"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
			{:else}
				<video class="aspect-video w-full" controls src={resource.contentUrl}></video>
			{/if}
		</div>
	{:else if showPageContent}
		<div class="px-6 py-6">
			<div class="prose prose-neutral max-w-none text-foreground/90">
				{@html resource.pageContent}
			</div>
		</div>
	{:else if showHtmlContent}
		<div class="px-6 py-6">
			<div class="prose prose-neutral max-w-none text-foreground/90">
				{@html resource.content}
			</div>
		</div>
	{:else if showExternalLinkCard}
		<div class="px-6 py-6">
			<div class="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/20 p-5">
				<FileText class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">
						This resource lives on an external site, so there is no inline preview here. Use the action below to open the original page.
					</p>
					<Button href={resource.contentUrl} target="_blank" rel="noreferrer" class="w-fit">
						<ExternalLink class="h-4 w-4" />
						Open External Resource
					</Button>
				</div>
			</div>
		</div>
	{:else}
		<div class="px-6 py-6">
			<div class="flex items-start gap-3 rounded-2xl border border-dashed border-border/70 bg-background/80 p-5">
				<Video class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
				<div>
					<p class="font-medium text-foreground">No embedded preview is available yet.</p>
					<p class="mt-1 text-sm text-muted-foreground">
						Use the actions in the sidebar to open the resource directly.
					</p>
				</div>
			</div>
		</div>
	{/if}
</Card.Root>
