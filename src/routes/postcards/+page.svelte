<script>
	import { navigating } from "$app/state";
	import { getContext } from "svelte";
	import { Filter, LoaderCircle, Search } from "lucide-svelte";
	import PostcardGrid from "$lib/components/postcards/PostcardGrid.svelte";
	import PostcardPagination from "$lib/components/postcards/PostcardPagination.svelte";
	import ResilientImage from "$lib/components/shared/ResilientImage.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";

	let { data } = $props();
	const config = getContext("config");
	let directory = $derived(data.directory);
	let isLoading = $derived(Boolean(navigating.to?.url.pathname === "/postcards"));
</script>

<svelte:head>
	<title>Travel Postcards & Study Abroad Stories | RomeWithMe</title>
	<meta name="description" content="Explore first-hand travel and study abroad stories from the RomeWithMe community. Search postcards by topic, author, category, or tag." />
	<link rel="canonical" href={data.canonicalUrl} />
	<meta property="og:title" content="Travel Postcards & Study Abroad Stories | RomeWithMe" />
	<meta property="og:description" content="Explore first-hand travel and study abroad stories from the RomeWithMe community." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={data.canonicalUrl} />
</svelte:head>

<div class="min-h-screen bg-muted/35">
	<section class="relative isolate overflow-hidden border-b border-border bg-background">
		<ResilientImage
			class="absolute inset-0 -z-20 h-full w-full object-cover"
			alt="A mountain road inspiring a travel story"
			src={config?.postcardsHeroIMG ?? "https://c.pxhere.com/photos/25/57/fog_montes_sky_mountaineering_mountain_road_mountain_panoramic_slovenia-489210.jpg!d"}
			fallbackSrc="https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg"
		/>
		<div class="absolute inset-0 -z-10 bg-gradient-to-r from-background/95 via-background/80 to-background/45 backdrop-blur-[2px]"></div>
		<div class="mx-auto flex min-h-80 max-w-7xl items-center px-6 py-14 sm:px-10 lg:px-12">
			<div class="max-w-3xl">
				<p class="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Community collection</p>
				<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Postcards from abroad</h1>
				<p class="mt-4 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">
					Real stories, practical discoveries, and memorable moments shared by students and travelers around the world.
				</p>
			</div>
		</div>
	</section>

	<main class="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
		<form method="GET" action="/postcards" class="rounded-xl border border-border bg-card p-5 shadow-sm" aria-label="Filter postcards">
			<div class="mb-4 flex items-center gap-2">
				<Filter class="size-5 text-primary" aria-hidden="true" />
				<h2 class="font-semibold">Find a postcard</h2>
			</div>
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto] xl:items-end">
				<label class="grid gap-1.5 text-sm font-medium" for="postcard-search">
					Search
					<div class="relative">
						<Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
						<Input id="postcard-search" name="q" type="search" value={directory.filters.q} placeholder="Title, author, or topic" maxlength="120" class="pl-9" />
					</div>
				</label>

				<label class="grid gap-1.5 text-sm font-medium" for="postcard-category">
					Category
					<Input id="postcard-category" name="category" value={directory.filters.category} list="postcard-categories" placeholder="Any category" maxlength="48" />
					<datalist id="postcard-categories">
						{#each directory.availableCategories as category}<option value={category}></option>{/each}
					</datalist>
				</label>

				<label class="grid gap-1.5 text-sm font-medium" for="postcard-tag">
					Tag
					<Input id="postcard-tag" name="tag" value={directory.filters.tag} list="postcard-tags" placeholder="Any tag" maxlength="48" />
					<datalist id="postcard-tags">
						{#each directory.availableTags as tag}<option value={tag}></option>{/each}
					</datalist>
				</label>

				<label class="grid gap-1.5 text-sm font-medium" for="postcard-sort">
					Sort by
					<select id="postcard-sort" name="sort_by" value={directory.filters.sortBy} class="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50">
						<option value="">Newest</option>
						<option value="-like_count">Most liked</option>
						<option value="-views">Most viewed</option>
						<option value="-comment_count">Most discussed</option>
						<option value="-updated_at">Recently updated</option>
					</select>
				</label>

				<div class="flex gap-2">
					<Button type="submit" disabled={isLoading} class="min-w-24">
						{#if isLoading}<LoaderCircle class="size-4 animate-spin" aria-hidden="true" />{/if}
						Apply
					</Button>
					{#if directory.filters.q || directory.filters.category || directory.filters.tag || directory.filters.sortBy}
						<Button href="/postcards" variant="ghost">Clear</Button>
					{/if}
				</div>
			</div>
		</form>

		<div class="mt-8 flex flex-wrap items-end justify-between gap-3">
			<div>
				<p class="text-sm text-muted-foreground">{directory.count} {directory.count === 1 ? "story" : "stories"}</p>
				<h2 class="text-2xl font-semibold">Community postcards</h2>
			</div>
			{#if directory.totalPages > 1}
				<p class="text-sm text-muted-foreground">Page {directory.page} of {directory.totalPages}</p>
			{/if}
		</div>

		<div class="mt-6 transition-opacity" class:opacity-60={isLoading} aria-busy={isLoading}>
			{#if isLoading}
				<p class="sr-only" role="status" aria-live="polite">Loading postcards</p>
			{/if}
			{#if directory.results.length > 0}
				<PostcardGrid postcards={directory.results} />
				<PostcardPagination currentPage={directory.page} totalPages={directory.totalPages} filters={directory.filters} />
			{:else}
				<div class="rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
					<h2 class="text-xl font-semibold">No postcards matched those filters</h2>
					<p class="mt-2 text-sm text-muted-foreground">Try a broader search, remove a filter, or browse the full collection.</p>
					<Button href="/postcards" class="mt-5">View all postcards</Button>
				</div>
			{/if}
		</div>
	</main>
</div>
