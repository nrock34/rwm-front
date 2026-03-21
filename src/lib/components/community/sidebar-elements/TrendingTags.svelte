<script>
	import * as Card from "$lib/components/ui/card";
	import { communityTrendingTags } from "$lib/mocks/community.js";
	import { TrendingUp } from "lucide-svelte";

	let { tags = communityTrendingTags } = $props();
</script>

<Card.Root class="gap-2 px-4 py-5 sm:gap-3 sm:px-6">
	<Card.Header class="flex items-center p-0">
		<TrendingUp class="h-4 w-4 text-primary/80 sm:h-6 sm:w-6" />
		<h3 class="text-sm font-semibold text-foreground">Trending Topics</h3>
	</Card.Header>
	<Card.Content class="space-y-0.5 p-0 sm:space-y-1.5">
		{#each tags as tag}
				<a href={`/community/posts?tag=${encodeURIComponent(tag.tag)}`} class="flex items-center rounded-(--radius) hover:bg-border/15">
					<span class="text-micro-xs pr-1.5 sm:pr-2 sm:text-xs">#</span>
					<div class="flex w-full items-center justify-between">
						<span class="text-meta-xs pr-4 font-medium text-accent-foreground sm:text-xs md:text-action-sm lg:text-sm">{tag.tag}</span>
						<span class="text-micro-xs text-muted-foreground sm:text-meta-xs md:text-xs">{tag.posts} posts</span>
					</div>
				</a>
		{/each}
	</Card.Content>
</Card.Root>
