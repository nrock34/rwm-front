<script>
	import * as Card from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import ResourcePreviewDialog from "./ResourcePreviewDialog.svelte";
	import { Eye, FileText, Heart, LinkIcon, LoaderCircle, Map, Star, Video } from "lucide-svelte";
	import ResilientImage from "$lib/components/shared/ResilientImage.svelte";
	import {
		fetchResourcePreviewData,
		supportsResourcePreview,
		usesDirectContentAction
	} from "./resource-preview.js";

	let { resource } = $props();

	let openingSource = $state(false);

	function getTypeIcon(type) {
		switch (type) {
			case "video":
				return Video;
			case "link":
				return LinkIcon;
			case "interactive":
			case "page":
				return Map;
			default:
				return FileText;
		}
	}

	async function openResourceAction() {
		if (!usesDirectContentAction(resource.type)) {
			window.location.assign(resource.href);
			return;
		}

		openingSource = true;
		try {
			const payload = await fetchResourcePreviewData(resource.id);
			const targetUrl = payload.resource.contentUrl ?? resource.href;
			window.location.assign(targetUrl);
		} catch {
			window.location.assign(resource.href);
		} finally {
			openingSource = false;
		}
	}

	const TypeIcon = $derived(getTypeIcon(resource.type));
	const showPreview = $derived(supportsResourcePreview(resource.type));
</script>

<Card.Root class={`p-6 ${resource.featured ? "ring-2 ring-ring/30" : ""}`}>
		<div class="flex items-start space-x-4">
			{#if resource.thumbnail}
				<ResilientImage
					src={resource.thumbnail}
					fallbackSrc={null}
					alt={resource.title}
					class="h-20 w-20 flex-shrink-0 rounded object-cover"
					hideOnError={true}
				/>
			{/if}

		<div class="flex-1">
			<div class="mb-2 flex items-start justify-between">
				<div class="flex-1">
					<div class="mb-1 flex items-center space-x-2">
						<a href={resource.href} class="font-semibold text-foreground hover:underline">{resource.title}</a>
						{#if resource.featured}
							<Badge>Featured</Badge>
						{/if}
						<Badge>
							<TypeIcon class="mr-1 h-3 w-3" />
							{resource.typeLabel}
						</Badge>
					</div>
					<p class="mb-1 text-xs text-muted-foreground">by <span class="ml-0.5 text-secondary-foreground">{resource.author.name}</span></p>
					<div class="mb-2 flex items-center space-x-1">
						<Star class="h-4 w-4 fill-current text-yellow-500" />
						<span class="text-xs font-medium">{resource.rating}</span>
						<span class="text-xs text-muted-foreground">({resource.views} views)</span>
					</div>
				</div>
			</div>

			<p class="mb-3 text-sm text-secondary-foreground">{resource.description}</p>

			<div class="mb-3 grid gap-3 text-xs text-muted-foreground md:grid-cols-3">
				<div class="flex items-center space-x-1">
					<Eye class="h-3 w-3" />
					<span>{resource.views} views</span>
				</div>
				<div class="flex items-center space-x-1">
					<FileText class="h-3 w-3" />
					<span>{resource.categoryLabel}</span>
				</div>
				<div class="flex items-center space-x-1">
					<TypeIcon class="h-3 w-3" />
					<span>{resource.typeLabel}</span>
				</div>
			</div>

			<div class="mb-3 flex flex-wrap gap-1.5">
				{#each resource.tags as tag}
					<span class="rounded-xl border-1 p-0.5 px-2 text-xs font-semibold">#{tag}</span>
				{/each}
			</div>

			<div class="flex items-center justify-between">
				<span class="text-xs text-muted-foreground">
					{#if resource.lastUpdated}
						Updated {new Date(resource.lastUpdated).toLocaleDateString()}
					{/if}
				</span>
				<div class="flex space-x-2">
					<Button class="border border-primary px-8 py-6 text-xs">
						<Heart class="mr-1 h-3 w-3" />
						Save
					</Button>
					<Button onclick={openResourceAction} type="button" variant="secondary" class="border border-ring px-8 py-6 text-xs" disabled={openingSource}>
						{#if openingSource}
							<LoaderCircle class="mr-1 h-3 w-3 animate-spin" />
						{/if}
						{resource.primaryActionLabel}
					</Button>
					{#if showPreview}
						<ResourcePreviewDialog {resource} />
					{/if}
				</div>
			</div>
		</div>
	</div>
</Card.Root>
