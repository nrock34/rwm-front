<script>
	import { CalendarDays, Eye, Heart, MapPin } from "lucide-svelte";
	import ResilientImage from "$lib/components/shared/ResilientImage.svelte";

	const FALLBACK_IMAGE = "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg";

	let { postcard } = $props();

	function formatDate(value) {
		if (!value) return "Date unavailable";
		return new Intl.DateTimeFormat("en", {
			year: "numeric",
			month: "short",
			day: "numeric"
		}).format(new Date(value));
	}

	function initials(name) {
		return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
	}

	let location = $derived([postcard.location.city, postcard.location.country].filter(Boolean).join(", "));
</script>

<article class="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
	<a href={postcard.href} class="relative block aspect-[4/3] overflow-hidden bg-muted" aria-label={`Read ${postcard.title}`}>
		<ResilientImage
			src={postcard.image ?? FALLBACK_IMAGE}
			fallbackSrc={FALLBACK_IMAGE}
			alt={postcard.title}
			class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
			loading="lazy"
		/>
		<div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent"></div>
		{#if postcard.featured}
			<span class="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">Featured</span>
		{/if}
		{#if postcard.region}
			<span class="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
				<MapPin class="size-3.5" aria-hidden="true" />
				{postcard.region}
			</span>
		{/if}
	</a>

	<div class="flex flex-1 flex-col p-5">
		<div class="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
			{#if postcard.category}
				<a class="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground hover:underline" href={`/postcards?category=${encodeURIComponent(postcard.category.name)}`}>
					{postcard.category.name}
				</a>
			{/if}
			{#if location}
				<span>{location}</span>
			{/if}
		</div>

		<h2 class="line-clamp-2 text-lg font-semibold leading-tight">
			<a href={postcard.href} class="outline-none hover:text-primary focus-visible:underline">{postcard.title}</a>
		</h2>
		<p class="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{postcard.description}</p>

		<div class="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
			<div class="flex min-w-0 items-center gap-2">
				{#if postcard.author.avatar}
					<ResilientImage src={postcard.author.avatar} fallbackSrc={null} hideOnError={true} alt="" class="size-8 rounded-full object-cover" loading="lazy" />
				{:else}
					<span class="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold" aria-hidden="true">{initials(postcard.author.name)}</span>
				{/if}
				<div class="min-w-0">
					<p class="truncate text-xs font-medium">{postcard.author.name}</p>
					<p class="flex items-center gap-1 text-xs text-muted-foreground">
						<CalendarDays class="size-3" aria-hidden="true" />
						<time datetime={postcard.datePublished ?? undefined}>{formatDate(postcard.datePublished)}</time>
					</p>
				</div>
			</div>
			<div class="flex shrink-0 items-center gap-2 text-xs text-muted-foreground" aria-label="Postcard engagement">
				<span class="inline-flex items-center gap-1" title={`${postcard.likes} likes`}><Heart class="size-3.5" aria-hidden="true" />{postcard.likes}</span>
				{#if postcard.views > 0}
					<span class="inline-flex items-center gap-1" title={`${postcard.views} views`}><Eye class="size-3.5" aria-hidden="true" />{postcard.views}</span>
				{/if}
			</div>
		</div>
	</div>
</article>
