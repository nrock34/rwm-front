<script>
	import { Button } from "$lib/components/ui/button";
	import PostCard from "./PostCard.svelte";

	let {
		posts = [],
		activeFilter = "all",
		activeContentType = "all",
		searchQuery = "",
		limit = 6,
		currentPath = "/community",
		seeMoreHref = "/community/posts"
	} = $props();

	const filteredPosts = $derived(
		posts
			.filter((post) => {
				const matchesContentType = activeContentType === "all" || activeContentType === post.type;
				const matchesFilter = activeFilter === "all" || activeFilter === post.category;
				const normalizedQuery = searchQuery.trim().toLowerCase();
				const matchesSearch =
					normalizedQuery.length === 0 ||
					post.content.toLowerCase().includes(normalizedQuery) ||
					post.title.toLowerCase().includes(normalizedQuery) ||
					post.author.name.toLowerCase().includes(normalizedQuery) ||
					post.categoryLabel.toLowerCase().includes(normalizedQuery) ||
					post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
				return matchesContentType && matchesFilter && matchesSearch;
			})
			.slice(0, limit)
	);
</script>

<div class="space-y-6">
	{#if filteredPosts.length > 0}
		{#each filteredPosts as post (post.id)}
			<PostCard {post} {currentPath} />
		{/each}
	{:else}
		<div class="rounded-lg border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
			No posts match the current filters.
		</div>
	{/if}

	<div class="text-center">
		<Button href={seeMoreHref} variant="secondary" class="h-12 px-8 text-base">See More Posts</Button>
	</div>
</div>
