<script>
	import { onDestroy, onMount } from "svelte";
	import { Badge } from "$lib/components/ui/badge";
	import PostcardContentBlock from "./PostcardContentBlock.svelte";

	let { block } = $props();

	let slideshowIndex = $state(0);
	let autoAdvanceTimer = null;

	let mb = $derived(block.mb)

	onMount(() => {
		if (block.type !== "slideshow" || block.data.slides.length <= 1) {
			return undefined;
		}

		autoAdvanceTimer = window.setInterval(() => {
			slideshowIndex = (slideshowIndex + 1) % block.data.slides.length;
		}, 4200);

		return () => {
			if (autoAdvanceTimer) {
				window.clearInterval(autoAdvanceTimer);
			}
		};
	});

	onDestroy(() => {
		if (autoAdvanceTimer) {
			window.clearInterval(autoAdvanceTimer);
		}
	});

	function normalizeSpotifyUrl(url) {
		try {
			const parsed = new URL(url);
			if (!parsed.hostname.includes("spotify.com")) {
				return url;
			}

			const parts = parsed.pathname.split("/").filter(Boolean);
			if (parts[0] === "embed") {
				return url;
			}
			if (parts.length >= 2) {
				return `https://open.spotify.com/embed/${parts[0]}/${parts[1]}`;
			}
		} catch {
			return url;
		}

		return url;
	}

	function normalizeYouTubeUrl(url) {
		try {
			const parsed = new URL(url);
			if (parsed.hostname === "youtu.be") {
				const id = parsed.pathname.replace("/", "");
				if (id) {
					return `https://www.youtube.com/embed/${id}`;
				}
			}

			if (parsed.hostname.includes("youtube.com")) {
				if (parsed.pathname.startsWith("/embed/")) {
					return url;
				}
				const videoId = parsed.searchParams.get("v");
				if (videoId) {
					return `https://www.youtube.com/embed/${videoId}`;
				}
			}
		} catch {
			return url;
		}

		return url;
	}

	function getEmbedUrl(url, kind) {
		if (kind === "spotify") {
			return normalizeSpotifyUrl(url);
		}
		if (kind === "youtube") {
			return normalizeYouTubeUrl(url);
		}
		return url;
	}

	function getEmbedFrameClass(kind) {
		if (kind === "spotify") {
			return "h-[152px]";
		}
		if (kind === "map") {
			return "h-[22rem]";
		}
		return "h-[24rem]";
	}

	function getEmbedLinkLabel(kind) {
		if (kind === "spotify") {
			return "Open in Spotify";
		}
		if (kind === "youtube") {
			return "Watch on YouTube";
		}
		return null;
	}

	function getLayoutStyle(layoutData) {
		if (layoutData.style?.trim()) {
			return layoutData.style;
		}

		const columns = layoutData.columns;
		const widths = columns.map((column) => column.width?.trim() || "1fr");
		return `grid-template-columns:${widths.join(" ")};`;
	}

	function getChildBlockMarginClass(block) {
		return typeof block?.mb === "string" && block.mb.trim()
			? block.mb.trim()
			: "mb-5 last:mb-0";
	}

	function columnHasCustomMargins(column) {
		return column.blocks.some((childBlock) => typeof childBlock?.mb === "string" && childBlock.mb.trim());
	}

	function getTextSizeClass(fontSize, variant) {
		if (variant === "header") {
			if (fontSize === "sm") {
				return "text-[1rem] leading-6";
			}
			if (fontSize === "lg") {
				return "text-[1.45rem] leading-[1.2]";
			}
			return "text-[1.18rem] leading-[1.25]";
		}

		if (variant === "subtext") {
			if (fontSize === "sm") {
				return "text-[0.75rem] leading-4";
			}
			if (fontSize === "lg") {
				return "text-[0.9rem] leading-5";
			}
			return "text-[0.95rem] leading-6";
		}

		if (fontSize === "sm") {
			return "text-[0.9rem] leading-6";
		}
		if (fontSize === "lg") {
			return "text-[1rem] leading-7";
		}
		return "text-[0.95rem] leading-6";
	}

	function getImageFigureClass(data) {
		const classes = ["group", "relative", "overflow-hidden", "rounded-[1.35rem]", "shadow-md"];

		if (data.withBackground) {
			classes.push("border", "border-border/70", "bg-muted/55", "p-4");
		} else {
			classes.push("border", "border-border/90", "bg-card");
		}

		if (data.stretched) {
			classes.push("md:-mx-6");
		}

		return classes.join(" ");
	}

	function getImageClass(data) {
		const classes = ["w-full", "object-cover", "rounded-[1.1rem]"];

		if (data.withBackground) {
			classes.push("mx-auto", "max-h-[22rem]", "max-w-[78%]");
		} else {
			classes.push("h-[24rem]");
		}

		if (data.withBorder) {
			classes.push("border", "border-border");
		}

		return classes.join(" ");
	}
</script>

{#if block.type === "layout"}
	<div class="grid gap-5 md:gap-6" style={getLayoutStyle(block.data)}>
		{#each block.data.columns as column}
			{#if columnHasCustomMargins(column)}
				<div class="min-w-0" style={column.style ?? undefined}>
					{#each column.blocks as childBlock}
						<div class={getChildBlockMarginClass(childBlock)}>
							<PostcardContentBlock block={childBlock} />
						</div>
					{/each}
				</div>
			{:else}
				<div class="min-w-0 space-y-5" style={column.style ?? undefined}>
					{#each column.blocks as childBlock}
						<PostcardContentBlock block={childBlock} />
					{/each}
				</div>
			{/if}
		{/each}
	</div>
{:else if block.type === "header"}
	<h3 class={`font-semibold tracking-[-0.02em] text-foreground ${getTextSizeClass(block.data.fontSize, "header")}`}>
		{block.data.text}
	</h3>
{:else if block.type === "subtext"}
	<p class={`max-w-3xl text-muted-foreground/88 ${getTextSizeClass(block.data.fontSize, "subtext")}`}>
		{block.data.text}
	</p>
{:else if block.type === "paragraph"}
	<p class="text-[1rem] leading-7 text-foreground/95">{block.data.text}</p>
{:else if block.type === "smallText"}
	<p class="rounded-xl border border-dashed border-border/70 bg-muted/55 px-4 py-3 text-sm leading-7 text-muted-foreground">
		{block.data.text}
	</p>
{:else if block.type === "quote"}
	<blockquote class="rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent)_74%,white_26%),color-mix(in_oklab,var(--secondary)_55%,white_45%))] px-5 py-4 shadow-sm">
		<p class="text-[0.98rem] font-semibold leading-6 text-foreground/95">"{block.data.text}"</p>
		{#if block.data.attribution}
			<footer class="mt-2.5 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
				{block.data.attribution}
			</footer>
		{/if}
	</blockquote>
{:else if block.type === "image"}
	<figure class={getImageFigureClass(block.data)}>
		<img
			class={getImageClass(block.data)}
			src={block.data.src}
			alt={block.data.alt ?? block.data.caption ?? "Postcard feature image"}
		/>
		{#if block.data.caption}
			<figcaption class="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(17,24,39,0.88),rgba(17,24,39,0.52),transparent)] px-5 pb-4 pt-10 text-sm leading-6 text-white/92">
				{block.data.caption}
			</figcaption>
		{/if}
	</figure>
{:else if block.type === "embed"}
	<div class="space-y-3 rounded-[1.35rem] border border-border bg-background px-4 py-4 shadow-md">
		<div class="flex items-center justify-between gap-3">
			<h3 class="text-[0.74rem] font-bold uppercase tracking-[0.18em] text-foreground/82">
				{block.data.kind} embed
			</h3>
			{#if getEmbedLinkLabel(block.data.kind)}
				<a class="text-sm text-primary underline-offset-4 hover:underline" href={block.data.url} target="_blank" rel="noreferrer">
					{getEmbedLinkLabel(block.data.kind)}
				</a>
			{/if}
		</div>
		<iframe
			class={`w-full rounded-xl border border-border/70 bg-muted/20 ${getEmbedFrameClass(block.data.kind)}`}
			src={getEmbedUrl(block.data.url, block.data.kind)}
			title={`${block.data.kind} embed`}
			loading="lazy"
			allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
			referrerpolicy="strict-origin-when-cross-origin"
		></iframe>
		{#if block.data.caption}
			<p class="text-sm leading-5 text-muted-foreground/82">{block.data.caption}</p>
		{/if}
	</div>
{:else if block.type === "slideshow"}
	{@const slideCount = block.data.slides.length}
	{@const currentSlide = block.data.slides[slideshowIndex]}
	<div class="space-y-3 rounded-[1.35rem] border border-border bg-background px-4 py-4 shadow-md">
		<div class="flex items-center justify-between gap-3">
			<h3 class="text-[0.74rem] font-bold uppercase tracking-[0.18em] text-foreground/82">
				Slideshow
			</h3>
			<p class="text-sm text-muted-foreground/82">
				Slide {slideshowIndex + 1} of {slideCount}
			</p>
		</div>
		<figure class="group relative overflow-hidden rounded-[1.2rem] border border-border/80">
			<img
				class="h-[24rem] w-full object-cover"
				src={currentSlide.src}
				alt={currentSlide.alt ?? currentSlide.caption ?? `Slideshow image ${slideshowIndex + 1}`}
			/>
			<div class="pointer-events-none absolute inset-y-0 left-0 w-24 bg-[linear-gradient(to_right,rgba(15,23,42,0.42),transparent)]"></div>
			<div class="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[linear-gradient(to_left,rgba(15,23,42,0.42),transparent)]"></div>
			<button
				type="button"
				class="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/24 text-xl text-white backdrop-blur-sm transition hover:bg-black/38"
				aria-label="Previous slide"
				onclick={() => (slideshowIndex = slideshowIndex === 0 ? slideCount - 1 : slideshowIndex - 1)}
			>
				‹
			</button>
			<button
				type="button"
				class="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/24 text-xl text-white backdrop-blur-sm transition hover:bg-black/38"
				aria-label="Next slide"
				onclick={() => (slideshowIndex = (slideshowIndex + 1) % slideCount)}
			>
				›
			</button>
			{#if currentSlide.caption}
				<figcaption class="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(15,23,42,0.9),rgba(15,23,42,0.55),transparent)] px-5 pb-4 pt-10 text-sm leading-6 text-white/92">
					{currentSlide.caption}
				</figcaption>
			{/if}
		</figure>
	</div>
{:else if block.type === "poll"}
	<div class="rounded-[1.35rem] border border-dashed border-border bg-secondary/62 px-4 py-4 shadow-sm">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<h3 class="text-base font-semibold text-foreground">Poll placeholder</h3>
			<Badge variant="secondary">Preview only</Badge>
		</div>
		<p class="mt-3 text-base leading-7 text-foreground/95">{block.data.question}</p>
		<div class="mt-4 grid gap-3">
			{#each block.data.options as option}
				<button
					type="button"
					class="rounded-xl border border-border/70 bg-background/90 px-4 py-3 text-left text-sm text-foreground/90 opacity-80"
					disabled
				>
					{option.label}
				</button>
			{/each}
		</div>
		<p class="mt-3 text-sm leading-6 text-muted-foreground">
			This block is intentionally non-submitting in the test implementation. It gives the backend a stable contract without committing to poll behavior yet.
		</p>
	</div>
{/if}
