<script>
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { AlertCircle, Calendar, Clock3, Eye, Heart, MessageSquareReply, Share2 } from "lucide-svelte";

	let { update, variant = "default" } = $props();

	const isCompact = $derived(variant === "compact");
	const isArchive = $derived(variant === "archive");

	function getCategoryToneClass(category) {
		const normalizedCategory = typeof category === "string" ? category.toLowerCase() : "";

		switch (normalizedCategory) {
			case "visa":
				return "tone-pill tone-pill--red";
			case "housing":
				return "tone-pill tone-pill--blue";
			case "cultural":
				return "tone-pill tone-pill--green";
			case "safety":
				return "tone-pill tone-pill--orange";
			case "scholarship":
				return "tone-pill tone-pill--purple";
			default:
				return "bg-muted text-muted-foreground";
		}
	}
</script>

{#if isCompact}
	<Card.Root class="gap-2 p-3 hover:shadow-md transition-shadow">
		<div class="mb-1 flex items-start justify-between gap-2">
			<div class="flex flex-col-reverse items-start gap-1 lg:flex-row lg:items-center">
				<div class="flex items-center gap-1">
					{#if update.urgent}
						<AlertCircle class="h-3 w-3 flex-shrink-0 text-destructive" />
					{/if}
						<span class={`rounded px-1.5 py-0.5 text-meta-xs font-medium sm:text-action-xs ${getCategoryToneClass(update.category)}`}>
							{update.categoryLabel}
						</span>
					</div>

					{#if update.urgent}
						<Badge variant="destructive" class="py-0.5 text-meta-xs sm:text-action-xs">URGENT</Badge>
					{/if}
				</div>

			<div class="flex items-center text-[0.72rem] text-secondary-foreground/70">
				<Clock3 class="mr-1 h-2.5 w-2.5" />
				{update.timeAgo}
			</div>
		</div>

		<h3 class="text-sm font-semibold leading-5 tracking-tight text-foreground">
			{update.title}
		</h3>
		<p class="line-clamp-2 text-xs leading-5 text-secondary-foreground/90">{update.summary}</p>

		<div class="mt-auto flex items-center justify-between">
			<div class="flex items-center text-[0.72rem] text-secondary-foreground/70">
				<Calendar class="mr-2 h-4 w-4" />
				{new Date(update.updatedAt).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric"
				})}
			</div>
			<Button href={update.href} class="h-auto px-2 py-1 text-[0.72rem] font-medium sm:text-xs" variant="ghost">
				Read more
			</Button>
		</div>
	</Card.Root>
{:else if isArchive}
	<Card.Root class="overflow-hidden border-border/70 bg-card/95 p-0 shadow-sm transition-shadow hover:shadow-md">
		<div class="flex flex-col sm:grid sm:grid-cols-[11rem_minmax(0,1fr)]">
			<div class="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 sm:aspect-auto">
				{#if update.image}
					<img src={update.image} alt={update.title} class="absolute inset-0 h-full w-full object-cover" />
				{/if}
			</div>

			<div class="flex min-w-0 flex-1 flex-col gap-4 p-4">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex flex-wrap items-center gap-2">
							<Badge class={getCategoryToneClass(update.category)}>{update.categoryLabel}</Badge>
						{#if update.urgent}
							<Badge variant="destructive">Urgent</Badge>
						{/if}
					</div>

					<div class="flex flex-wrap items-center gap-3 text-xs text-secondary-foreground/70">
						<div class="flex items-center gap-1">
							<Clock3 class="h-3.5 w-3.5" />
							<span>{update.timeAgo}</span>
						</div>
						<div class="flex items-center gap-1">
							<Calendar class="h-3.5 w-3.5" />
							<span>{new Date(update.updatedAt).toLocaleDateString()}</span>
						</div>
					</div>
				</div>

				<div class="space-y-2">
					<h3 class="text-lg font-semibold leading-snug tracking-tight text-foreground">{update.title}</h3>
					<p class="line-clamp-3 text-sm leading-6 text-secondary-foreground/90">{update.summary}</p>
				</div>

				<div class="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
					<div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
						<div class="flex items-center gap-1"><Eye class="h-3.5 w-3.5" /> {update.views}</div>
						<div class="flex items-center gap-1"><Heart class="h-3.5 w-3.5" /> {update.likes}</div>
						<div class="flex items-center gap-1"><MessageSquareReply class="h-3.5 w-3.5" /> {update.comments}</div>
					</div>

					<Button href={update.href} variant="outline">Read More</Button>
				</div>
			</div>
		</div>
	</Card.Root>
{:else}
	<Card.Root class="overflow-hidden border-border/70 py-0 gap-0 hover:shadow-md transition-shadow">
		{#if update.image}
			<img src={update.image} alt={update.title} class="h-48 w-full object-cover" />
		{:else}
			<div class="h-32 w-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
		{/if}

		<div class="space-y-4 p-4">
			<div class="flex flex-wrap items-center gap-2">
				<Badge>{update.categoryLabel}</Badge>
				{#if update.urgent}
					<Badge variant="destructive">Urgent</Badge>
				{/if}
			</div>

			<div class="space-y-2">
				<h3 class="text-lg font-semibold leading-snug tracking-tight text-foreground">{update.title}</h3>
				<p class="line-clamp-3 text-sm leading-6 text-secondary-foreground/90">{update.summary}</p>
			</div>

			<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-secondary-foreground/70">
				<div class="flex items-center gap-1">
					<Clock3 class="h-3.5 w-3.5" />
					<span>{update.timeAgo}</span>
				</div>
				<div class="flex items-center gap-1">
					<Calendar class="h-3.5 w-3.5" />
					<span>{new Date(update.updatedAt).toLocaleDateString()}</span>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
				<div class="flex items-center gap-1"><Eye class="h-3.5 w-3.5" /> {update.views}</div>
				<div class="flex items-center gap-1"><Heart class="h-3.5 w-3.5" /> {update.likes}</div>
				<div class="flex items-center gap-1"><MessageSquareReply class="h-3.5 w-3.5" /> {update.comments}</div>
				<div class="flex items-center gap-1"><Share2 class="h-3.5 w-3.5" /> {update.shares}</div>
			</div>

			<Button href={update.href} variant="outline">Read More</Button>
		</div>
	</Card.Root>
{/if}
