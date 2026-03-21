<script>
	import * as Avatar from "$lib/components/ui/avatar";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Separator } from "$lib/components/ui/separator";
	import { Clock3, ExternalLink, Heart, MessageSquareReply, Tag } from "lucide-svelte";

	let {
		post,
		currentPath = "/community",
		showReadPostButton = true,
		showImage = true
	} = $props();

	const avatarFallback = $derived(
		post.author.name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? "")
			.join("") || "CM"
	);

	const likeAction = $derived(`/community/posts/${post.id}/like?redirectTo=${encodeURIComponent(currentPath)}`);
</script>

<Card.Root class="gap-2 border-border/70 bg-card/95 p-5 transition-shadow hover:shadow-lg">
	<Card.Header>
		<div class="flex items-start justify-between gap-4">
			<div class="flex items-start gap-3">
				<Avatar.Root class="h-11 w-11">
					<Avatar.Image src={post.author.avatar ?? undefined} alt={post.author.name} />
					<Avatar.Fallback>{avatarFallback}</Avatar.Fallback>
				</Avatar.Root>
				<div class="-space-y-0.5">
					<div class="flex flex-wrap items-center gap-2">
						<h3 class="font-semibold text-foreground">{post.author.name}</h3>
						<Badge variant="outline">{post.typeLabel}</Badge>
						<Badge>{post.categoryLabel}</Badge>
					</div>
					<div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
						<Clock3 class="h-3.5 w-3.5" />
						<span>{post.timestampLabel}</span>
						<span>•</span>
						<span>{post.views} views</span>
					</div>
				</div>
			</div>

			<Button href={post.href} variant="ghost" class="shrink-0">
				<ExternalLink class="h-4 w-4" />
			</Button>
		</div>
	</Card.Header>

	<Card.Content class="space-y-4">
		{#if post.title}
			<h4 class="post-title-copy font-semibold text-foreground">{post.title}</h4>
		{/if}

		<p class="post-body-copy text-foreground/90">{post.content}</p>

		{#if showImage && post.image}
			<div class="overflow-hidden rounded-lg border border-border/60">
				<img src={post.image} alt={post.title || "Community post"} class="h-72 w-full object-cover" />
			</div>
		{/if}

		{#if post.tags.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each post.tags as tag}
					<Button href={`/community/posts?tag=${encodeURIComponent(tag)}`} variant="outline" class="h-8 rounded-full px-3 text-xs">
						<Tag class="h-3.5 w-3.5" />
						<span>{tag}</span>
					</Button>
				{/each}
			</div>
		{/if}

		<Separator />

		<div class="flex flex-wrap items-center justify-between gap-3">
			<div class="flex flex-wrap items-center gap-2">
				<form method="POST" action={likeAction}>
					<Button variant="ghost" class={post.viewerLiked ? "text-destructive hover:text-destructive" : ""}>
						<Heart class={`h-4 w-4 ${post.viewerLiked ? "fill-current" : ""}`} />
						<span>{post.likes}</span>
					</Button>
				</form>
				<Button href={`${post.href}#comments`} variant="ghost">
					<MessageSquareReply class="h-4 w-4" />
					<span>{post.comments}</span>
				</Button>
			</div>

			{#if showReadPostButton}
				<Button href={post.href} variant="outline">Read Post</Button>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
