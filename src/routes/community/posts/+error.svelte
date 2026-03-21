<script>
	import { page } from "$app/state";
	import { Button } from "$lib/components/ui/button";

	const invalidTag = $derived(page.status === 404 ? page.url.searchParams.get("tag") : null);
	const hasFilters = $derived(
		Boolean(page.url.searchParams.get("q")) ||
		Boolean(page.url.searchParams.get("category")) ||
		Boolean(page.url.searchParams.get("type")) ||
		Boolean(page.url.searchParams.get("sort_by")) ||
		Boolean(page.url.searchParams.get("tag"))
	);
</script>

<div class="mx-auto flex min-h-[70svh] w-full max-w-3xl items-center justify-center px-6 py-16">
	<div class="w-full rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm sm:p-10">
		<p class="text-sm uppercase tracking-[0.24em] text-primary/70">Community</p>
		<h1 class="mt-3 text-3xl font-bold text-foreground">
			{#if invalidTag}
				Tag not found
			{:else}
				Search unavailable
			{/if}
		</h1>
		<p class="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
			{#if invalidTag}
				The tag <span class="font-semibold text-foreground">#{invalidTag}</span> does not exist, so we couldn’t load posts for that search.
			{:else}
				We couldn’t load posts for the current search. Try clearing the filters and starting again.
			{/if}
		</p>

		<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
			<Button href="/community/posts">View all posts</Button>
			{#if hasFilters}
				<Button href="/community/posts" variant="outline">Clear filters</Button>
			{/if}
		</div>
	</div>
</div>
