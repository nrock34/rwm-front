<script>
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Bell, ExternalLink, Phone } from "lucide-svelte";
	import { innerWidth } from "svelte/reactivity/window";
	import UpdateCard from "./UpdateCard.svelte";

	let {
		updates = [],
		deadlines = [],
		viewAllHref = "/community/news-and-updates"
	} = $props();

	let md = $derived(innerWidth.current < 768);
	const visibleUpdates = $derived(updates.slice(0, md ? 1 : 4));
</script>

<section class="flex w-full">
	<div class="page-shell mx-auto w-full px-6 py-6 sm:px-10 md:px-14 lg:px-18 xl:px-22">
		<div class="mb-3 flex items-center justify-between gap-4">
			<div class="flex items-center space-x-2 leading-tight">
				<Bell class="h-6 w-6 text-primary" />
				<div>
					<h2 class="text-sm font-bold text-foreground sm:text-base">Latest News & Updates</h2>
					<p class="text-xs text-foreground/70 sm:text-sm">Stay informed on important announcements.</p>
				</div>
			</div>
			<div class="flex items-center space-x-3">
				<div class="flex items-center space-x-1">
					<div class="h-2 w-2 rounded-full bg-destructive animate-pulse"></div>
					<span class="text-xs text-secondary-foreground sm:text-sm">Live</span>
				</div>
				<Button href={viewAllHref} variant="ghost" class="shrink-0 bg-transparent text-xs text-primary shadow-none hover:bg-secondary/60 sm:text-sm">
					<span>View All</span>
					<ExternalLink class="h-4 w-4" />
				</Button>
			</div>
		</div>

		<div class="grid grid-cols-10 gap-2">
			<div class="col-span-10 md:col-span-7 xl:col-span-8">
				{#if visibleUpdates.length > 0}
					<div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
						{#each visibleUpdates as update (update.id)}
							<UpdateCard {update} variant="compact" />
						{/each}
					</div>
				{:else}
					<Card.Root class="p-6">
						<p class="text-sm text-muted-foreground">No updates are available right now.</p>
					</Card.Root>
				{/if}
			</div>

			<div class="col-span-10 space-y-2 md:col-span-3 xl:col-span-2">
				<Card.Root class="border-destructive/35 bg-destructive/10 p-3.5 gap-1.5 shadow-none">
					<div class="flex items-center gap-2">
						<Phone class="h-3.5 w-3.5 text-destructive" />
						<h3 class="text-xs font-semibold text-destructive">Emergency Contacts</h3>
					</div>
					<div class="space-y-0.5 text-xs">
						<p class="text-destructive/80">Europe Emergency Services</p>
						<p class="font-bold text-destructive">112</p>
					</div>
				</Card.Root>

				<Card.Root class="p-2 py-3.5 gap-2">
					<Card.Header class="px-2.5 py-1">
						<h3 class="text-xs font-medium">Upcoming Deadlines</h3>
						<p class="text-[0.615rem] font-light text-muted-foreground">Program & scholarship deadlines</p>
					</Card.Header>
					<Card.Content class="space-y-0.5 px-2.5">
						{#if deadlines.length > 0}
							{#each deadlines as deadline}
								<a href={deadline.href} class="flex items-center justify-between gap-1 rounded-md px-1 py-0.5 text-xs hover:bg-muted/60">
									<span class="line-clamp-1 text-secondary-foreground/80">{deadline.name}</span>
									<span class="shrink-0 text-nowrap font-semibold text-accent-foreground/80">{deadline.displayDate}</span>
								</a>
							{/each}
						{:else}
							<p class="text-xs text-muted-foreground">No upcoming deadlines are available.</p>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>
</section>
