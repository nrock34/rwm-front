<script>
	import * as Card from "$lib/components/ui/card";
	import { ArrowRight, MessageCircle, Newspaper } from "lucide-svelte";

	let { recentActivity = [] } = $props();
</script>

<section class="bg-secondary/30 py-20">
	<div class="mx-auto grid max-w-[85rem] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
		<div>
			<h2 class="mb-6 text-3xl font-bold text-foreground lg:text-4xl">Join the conversation</h2>
			<p class="mb-8 text-xl text-muted-foreground">
				See what is happening in the community now, share experiences, and get practical support.
			</p>

			<div class="space-y-4">
				{#each recentActivity as activity (activity.href)}
					{@const Icon = activity.type === "update" ? Newspaper : MessageCircle}
					<a href={activity.href} class="flex items-center space-x-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted">
						<span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
							<Icon class="h-4 w-4 text-primary" />
						</span>
						<span class="min-w-0 flex-1">
							<span class="block truncate text-sm font-medium text-foreground">{activity.title}</span>
							<span class="block text-xs text-muted-foreground">{activity.time}</span>
						</span>
					</a>
				{/each}
			</div>

			<a href="/community" class="btn-primary mt-6 inline-flex items-center">
				View community feed <ArrowRight class="ml-2 h-4 w-4" />
			</a>
		</div>

		<Card.Root class="gap-4 p-8">
			<Newspaper class="h-10 w-10 text-primary" />
			<h3 class="text-2xl font-semibold text-foreground">Stories, questions, and timely updates</h3>
			<p class="leading-7 text-muted-foreground">
				Browse firsthand advice and ask the community what you need to know before your next trip or semester abroad.
			</p>
			<a href="/community/posts/new" class="inline-flex items-center font-medium text-primary hover:underline">
				Start a conversation <ArrowRight class="ml-2 h-4 w-4" />
			</a>
		</Card.Root>
	</div>
</section>
