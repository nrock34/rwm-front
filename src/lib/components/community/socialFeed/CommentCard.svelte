<script>
	import * as Avatar from "$lib/components/ui/avatar";

	let { comment } = $props();

	const avatarFallback = $derived(
		comment.author.name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? "")
			.join("") || "CM"
	);
</script>

<article class="py-4">
	<div class="flex items-start gap-3">
		<Avatar.Root class="h-10 w-10">
			<Avatar.Image src={comment.author.avatar ?? undefined} alt={comment.author.name} />
			<Avatar.Fallback>{avatarFallback}</Avatar.Fallback>
		</Avatar.Root>
		<div class="min-w-0 space-y-1">
			<div class="flex flex-wrap items-center gap-2 text-sm">
				<span class="font-semibold text-foreground">{comment.author.name}</span>
				<span class="text-muted-foreground">{comment.timestampLabel}</span>
			</div>
			<p class="leading-7 text-foreground/90">{comment.content}</p>
		</div>
	</div>
</article>
