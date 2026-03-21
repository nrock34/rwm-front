<script>
	import UpdateCard from "$lib/components/community/CommunityNewsUpdates/UpdateCard.svelte";
	import UpdatesFilterPanel from "$lib/components/community/CommunityNewsUpdates/UpdatesFilterPanel.svelte";
	import CursorPager from "$lib/components/shared/CursorPager.svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";

	let { data } = $props();

	let searchQuery = $state("");
	let selectedCategory = $state("all");
	let sortBy = $state("latest");

	const categoryOptions = $derived.by(() => {
		const grouped = new Map();
		for (const update of data.updatesPage.results) {
			const existing = grouped.get(update.category);
			if (existing) {
				existing.count += 1;
				continue;
			}
			grouped.set(update.category, {
				id: update.category,
				label: update.categoryLabel,
				count: 1
			});
		}

		return [
			{ id: "all", label: "All categories", count: data.updatesPage.results.length },
			...Array.from(grouped.values()).sort((left, right) => left.label.localeCompare(right.label))
		];
	});

	function getEngagementScore(update) {
		return update.likes + update.comments + update.shares;
	}

	const filteredUpdates = $derived.by(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();
		const visible = data.updatesPage.results.filter((update) => {
			const matchesCategory = selectedCategory === "all" || update.category === selectedCategory;
			const matchesSearch =
				normalizedQuery.length === 0 ||
				update.title.toLowerCase().includes(normalizedQuery) ||
				update.summary.toLowerCase().includes(normalizedQuery) ||
				update.categoryLabel.toLowerCase().includes(normalizedQuery);

			return matchesCategory && matchesSearch;
		});

		return [...visible].sort((left, right) => {
			switch (sortBy) {
				case "oldest":
					return Date.parse(left.updatedAt) - Date.parse(right.updatedAt);
				case "most-viewed":
					return right.views - left.views;
				case "most-engaged":
					return getEngagementScore(right) - getEngagementScore(left);
				case "alphabetical":
					return left.title.localeCompare(right.title);
				case "latest":
				default:
					return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
			}
		});
	});

	const hasActiveFilters = $derived(
		searchQuery.trim().length > 0 || selectedCategory !== "all" || sortBy !== "latest"
	);

	const activeCategoryLabel = $derived(
		categoryOptions.find((category) => category.id === selectedCategory)?.label ?? "All categories"
	);

	function resetFilters() {
		searchQuery = "";
		selectedCategory = "all";
		sortBy = "latest";
	}
</script>

<div class="page-shell mx-auto w-full px-6 py-10 sm:px-10 md:px-14 lg:py-12">
	<div class="max-w-3xl space-y-2">
		<p class="text-xs font-medium uppercase tracking-[0.26em] text-primary/80">Community Archive</p>
		<h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">News & Updates</h1>
		<p class="text-sm leading-6 text-muted-foreground sm:text-base">
			Browse announcements, deadlines, and study-abroad changes in a more scan-friendly archive.
		</p>
	</div>

	<div class="mt-8 grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]">
		<aside>
			<UpdatesFilterPanel
				bind:searchQuery
				bind:selectedCategory
				bind:sortBy
				categories={categoryOptions}
				hasActiveFilters={hasActiveFilters}
				onReset={resetFilters}
			/>
		</aside>

		<div class="space-y-6">
			<div class="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/95 px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 class="text-lg font-semibold text-foreground">Archive Results</h2>
					<p class="text-sm text-muted-foreground">
						Showing {filteredUpdates.length} update{filteredUpdates.length === 1 ? "" : "s"}{hasActiveFilters ? " matching your filters" : ""}.
					</p>
				</div>
				<div class="flex flex-wrap items-center gap-2">
					<Badge variant="outline" class="bg-secondary/25 text-foreground">{activeCategoryLabel}</Badge>
					{#if hasActiveFilters}
						<Button type="button" variant="ghost" class="h-8 px-3 text-sm" onclick={resetFilters}>Clear filters</Button>
					{/if}
				</div>
			</div>

			{#if filteredUpdates.length > 0}
				<div class="space-y-4">
					{#each filteredUpdates as update (update.id)}
						<UpdateCard {update} variant="archive" />
					{/each}
				</div>
			{:else}
				<Card.Root class="items-center gap-4 border-dashed border-border/70 px-6 py-10 text-center shadow-none">
					<div class="space-y-2">
						<h3 class="text-xl font-semibold text-foreground">No updates match these filters</h3>
						<p class="max-w-xl text-sm text-muted-foreground">
							Try clearing the search or switching back to all categories. If you want the latest announcements immediately, head back to the live community page.
						</p>
					</div>
					<div class="flex flex-wrap justify-center gap-3">
						<Button type="button" onclick={resetFilters}>Reset filters</Button>
						<Button href="/community" variant="outline">Go to Community</Button>
					</div>
				</Card.Root>
			{/if}

			<CursorPager
				previousHref={data.previousHref}
				nextHref={data.nextHref}
				previousLabel="Newer Updates"
				nextLabel="Older Updates"
			/>
		</div>
	</div>
</div>
