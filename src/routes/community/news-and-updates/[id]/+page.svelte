<script>
	import UpdateCard from "$lib/components/community/CommunityNewsUpdates/UpdateCard.svelte";
	import UpdateDetailSidebar from "$lib/components/community/CommunityNewsUpdates/UpdateDetailSidebar.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import ResilientImage from "$lib/components/shared/ResilientImage.svelte";
	import { ArrowLeft } from "lucide-svelte";

	let { data } = $props();
</script>

<div class="page-shell mx-auto w-full px-6 py-10 sm:px-10 md:px-14 lg:py-12">
	<div class="space-y-3">
		<Button href="/community/news-and-updates" variant="ghost" class="w-fit">
			<ArrowLeft class="h-4 w-4" />
			Back to Updates
		</Button>
		<div class="max-w-3xl space-y-2">
			<p class="text-xs font-medium uppercase tracking-[0.26em] text-primary/80">Community Update</p>
			<h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{data.update.title}</h1>
			<p class="text-sm leading-6 text-muted-foreground sm:text-base">{data.update.summary}</p>
		</div>
	</div>

	<div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
		<div class="space-y-6">
			<Card.Root class="overflow-hidden border-border/70 bg-card/95 p-0 shadow-sm">
				<div class="px-6 py-6 sm:px-8 sm:py-8">
					{#if data.update.image}
						<div class="mb-5 max-w-2xl overflow-hidden rounded-xl border border-border/60 bg-muted/20">
							<ResilientImage
								src={data.update.image}
								fallbackSrc={null}
								alt={data.update.title}
								class="max-h-[12rem] w-full object-cover sm:max-h-[14rem] lg:max-h-[16rem]"
								hideOnError={true}
							/>
						</div>
					{/if}
					<div
						class="prose prose-neutral max-w-none text-foreground/90 prose-headings:text-foreground prose-a:text-primary prose-img:mx-auto prose-img:max-h-[14rem] prose-img:w-full prose-img:rounded-xl prose-img:object-cover sm:prose-img:max-h-[16rem] lg:prose-img:max-h-[18rem] [&_iframe]:mx-auto [&_iframe]:aspect-video [&_iframe]:max-h-[16rem] [&_iframe]:w-full [&_iframe]:rounded-xl sm:[&_iframe]:max-h-[18rem] lg:[&_iframe]:max-h-[20rem] [&_video]:max-h-[16rem] [&_video]:w-full [&_video]:rounded-xl [&_video]:object-cover sm:[&_video]:max-h-[18rem] lg:[&_video]:max-h-[20rem]"
					>
						{@html data.update.content}
					</div>
				</div>
			</Card.Root>

			{#if data.relatedUpdates.length > 0}
				<section class="space-y-4 border-t border-border/60 pt-8">
					<div class="flex items-center justify-between gap-4">
						<div>
							<h2 class="text-2xl font-semibold text-foreground">More Updates</h2>
							<p class="text-sm text-muted-foreground">Keep scanning the archive without leaving the updates desk.</p>
						</div>
						<Button href="/community/news-and-updates" variant="ghost">View full archive</Button>
					</div>
					<div class="grid gap-3 sm:grid-cols-2">
						{#each data.relatedUpdates as update (update.id)}
							<UpdateCard {update} variant="compact" />
						{/each}
					</div>
				</section>
			{/if}
		</div>

		<UpdateDetailSidebar update={data.update} />
	</div>
</div>
