<script>
	import { Button } from "$lib/components/ui/button";

	let {
		previousHref = null,
		nextHref = null,
		previousLabel = "Newer",
		nextLabel = "Older",
		class: className = ""
	} = $props();
</script>

<div class={`flex items-center justify-between gap-3 ${className}`.trim()}>
	{#if previousHref}
		<Button href={previousHref} variant="outline">{previousLabel}</Button>
	{:else}
		<Button disabled variant="outline">{previousLabel}</Button>
	{/if}

	{#if nextHref}
		<Button href={nextHref} variant="outline">{nextLabel}</Button>
	{:else}
		<Button disabled variant="outline">{nextLabel}</Button>
	{/if}
</div>
