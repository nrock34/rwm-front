<script>
	import { Button } from "$lib/components/ui/button";

	let { post } = $props();
</script>

<article class="space-y-2 rounded-xl border border-border/60 bg-background/80 p-3.5">
	<div class="space-y-1.5">
		<p class="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-primary/80">{post.categoryLabel}</p>
		<h3 class="line-clamp-2 text-sm font-semibold text-foreground">{post.title || "Community discussion"}</h3>
		<p class="line-clamp-2 text-xs leading-5 text-muted-foreground">{post.content}</p>
	</div>
	<div class="flex items-center justify-between gap-3 text-xs text-muted-foreground">
		<span class="truncate">{post.author.name}</span>
		<span>{post.timestampLabel}</span>
	</div>
	<Button href={post.href} variant="ghost" class="h-8 justify-start px-0 text-primary hover:text-primary">
		Open Discussion
	</Button>
</article>
