<script>
	import * as Avatar from "$lib/components/ui/avatar";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import ResilientImage from "$lib/components/shared/ResilientImage.svelte";
	import { Clock3, Heart, MessageSquareReply, Tag } from "lucide-svelte";

	let { post, currentPath = "/community" } = $props();

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

<article class="space-y-4 border-b border-border/70 pb-5">
	<div class="max-w-3xl">
		<div class="flex items-center gap-3">
			<Avatar.Root class="h-10 w-10 shrink-0">
			<Avatar.Image src={post.author.avatar ?? undefined} alt={post.author.name} />
			<Avatar.Fallback>{avatarFallback}</Avatar.Fallback>
			</Avatar.Root>
			<div class="min-w-0 self-center -space-y-0.5">
				<div class="flex flex-wrap items-center gap-1.5">
					<span class="font-semibold text-foreground">{post.author.name}</span>
					<Badge variant="outline" class="h-6 px-2 text-[0.68rem]">{post.typeLabel}</Badge>
					<Badge class="h-6 px-2 text-[0.68rem]">{post.categoryLabel}</Badge>
				</div>
				<div class="flex flex-wrap items-center gap-1.5 text-[0.82rem] text-muted-foreground">
					<Clock3 class="h-3.5 w-3.5" />
					<span>{post.timestampLabel}</span>
					<span>•</span>
					<span>{post.views} views</span>
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-3xl space-y-3">
		{#if post.title}
			<h1 class="post-thread-title-copy font-semibold tracking-tight text-foreground">{post.title}</h1>
		{/if}

		<p class="post-body-copy text-foreground/90">{post.content}</p>
	</div>

	{#if post.image}
		<div class="overflow-hidden rounded-2xl border border-border/70 bg-card">
			<ResilientImage
				src={post.image}
				fallbackSrc={null}
				alt={post.title || "Community post"}
				class="max-h-[18rem] w-full object-cover sm:max-h-[20rem] lg:max-h-[22rem]"
				hideOnError={true}
			/>
		</div>
	{/if}

	<div class="max-w-3xl space-y-2 border-t border-border/60 pt-3">
		{#if post.tags.length > 0}
			<div class="flex flex-wrap gap-1.5">
				{#each post.tags as tag}
					<Button
						href={`/community/posts?tag=${encodeURIComponent(tag)}`}
						variant="ghost"
						class="h-7 rounded-full border border-border/60 px-2.5 text-[0.72rem] text-muted-foreground hover:text-foreground"
					>
						<Tag class="h-3 w-3" />
						<span>{tag}</span>
					</Button>
				{/each}
			</div>
		{/if}

		<div class="flex flex-wrap items-center gap-1">
			<form method="POST" action={likeAction}>
				<Button variant="ghost" class={`h-8 px-2.5 ${post.viewerLiked ? "text-destructive hover:text-destructive" : ""}`}>
					<Heart class={`h-4 w-4 ${post.viewerLiked ? "fill-current" : ""}`} />
					<span>{post.likes}</span>
				</Button>
			</form>
			<Button href={`${post.href}#comments`} variant="ghost" class="h-8 px-2.5">
				<MessageSquareReply class="h-4 w-4" />
				<span>{post.comments}</span>
			</Button>
		</div>
	</div>
</article>
