<script>
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import * as Card from "$lib/components/ui/card";
	import { Mail } from "lucide-svelte";

	let { result = null } = $props();
</script>

<Card.Root class="gap-2 border-ring bg-ring/10 sm:gap-4">
	<Card.Header class="gap-1 sm:gap-2">
		<div class="flex items-center gap-2 sm:gap-3">
			<Mail class="w-4" />
			<h3 class="text-xs font-semibold text-foreground sm:text-sm">Want to Stay Updated?</h3>
		</div>
			<p class="text-meta-xs text-secondary-foreground sm:text-xs">
				Get monthly updates with the latest community highlights and opportunities.
			</p>
	</Card.Header>

	<Card.Content>
		<form class="space-y-1 sm:space-y-3" method="POST" action="?/newsletterSignup">
			<Input name="email" type="email" placeholder="Enter your email" class="h-7 text-xs sm:h-11 sm:text-sm" required />
			<Button type="submit" class="h-6 w-full text-xs sm:text-sm">Subscribe</Button>
		</form>

		{#if result?.status === "success"}
			<p class="mt-2 text-xs text-secondary-foreground">You’re subscribed. We’ll keep you posted.</p>
		{:else if result?.error}
			<p class="mt-2 text-xs text-destructive">{result.description ?? result.error}</p>
		{/if}

			<p class="text-micro-xs mt-2 ml-[1px] text-secondary-foreground">Unsubscribe anytime.</p>
		</Card.Content>
</Card.Root>
