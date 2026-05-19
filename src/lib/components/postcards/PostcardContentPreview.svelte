<script>
	import * as Card from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import PostcardContentBlock from "./PostcardContentBlock.svelte";

	let {
		document,
		source = "mock",
		showJsonByDefault = false
	} = $props();

	let showJson = $state(showJsonByDefault);

	const sourceLabel = source === "api" ? "API content" : source === "edited" ? "Edited preview" : "Mock content";

	function getBlockMarginClass(block) {
		return typeof block?.mb === "string" && block.mb.trim()
			? block.mb.trim()
			: "mb-5 last:mb-0";
	}
</script>

<Card.Root class="gap-0 pt-0 overflow-hidden">
	<Card.Header class="gap-3 px-6 py-5">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div class="space-y-1">
				<Card.Title class="text-xl">Block Content Preview</Card.Title>
				<Card.Description class="max-w-2xl text-sm leading-6">
					Editor.js-style postcard content rendered from structured blocks instead of a single raw HTML blob.
				</Card.Description>
			</div>
			<Badge variant="outline" class="uppercase tracking-[0.14em]">
				{sourceLabel}
			</Badge>
		</div>
	</Card.Header>

	<Separator />

	<Card.Content class="px-6 py-6">
		{#each document.blocks as block}
			<div class={getBlockMarginClass(block)}>
				<PostcardContentBlock {block} />
			</div>
		{/each}
	</Card.Content>
</Card.Root>

<div class="mt-4">
	<Button variant="outline" type="button" onclick={() => (showJson = !showJson)}>
		{showJson ? "Hide JSON" : "Show JSON"}
	</Button>
</div>

{#if showJson}
	<Card.Root class="mt-4 gap-0 overflow-hidden">
		<Card.Header class="px-6 py-4">
			<Card.Title class="text-base">Rendered payload</Card.Title>
		</Card.Header>
		<Separator />
		<Card.Content class="px-0 py-0">
			<pre class="overflow-x-auto bg-muted/55 p-6 text-xs leading-6 text-foreground">{JSON.stringify(document, null, 2)}</pre>
		</Card.Content>
	</Card.Root>
{/if}
