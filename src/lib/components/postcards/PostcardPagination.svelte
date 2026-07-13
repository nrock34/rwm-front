<script>
	import { ChevronLeft, ChevronRight } from "lucide-svelte";

	let { currentPage = 1, totalPages = 1, filters = {} } = $props();

	function hrefFor(pageNumber) {
		const params = new URLSearchParams();
		if (filters.q) params.set("q", filters.q);
		if (filters.category) params.set("category", filters.category);
		if (filters.tag) params.set("tag", filters.tag);
		if (filters.sortBy) params.set("sort_by", filters.sortBy);
		if (pageNumber > 1) params.set("page", String(pageNumber));
		const query = params.toString();
		return query ? `/postcards?${query}` : "/postcards";
	}

	let visiblePages = $derived.by(() => {
		if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
		const pages = new Set([1, totalPages]);
		for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page += 1) pages.add(page);
		return [...pages].sort((a, b) => a - b);
	});
</script>

{#if totalPages > 1}
	<nav class="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Postcard pages">
		{#if currentPage > 1}
			<a class="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={hrefFor(currentPage - 1)} rel="prev">
				<ChevronLeft class="size-4" aria-hidden="true" /> Previous
			</a>
		{:else}
			<span class="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm text-muted-foreground opacity-50" aria-disabled="true">
				<ChevronLeft class="size-4" aria-hidden="true" /> Previous
			</span>
		{/if}

		{#each visiblePages as pageNumber, index (pageNumber)}
			{#if index > 0 && pageNumber - visiblePages[index - 1] > 1}
				<span class="px-1 text-muted-foreground" aria-hidden="true">…</span>
			{/if}
			<a
				class={`grid size-9 place-items-center rounded-md border text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${pageNumber === currentPage ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
				href={hrefFor(pageNumber)}
				aria-label={`Go to postcard page ${pageNumber}`}
				aria-current={pageNumber === currentPage ? "page" : undefined}
			>{pageNumber}</a>
		{/each}

		{#if currentPage < totalPages}
			<a class="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={hrefFor(currentPage + 1)} rel="next">
				Next <ChevronRight class="size-4" aria-hidden="true" />
			</a>
		{:else}
			<span class="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm text-muted-foreground opacity-50" aria-disabled="true">
				Next <ChevronRight class="size-4" aria-hidden="true" />
			</span>
		{/if}
	</nav>
{/if}
