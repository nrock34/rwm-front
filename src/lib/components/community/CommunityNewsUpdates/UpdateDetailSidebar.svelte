<script>
import { Badge } from "$lib/components/ui/badge";
import { Button } from "$lib/components/ui/button";
import { Calendar, Clock3, Eye, Heart, MessageSquareReply, Share2 } from "lucide-svelte";

	let { update } = $props();

	const metrics = $derived([
		{ label: "Views", value: update.views, icon: Eye },
		{ label: "Likes", value: update.likes, icon: Heart },
		{ label: "Comments", value: update.comments, icon: MessageSquareReply },
		{ label: "Shares", value: update.shares, icon: Share2 }
	]);
</script>

<div class="space-y-4 lg:sticky lg:top-24">
	<div class="space-y-5 rounded-2xl border border-border/70 bg-card/95 p-5 shadow-sm">
		<div class="space-y-3">
			<div class="flex flex-wrap items-center gap-2">
				<Badge>{update.categoryLabel}</Badge>
				{#if update.urgent}
					<Badge variant="destructive">Urgent</Badge>
				{/if}
			</div>
			<div class="space-y-2 text-sm text-secondary-foreground/75">
				<div class="flex items-center gap-2">
					<Clock3 class="h-4 w-4 text-primary" />
					<span>{update.timeAgo}</span>
				</div>
				<div class="flex items-center gap-2">
					<Calendar class="h-4 w-4 text-primary" />
					<span>{new Date(update.updatedAt).toLocaleDateString()}</span>
				</div>
			</div>
		</div>

		<div class="space-y-3 border-t border-border/60 pt-4">
			{#each metrics as metric}
				{@const MetricIcon = metric.icon}
				<div class="flex items-center justify-between gap-3 border-b border-border/40 pb-3 last:border-b-0 last:pb-0">
					<div class="flex items-center gap-2 text-sm text-secondary-foreground/75">
						<MetricIcon class="h-4 w-4 text-primary" />
						<span>{metric.label}</span>
					</div>
					<p class="text-sm font-semibold text-foreground">{metric.value}</p>
				</div>
			{/each}
		</div>

		<div class="flex flex-col gap-2 border-t border-border/60 pt-4">
			<Button href="/community/news-and-updates" variant="ghost" class="justify-start px-0 text-foreground hover:text-primary">
				Back to Updates
			</Button>
			<Button href="/community" variant="ghost" class="justify-start px-0 text-muted-foreground hover:text-foreground">
				Return to Community
			</Button>
		</div>
	</div>
</div>
