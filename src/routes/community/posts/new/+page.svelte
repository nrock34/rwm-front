<script>
	import PostComposerSidebar from "$lib/components/community/socialFeed/PostComposerSidebar.svelte";
	import PostForm from "$lib/components/forms/community/post-form.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { ArrowLeft } from "lucide-svelte";

	let { data } = $props();
</script>

<div class="page-shell mx-auto w-full px-6 py-10 sm:px-10 md:px-14 lg:py-12">
	<div class="space-y-3">
		<Button href="/community/posts" variant="ghost" class="w-fit">
			<ArrowLeft class="h-4 w-4" />
			Back to Posts
		</Button>

		<div class="max-w-3xl space-y-2">
			<p class="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">Community</p>
			<h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Create a Post</h1>
			<p class="text-sm leading-6 text-muted-foreground sm:text-base">
				Start a conversation, share an update, or ask a question using the same categories and post types the archive already understands.
			</p>
		</div>
	</div>

	<div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
		<Card.Root class="gap-6 border-border/70 bg-card/95 p-6 shadow-sm sm:p-8">
			<Card.Header class="p-0">
				<Card.Title class="text-2xl">Post Details</Card.Title>
				<Card.Description>
					Write clearly, add a topic and post type, and keep your tags useful for future search.
				</Card.Description>
			</Card.Header>
			<Card.Content class="p-0">
				<PostForm {data} />
			</Card.Content>
		</Card.Root>

		<PostComposerSidebar />
	</div>
</div>
