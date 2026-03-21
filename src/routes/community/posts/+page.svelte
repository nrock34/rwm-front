<script>
	import PostCard from "$lib/components/community/socialFeed/PostCard.svelte";
	import CursorPager from "$lib/components/shared/CursorPager.svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import * as Select from "$lib/components/ui/select";
	import { Search } from "lucide-svelte";
	import {
		POST_SORT_OPTIONS,
		POST_TOPIC_FILTER_OPTIONS,
		POST_TYPE_FILTER_OPTIONS,
		getPostOptionLabel
	} from "$lib/components/community/socialFeed/post-options.js";

	let { data } = $props();

	let searchQuery = $state(data.filters.q);
	let selectedCategory = $state(data.filters.category);
	let selectedType = $state(data.filters.type);
	let sortBy = $state(data.filters.sort_by);

	$effect(() => {
		searchQuery = data.filters.q;
		selectedCategory = data.filters.category;
		selectedType = data.filters.type;
		sortBy = data.filters.sort_by;
	});

	const hasActiveFilters = $derived(
		searchQuery.trim().length > 0 ||
		selectedCategory !== "all" ||
		selectedType !== "all" ||
		sortBy !== "-created_at" ||
		Boolean(data.filters.tag)
	);

	const currentTopicLabel = $derived(getPostOptionLabel(POST_TOPIC_FILTER_OPTIONS, selectedCategory, "All topics"));
	const currentTypeLabel = $derived(getPostOptionLabel(POST_TYPE_FILTER_OPTIONS, selectedType, "All types"));
	const currentSortLabel = $derived(getPostOptionLabel(POST_SORT_OPTIONS, sortBy, "Latest first"));
</script>

<div class="mx-auto w-full max-w-[84rem] px-6 py-10 sm:px-10 md:px-14 lg:py-12">
	<div class="space-y-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div class="max-w-3xl space-y-2">
				<p class="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">Community Feed</p>
				<h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Browse Posts</h1>
				<p class="text-sm leading-6 text-muted-foreground sm:text-base">
					Follow active conversations, scan updates quickly, and filter the feed without leaving the main post stream.
				</p>
			</div>
			<Button href="/community/posts/new">Create Post</Button>
		</div>

		<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:items-start">
			<div class="space-y-6">
				<Card.Root class="gap-5 border-border/70 bg-card/95 p-5 shadow-sm">
					<form method="GET" class="space-y-4">
						<div class="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_repeat(3,minmax(0,1fr))]">
							<div class="space-y-2 xl:col-span-1">
								<label class="text-sm font-medium text-foreground" for="post-search">Search</label>
								<div class="relative">
									<Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input id="post-search" name="q" bind:value={searchQuery} placeholder="Search posts, tags, or authors" class="pl-10" />
								</div>
							</div>

							<div class="space-y-2">
								<label class="text-sm font-medium text-foreground">Topic</label>
								<Select.Root type="single" bind:value={selectedCategory}>
									<Select.Trigger class="w-full justify-between">{currentTopicLabel}</Select.Trigger>
									<Select.Content>
										{#each POST_TOPIC_FILTER_OPTIONS as option}
											<Select.Item value={option.id} label={option.label}>{option.label}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
								<input type="hidden" name="category" value={selectedCategory} />
							</div>

							<div class="space-y-2">
								<label class="text-sm font-medium text-foreground">Type</label>
								<Select.Root type="single" bind:value={selectedType}>
									<Select.Trigger class="w-full justify-between">{currentTypeLabel}</Select.Trigger>
									<Select.Content>
										{#each POST_TYPE_FILTER_OPTIONS as option}
											<Select.Item value={option.id} label={option.label}>{option.label}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
								<input type="hidden" name="type" value={selectedType} />
							</div>

							<div class="space-y-2">
								<label class="text-sm font-medium text-foreground">Sort by</label>
								<Select.Root type="single" bind:value={sortBy}>
									<Select.Trigger class="w-full justify-between">{currentSortLabel}</Select.Trigger>
									<Select.Content>
										{#each POST_SORT_OPTIONS as option}
											<Select.Item value={option.id} label={option.label}>{option.label}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
								<input type="hidden" name="sort_by" value={sortBy} />
							</div>
						</div>

						{#if data.filters.tag}
							<input type="hidden" name="tag" value={data.filters.tag} />
						{/if}

						<div class="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
							<div class="flex flex-wrap items-center gap-2">
								<Badge variant="outline" class="bg-secondary/25 text-foreground">{currentTopicLabel}</Badge>
								<Badge variant="outline" class="bg-secondary/25 text-foreground">{currentTypeLabel}</Badge>
								{#if data.filters.tag}
									<Badge variant="outline" class="bg-secondary/25 text-foreground">#{data.filters.tag}</Badge>
								{/if}
							</div>
							<div class="flex flex-wrap gap-3">
								<Button type="submit">Apply Filters</Button>
								<Button href="/community/posts" type="button" variant="ghost">Reset</Button>
							</div>
						</div>
					</form>
				</Card.Root>

				<div class="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/95 px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 class="text-lg font-semibold text-foreground">Current Results</h2>
						<p class="text-sm text-muted-foreground">
							Showing {data.postsPage.results.length} post{data.postsPage.results.length === 1 ? "" : "s"}{hasActiveFilters ? " matching your current view" : " from the current feed page"}.
						</p>
					</div>
					{#if hasActiveFilters}
						<Button href="/community/posts" variant="ghost" class="w-fit">Clear filters</Button>
					{/if}
				</div>

				{#if data.postsPage.results.length > 0}
					<div class="space-y-5">
						{#each data.postsPage.results as post (post.id)}
							<PostCard {post} currentPath={data.currentPath} showImage={false} />
						{/each}
					</div>
				{:else}
					<Card.Root class="items-center gap-4 border-dashed border-border/70 px-6 py-10 text-center shadow-none">
						<div class="space-y-2">
							<h3 class="text-xl font-semibold text-foreground">No posts match this view</h3>
							<p class="max-w-xl text-sm text-muted-foreground">
								Try clearing your filters or start the conversation yourself with a new post.
							</p>
						</div>
						<div class="flex flex-wrap justify-center gap-3">
							<Button href="/community/posts">Reset filters</Button>
							<Button href="/community/posts/new" variant="outline">Create Post</Button>
						</div>
					</Card.Root>
				{/if}

				<CursorPager previousHref={data.previousHref} nextHref={data.nextHref} previousLabel="Newer Posts" nextLabel="Older Posts" />
			</div>

			<aside class="space-y-4 lg:sticky lg:top-24">
				<Card.Root class="gap-4 border-border/70 bg-card/95 p-5 shadow-sm">
					<div class="space-y-1">
						<p class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-primary/80">Your Content</p>
						<h2 class="text-lg font-semibold text-foreground">Your Posts And Activity</h2>
						<p class="text-sm text-muted-foreground">
							Here’s where your posts and interactions will live once the API support is ready.
						</p>
					</div>
					<div class="space-y-2">
						<Button disabled variant="outline" class="w-full justify-start">Posts You Made</Button>
						<Button disabled variant="outline" class="w-full justify-start">Posts You Liked</Button>
						<Button disabled variant="outline" class="w-full justify-start">Posts You Commented On</Button>
						<Button disabled variant="outline" class="w-full justify-start">Saved Posts</Button>
					</div>
				</Card.Root>
			</aside>
		</div>
	</div>
</div>
