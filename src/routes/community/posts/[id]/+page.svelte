<script>
	import CommentCard from "$lib/components/community/socialFeed/CommentCard.svelte";
	import PostThread from "$lib/components/community/socialFeed/PostThread.svelte";
	import RelatedPostCard from "$lib/components/community/socialFeed/RelatedPostCard.svelte";
	import CommentForm from "$lib/components/forms/community/comment-form.svelte";
	import CursorPager from "$lib/components/shared/CursorPager.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as Select from "$lib/components/ui/select";
	import { ArrowLeft } from "lucide-svelte";
	import {
		COMMENT_SORT_OPTIONS,
		getPostOptionLabel
	} from "$lib/components/community/socialFeed/post-options.js";

	let { data } = $props();
	let commentSort = $state(data.commentSort);
	const commentSortLabel = $derived(getPostOptionLabel(COMMENT_SORT_OPTIONS, commentSort, "Newest first"));

	$effect(() => {
		commentSort = data.commentSort;
	});
</script>

<div class="mx-auto w-full max-w-[78rem] px-6 py-8 sm:px-10 sm:py-10 md:px-14 lg:py-12">
	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:items-start xl:gap-10">
		<div class="space-y-2 pb-1">
			<Button href="/community/posts" variant="ghost" class="w-fit">
				<ArrowLeft class="h-4 w-4" />
				Back to Posts
			</Button>
			<div class="max-w-2xl space-y-1">
				<p class="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">Community Discussion</p>
				<p class="text-sm text-muted-foreground">Follow the conversation and jump in where you can add something useful.</p>
			</div>
		</div>

		<aside class="order-3 space-y-4 lg:order-none lg:row-span-2 lg:sticky lg:top-24">
			<div class="space-y-2 border-b border-border/60 pb-4">
				<p class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-primary/80">Keep Browsing</p>
				<div class="flex flex-col gap-1">
					<Button href="/community/posts" variant="ghost" class="h-9 justify-start px-0">Browse All Posts</Button>
					{#if data.isAuthenticated}
						<Button href="/community/posts/new" variant="ghost" class="h-9 justify-start px-0">Create a Post</Button>
					{/if}
				</div>
			</div>
			{#if data.relatedPosts.length > 0}
				<Card.Root class="gap-4 border-border/70 bg-card/95 p-4 shadow-sm">
					<div class="space-y-1">
						<p class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-primary/80">More Discussions</p>
						<h2 class="text-lg font-semibold text-foreground">Related Posts</h2>
					</div>
					<div class="space-y-3">
						{#each data.relatedPosts as relatedPost (relatedPost.id)}
							<RelatedPostCard post={relatedPost} />
						{/each}
					</div>
				</Card.Root>
			{/if}
		</aside>

		<div class="order-2 min-w-0 space-y-4 lg:order-none">
				<PostThread post={data.post} currentPath={data.currentPath} />

				<section id="comments" class="space-y-4">
					<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<h2 class="text-lg font-semibold text-foreground">Comments</h2>
						<form method="GET" class="flex items-end gap-3">
							<Select.Root type="single" bind:value={commentSort}>
								<Select.Trigger class="h-9 min-w-40 justify-between">{commentSortLabel}</Select.Trigger>
								<Select.Content>
									{#each COMMENT_SORT_OPTIONS as option}
										<Select.Item value={option.id} label={option.label}>{option.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							<input type="hidden" name="sort_by" value={commentSort} />
							<Button type="submit" variant="outline" class="h-9 px-3">Sort</Button>
						</form>
					</div>

					{#if data.isAuthenticated}
						<Card.Root class="border-border/70 bg-card/95 p-4 shadow-none">
							<CommentForm data={data} />
						</Card.Root>
					{:else}
						<div class="flex flex-col gap-3 rounded-xl border border-dashed border-border/70 bg-secondary/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
							<div class="space-y-1">
								<h3 class="text-base font-semibold text-foreground">Log in to comment</h3>
								<p class="text-sm text-muted-foreground">You need an account to join the conversation on this post.</p>
							</div>
							<Button href={data.loginHref} class="w-fit">Log In to Comment</Button>
						</div>
					{/if}

					{#if data.commentsPage.results.length > 0}
						<div class="divide-y divide-border/60 rounded-2xl border border-border/70 bg-card/95 px-4 shadow-sm sm:px-5">
							{#each data.commentsPage.results as comment (comment.id)}
								<CommentCard {comment} />
							{/each}
						</div>
					{:else}
						<Card.Root class="items-center gap-4 border-dashed border-border/70 px-6 py-10 text-center shadow-none">
							<div class="space-y-2">
								<h3 class="text-xl font-semibold text-foreground">No comments yet</h3>
								<p class="max-w-xl text-sm text-muted-foreground">Be the first to add something thoughtful to the discussion.</p>
							</div>
						</Card.Root>
					{/if}

					<div class="pt-1">
						<CursorPager previousHref={data.commentPreviousHref} nextHref={data.commentNextHref} previousLabel="Newer Comments" nextLabel="Older Comments" />
					</div>
				</section>
			</div>
	</div>
</div>
