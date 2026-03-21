<script>
	import * as Card from "$lib/components/ui/card";
	import * as Select from "$lib/components/ui/select";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { Filter } from "lucide-svelte";

	let {
		searchQuery = $bindable(),
		selectedCategory = $bindable(),
		sortBy = $bindable(),
		categories = [],
		hasActiveFilters = false,
		onReset = () => {}
	} = $props();

	const selectedCategoryLabel = $derived(
		categories.find((category) => category.id === selectedCategory)?.label ?? "All categories"
	);

	const sortOptions = [
		{ id: "latest", label: "Latest first" },
		{ id: "oldest", label: "Oldest first" },
		{ id: "most-viewed", label: "Most viewed" },
		{ id: "most-engaged", label: "Most engaged" },
		{ id: "alphabetical", label: "A to Z" }
	];

	const selectedSortLabel = $derived(
		sortOptions.find((option) => option.id === sortBy)?.label ?? sortOptions[0].label
	);
</script>

<div class="space-y-4">
	<Card.Root class="gap-4 border-border/70 bg-card/95 p-5 shadow-sm">
		<div class="space-y-1">
			<div class="flex items-center gap-2 text-sm font-semibold text-foreground">
				<Filter class="h-4 w-4 text-primary" />
				<span>Filter Archive</span>
			</div>
			<p class="text-sm text-muted-foreground">Narrow the update archive by topic or sort order.</p>
		</div>

		<div class="space-y-4">
			<div class="space-y-2">
				<label class="text-sm font-medium text-foreground" for="updates-search">Search</label>
				<Input
					id="updates-search"
					type="search"
					placeholder="Search titles and summaries"
					bind:value={searchQuery}
				/>
			</div>

			<div class="space-y-2">
				<label class="text-sm font-medium text-foreground">Category</label>
				<Select.Root type="single" bind:value={selectedCategory}>
					<Select.Trigger class="w-full justify-between">{selectedCategoryLabel}</Select.Trigger>
					<Select.Content>
						{#each categories as category}
							<Select.Item value={category.id} label={category.label}>
								<div class="flex w-full items-center justify-between gap-4">
									<span>{category.label}</span>
									<span class="text-xs text-muted-foreground">{category.count}</span>
								</div>
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="space-y-2">
				<label class="text-sm font-medium text-foreground">Sort by</label>
				<Select.Root type="single" bind:value={sortBy}>
					<Select.Trigger class="w-full justify-between">{selectedSortLabel}</Select.Trigger>
					<Select.Content>
						{#each sortOptions as option}
							<Select.Item value={option.id} label={option.label}>{option.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<Button type="button" variant="ghost" class="w-full justify-center" onclick={onReset} disabled={!hasActiveFilters}>
			Reset filters
		</Button>
	</Card.Root>
</div>
