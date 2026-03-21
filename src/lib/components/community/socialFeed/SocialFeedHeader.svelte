<script>
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Filter, Plus, Search } from "lucide-svelte";
	import { Input } from "$lib/components/ui/input";

	let {
		searchQuery = $bindable(),
		activeFilter = $bindable("all"),
		activeContentType = $bindable("all"),
		filters = [],
		contentTypes = [],
		createPostHref = "/community/posts/new"
	} = $props();
</script>

<div class="space-y-6">
	<Card.Root>
		<Card.Header>
			<div class="flex items-center justify-between gap-6">
				<div>
					<h1 class="font-bold text-primary md:text-xl lg:text-2xl">Social Feed</h1>
						<p class="text-muted-foreground md:text-sm lg:text-body-sm">Connect, share, and discover with fellow students and alumni.</p>
				</div>
				<Button href={createPostHref} class="h-fit text-xs has-[>svg]:px-6 lg:text-sm">
					<Plus class="h-4 w-4" />
					<span>Create Post</span>
				</Button>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="relative mb-6">
				<div class="absolute inset-y-0 left-0 flex items-center pl-3 pb-[2px]">
					<Search class="h-5 w-5 text-muted-foreground" />
				</div>
				<Input bind:value={searchQuery} type="text" placeholder="Search posts, topics, or tags..." class="block w-full pl-10 pr-3" />
			</div>

			<div class="mb-4 flex flex-wrap gap-2">
				<div class="flex items-center gap-2">
					<Filter class="h-4 w-4 text-secondary-foreground" />
					<span class="text-xs font-medium text-secondary-foreground lg:text-sm">Topic:</span>
				</div>
				{#each filters as filter}
					<Button onclick={() => (activeFilter = filter.id)} variant={activeFilter === filter.id ? "secondary" : "outline"} class="h-fit text-xs lg:text-sm">
						<span>{filter.name}</span>
					</Button>
				{/each}
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<span class="text-xs font-medium text-secondary-foreground lg:text-sm">Type:</span>
				{#each contentTypes as contentType}
					<Button onclick={() => (activeContentType = contentType.id)} variant={activeContentType === contentType.id ? "secondary" : "outline"} class="h-fit text-xs lg:text-sm">
						{contentType.name}
					</Button>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
</div>
