<script>
	import * as Card from "$lib/components/ui/card";
	import { communityStats } from "$lib/mocks/community.js";
	import { Users } from "lucide-svelte";

	let { stats = communityStats } = $props();
</script>

<Card.Root>
	<Card.Header class="flex items-center space-x-2">
		<Users class="h-8 w-8 text-primary" />
		<h3 class="text-lg font-semibold">Community Stats</h3>
	</Card.Header>

	<Card.Content>
		<div class="grid grid-cols-2 gap-4 text-center">
			{#each stats as stat}
				<div>
					<p class="text-xl font-[900] text-primary">{stat.value}</p>
					<p class="text-xs text-secondary-foreground">{stat.name}</p>
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
