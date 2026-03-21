<script>
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import { Eye, ExternalLink, FileText, Star, Tag, Video } from "lucide-svelte";

	let { resource } = $props();

	function getTypeIcon(type) {
		switch (type) {
			case "video":
				return Video;
			default:
				return FileText;
		}
	}

	const TypeIcon = $derived(getTypeIcon(resource.type));
	const primaryHref = $derived(resource.contentUrl ?? resource.href);
	const showOpenSource = $derived(Boolean(resource.contentUrl));
</script>

<div class="space-y-4 lg:sticky lg:top-24">
	<Card.Root class="gap-5 border-border/70 bg-card/95 p-5 shadow-sm">
		<div class="space-y-3">
			<div class="flex flex-wrap items-center gap-2">
				<Badge>{resource.categoryLabel}</Badge>
				<Badge variant="outline">
					<TypeIcon class="mr-1 h-3.5 w-3.5" />
					{resource.typeLabel}
				</Badge>
			</div>
			<div class="rounded-xl border border-border/60 bg-secondary/25 px-3 py-3 text-sm text-muted-foreground">
				<p class="font-medium text-foreground">Prepared by {resource.author.name}</p>
				<p class="mt-1">Use the primary action to open the original source or continue reading below.</p>
			</div>
		</div>

		<div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
			<div class="rounded-xl border border-border/60 bg-background/80 px-3 py-3">
				<p class="text-xs uppercase tracking-[0.18em] text-muted-foreground">Rating</p>
				<p class="mt-2 flex items-center gap-2 text-lg font-semibold text-foreground">
					<Star class="h-4 w-4 fill-yellow-500 text-yellow-500" />
					{resource.rating}
				</p>
			</div>
			<div class="rounded-xl border border-border/60 bg-background/80 px-3 py-3">
				<p class="text-xs uppercase tracking-[0.18em] text-muted-foreground">Views</p>
				<p class="mt-2 flex items-center gap-2 text-lg font-semibold text-foreground">
					<Eye class="h-4 w-4 text-primary" />
					{resource.views}
				</p>
			</div>
			<div class="rounded-xl border border-border/60 bg-background/80 px-3 py-3">
				<p class="text-xs uppercase tracking-[0.18em] text-muted-foreground">Format</p>
				<p class="mt-2 text-lg font-semibold text-foreground">{resource.typeLabel}</p>
			</div>
		</div>

		{#if resource.tags.length > 0}
			<div class="space-y-2">
				<p class="text-xs uppercase tracking-[0.18em] text-muted-foreground">Topics</p>
				<div class="flex flex-wrap gap-2">
					{#each resource.tags as tag}
						<span class="inline-flex items-center gap-1 rounded-full border border-border/70 bg-secondary/15 px-2.5 py-1 text-xs font-medium text-foreground">
							<Tag class="h-3 w-3 text-primary" />
							{tag}
						</span>
					{/each}
				</div>
			</div>
		{/if}

		<div class="space-y-2">
			<Button href={primaryHref} target={resource.contentUrl ? "_blank" : undefined} rel={resource.contentUrl ? "noreferrer" : undefined} class="w-full">
				{resource.primaryActionLabel}
			</Button>
			{#if showOpenSource}
				<Button href={resource.contentUrl} target="_blank" rel="noreferrer" variant="outline" class="w-full">
					<ExternalLink class="h-4 w-4" />
					Open Source
				</Button>
			{/if}
		</div>
	</Card.Root>
</div>
