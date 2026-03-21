<script>
	import { Badge } from "$lib/components/ui/badge";
	import * as Card from "$lib/components/ui/card";
	import { POST_TOPIC_OPTIONS, POST_TYPE_OPTIONS } from "./post-options.js";
</script>

<div class="space-y-4 lg:sticky lg:top-24">
	<Card.Root class="gap-4 border-border/70 bg-card/95 p-5 shadow-sm">
		<div class="space-y-1">
			<h2 class="text-lg font-semibold text-foreground">Posting Guide</h2>
			<p class="text-sm text-muted-foreground">
				Keep posts clear, specific, and useful so other students know how to respond.
			</p>
		</div>
		<ul class="space-y-2 text-sm text-muted-foreground">
			<li>Lead with a clear title so the archive stays easy to scan.</li>
			<li>Use tags for themes people may search for later.</li>
			<li>Choose the closest topic and post type so filters stay meaningful.</li>
		</ul>
	</Card.Root>

	<Card.Root class="gap-4 border-border/70 bg-secondary/25 p-5 shadow-none">
		<div class="space-y-1">
			<h3 class="text-sm font-semibold text-foreground">Available Topics</h3>
			<p class="text-sm text-muted-foreground">These match the backend categories exactly.</p>
		</div>
		<div class="flex flex-wrap gap-2">
			{#each POST_TOPIC_OPTIONS as option}
				<Badge variant="outline" class="bg-background/70 text-foreground">{option.label}</Badge>
			{/each}
		</div>
	</Card.Root>

	<Card.Root class="gap-4 border-border/70 bg-secondary/25 p-5 shadow-none">
		<div class="space-y-1">
			<h3 class="text-sm font-semibold text-foreground">Post Types</h3>
			<p class="text-sm text-muted-foreground">Pick the format that matches what readers will see.</p>
		</div>
		<div class="flex flex-wrap gap-2">
			{#each POST_TYPE_OPTIONS as option}
				<Badge variant="outline" class="bg-background/70 text-foreground">{option.label}</Badge>
			{/each}
		</div>
	</Card.Root>
</div>
