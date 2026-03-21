<script>
	import ResourceContentPanel from "$lib/components/resources/detail/ResourceContentPanel.svelte";
	import RelatedResourceCard from "$lib/components/resources/detail/RelatedResourceCard.svelte";
	import ResourceSidebarCard from "$lib/components/resources/detail/ResourceSidebarCard.svelte";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeft, BookOpen, Tag } from "lucide-svelte";

	let { data } = $props();
	const resource = $derived(data.resource);
	const relatedResources = $derived(data.relatedResources);
</script>

<div class="page-shell mx-auto w-full px-6 py-8 sm:px-10 md:px-16 lg:py-12">
	<div class="space-y-4">
		<Button href="/resources" variant="ghost" class="w-fit">
			<ArrowLeft class="h-4 w-4" />
			Back to Resources
		</Button>

		<div class="max-w-4xl space-y-3">
			<p class="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-primary/80">
				<BookOpen class="h-4 w-4" />
				Resources Library
			</p>
			<h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{resource.title}</h1>
			<p class="text-sm leading-6 text-muted-foreground sm:text-base">
				{resource.description}
			</p>
			<div class="flex flex-wrap items-center gap-2">
				<span class="inline-flex items-center rounded-full border border-border/70 bg-secondary/20 px-3 py-1 text-sm font-medium text-foreground">
					{resource.categoryLabel}
				</span>
				<span class="inline-flex items-center rounded-full border border-border/70 bg-secondary/20 px-3 py-1 text-sm font-medium text-foreground">
					{resource.typeLabel}
				</span>
				{#if resource.tags.length > 0}
					{#each resource.tags as tag}
						<span class="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs font-medium text-foreground">
							<Tag class="h-3 w-3 text-primary" />
							{tag}
						</span>
					{/each}
				{/if}
			</div>
		</div>
	</div>

	<div class="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_18rem] xl:grid-cols-[minmax(0,1.45fr)_19rem]">
		<div class="space-y-6">
			<ResourceContentPanel {resource} />

			{#if relatedResources.length > 0}
				<section class="space-y-4">
					<div class="space-y-1">
						<h2 class="text-2xl font-semibold text-foreground">Related Resources</h2>
						<p class="text-sm text-muted-foreground">
							A few smaller recommendations from the same part of the library, kept secondary so the main resource stays the focus.
						</p>
					</div>
					<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{#each relatedResources as related (related.id)}
							<RelatedResourceCard resource={related} />
						{/each}
					</div>
				</section>
			{/if}
		</div>

		<ResourceSidebarCard {resource} />
	</div>
</div>
