<script>
	import { enhance } from "$app/forms";
	import { ArrowRight, CalendarDays, Clock3, Heart, MapPin, MessageSquare, Share2 } from "lucide-svelte";
	import ArticleRenderer from "$lib/components/postcards/ArticleRenderer.svelte";
	import PostcardGrid from "$lib/components/postcards/PostcardGrid.svelte";
	import ResilientImage from "$lib/components/shared/ResilientImage.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";

	const FALLBACK_IMAGE = "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg";
	let { data, form } = $props();
	let postcard = $derived(data.postcard);
	let shareStatus = $state("");
	let location = $derived([postcard.location.city, postcard.location.country].filter(Boolean).join(", "));

	function formatDate(value) {
		if (!value) return "Date unavailable";
		return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
	}

	function initials(name) {
		return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
	}

	async function sharePostcard() {
		shareStatus = "";
		try {
			if (navigator.share) {
				await navigator.share({ title: postcard.title, text: postcard.seoDescription, url: data.canonicalUrl });
				shareStatus = "Postcard shared.";
			} else if (navigator.clipboard) {
				await navigator.clipboard.writeText(data.canonicalUrl);
				shareStatus = "Link copied to your clipboard.";
			} else {
				shareStatus = "Copy the link from your address bar to share this postcard.";
			}
		} catch (error) {
			if (error?.name !== "AbortError") shareStatus = "Sharing was unavailable. Please copy the page URL.";
		}
	}
</script>

<svelte:head>
	<title>{postcard.title} | RomeWithMe Postcards</title>
	<meta name="description" content={postcard.seoDescription} />
	<link rel="canonical" href={data.canonicalUrl} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={postcard.title} />
	<meta property="og:description" content={postcard.seoDescription} />
	<meta property="og:url" content={data.canonicalUrl} />
	{#if postcard.image}<meta property="og:image" content={postcard.image} />{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={postcard.title} />
	<meta name="twitter:description" content={postcard.seoDescription} />
</svelte:head>

<div class="min-h-screen bg-muted/35">
	<header class="relative isolate overflow-hidden border-b border-border bg-background">
		<ResilientImage src={postcard.image ?? FALLBACK_IMAGE} fallbackSrc={FALLBACK_IMAGE} alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" />
		<div class="absolute inset-0 -z-10 bg-gradient-to-r from-background/97 via-background/88 to-background/60 backdrop-blur-[3px]"></div>
		<div class="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14 lg:px-12">
			<nav aria-label="Breadcrumb" class="mb-10 text-sm text-muted-foreground">
				<ol class="flex flex-wrap items-center gap-2">
					<li><a href="/" class="hover:text-foreground hover:underline">Home</a></li>
					<li aria-hidden="true">/</li>
					<li><a href="/postcards" class="hover:text-foreground hover:underline">Postcards</a></li>
					<li aria-hidden="true">/</li>
					<li class="max-w-64 truncate text-foreground" aria-current="page">{postcard.title}</li>
				</ol>
			</nav>

			<div class="max-w-4xl">
				<div class="flex flex-wrap gap-2">
					{#if postcard.category}<a href={`/postcards?category=${encodeURIComponent(postcard.category.name)}`} class="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{postcard.category.name}</a>{/if}
					{#each postcard.tags as tag}<a href={`/postcards?tag=${encodeURIComponent(tag.name)}`} class="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium hover:bg-muted">#{tag.name}</a>{/each}
				</div>
				<h1 class="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{postcard.title}</h1>
				<p class="mt-5 max-w-3xl text-lg leading-relaxed text-foreground/75">{postcard.description}</p>
				<div class="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
					{#if location}<span class="inline-flex items-center gap-1.5"><MapPin class="size-4" aria-hidden="true" />{location}</span>{/if}
					<span class="inline-flex items-center gap-1.5"><CalendarDays class="size-4" aria-hidden="true" /><time datetime={postcard.datePublished ?? undefined}>{formatDate(postcard.datePublished)}</time></span>
					<span class="inline-flex items-center gap-1.5"><Clock3 class="size-4" aria-hidden="true" />{postcard.readingMinutes} min read</span>
				</div>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
		<div class="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
			<section class="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-9" aria-label="Postcard article">
				<div class="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
					<div class="flex min-w-0 items-center gap-3">
						{#if postcard.author.avatar}
							<ResilientImage src={postcard.author.avatar} fallbackSrc={null} hideOnError={true} alt="" class="size-11 rounded-full object-cover" />
						{:else}
							<span class="grid size-11 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold" aria-hidden="true">{initials(postcard.author.name)}</span>
						{/if}
						<div class="min-w-0">
							<p class="text-xs text-muted-foreground">Written by</p>
							{#if postcard.author.href}<a class="font-semibold hover:text-primary hover:underline" href={postcard.author.href}>{postcard.author.name}</a>{:else}<p class="font-semibold">{postcard.author.name}</p>{/if}
						</div>
					</div>
					<div>
						<Button type="button" variant="outline" onclick={sharePostcard}><Share2 class="size-4" aria-hidden="true" />Share</Button>
						<p class="mt-1 max-w-52 text-right text-xs text-muted-foreground" role="status" aria-live="polite">{shareStatus}</p>
					</div>
				</div>

				<ArticleRenderer blocks={postcard.articleBlocks} />
			</section>

			<aside class="space-y-6 lg:sticky lg:top-24" aria-label="Postcard details">
				<section class="rounded-xl border border-border bg-card p-5 shadow-sm">
					<h2 class="font-semibold">Story details</h2>
					<dl class="mt-4 grid gap-3 text-sm">
						<div class="flex items-center justify-between gap-3"><dt class="inline-flex items-center gap-2 text-muted-foreground"><Heart class="size-4" aria-hidden="true" />Likes</dt><dd class="font-medium">{postcard.likes}</dd></div>
						<div class="flex items-center justify-between gap-3"><dt class="inline-flex items-center gap-2 text-muted-foreground"><MessageSquare class="size-4" aria-hidden="true" />Comments</dt><dd class="font-medium">{postcard.comments}</dd></div>
						{#if postcard.dateUpdated}<div class="flex items-center justify-between gap-3"><dt class="text-muted-foreground">Updated</dt><dd class="text-right font-medium">{formatDate(postcard.dateUpdated)}</dd></div>{/if}
					</dl>
				</section>

				{#if postcard.gallery.length > 0}
					<section class="rounded-xl border border-border bg-card p-5 shadow-sm">
						<h2 class="font-semibold">From this story</h2>
						<div class="mt-4 grid grid-cols-2 gap-3">
							{#each postcard.gallery.slice(0, 6) as image, index (image.src)}
								<a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`Open article image ${index + 1}`} class="aspect-square overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
									<ResilientImage src={image.src} fallbackSrc={null} hideOnError={true} alt={image.alt} class="h-full w-full object-cover transition hover:scale-105" loading="lazy" />
								</a>
							{/each}
						</div>
					</section>
				{/if}

				<section class="rounded-xl border-2 border-ring/45 bg-secondary p-5">
					<h2 class="text-lg font-bold text-primary">More stories, less searching</h2>
					<p class="mt-1 text-sm leading-relaxed text-foreground/75">Get new postcards, resources, programs, and scholarships in your inbox.</p>
					<form use:enhance method="POST" action="?/newsletterSignup" class="mt-4 grid gap-3">
						<label for="postcard-newsletter" class="sr-only">Email address</label>
						<Input id="postcard-newsletter" name="email" type="email" value={form?.email ?? ""} placeholder="you@example.com" autocomplete="email" required />
						{#if form?.error}<p class="text-xs text-destructive" role="alert">{form.error}: {form.description}</p>{/if}
						{#if form?.status === "success"}<p class="text-xs text-primary" role="status">You’re subscribed. Watch your inbox for the next story.</p>{/if}
						<Button type="submit" class="w-full">Subscribe</Button>
					</form>
				</section>
			</aside>
		</div>

		{#if data.relatedPostcards.length > 0}
			<section class="mt-14 border-t border-border pt-10" aria-labelledby="related-postcards-heading">
				<div class="mb-6 flex items-end justify-between gap-4">
					<div><p class="text-sm font-medium text-primary">Keep exploring</p><h2 id="related-postcards-heading" class="text-2xl font-semibold">Related postcards</h2></div>
					<a href="/postcards" class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Browse all <ArrowRight class="size-3.5" aria-hidden="true" /></a>
				</div>
				<PostcardGrid postcards={data.relatedPostcards} compact={true} />
			</section>
		{/if}
	</main>
</div>
