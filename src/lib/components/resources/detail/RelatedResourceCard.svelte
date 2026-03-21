<script>
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";

	let { resource } = $props();
</script>

<Card.Root class="gap-3 border-border/70 bg-card/95 p-4 shadow-sm">
	<div class="space-y-2">
		<div class="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
			<span class="rounded-full border border-border/60 bg-secondary/20 px-2 py-0.5 text-foreground">
				{resource.categoryLabel}
			</span>
			<span>{resource.typeLabel}</span>
		</div>
		<h3 class="line-clamp-2 text-base font-semibold text-foreground">{resource.title}</h3>
		<p class="line-clamp-3 text-sm text-muted-foreground">{resource.description}</p>
	</div>

	<Button href={resource.href} variant="outline" class="w-fit">View resource</Button>
</Card.Root>
