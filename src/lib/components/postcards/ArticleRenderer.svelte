<script>
	import { ExternalLink, Info, Lightbulb, TriangleAlert } from "lucide-svelte";
	import ResilientImage from "$lib/components/shared/ResilientImage.svelte";

	let { blocks = [] } = $props();

	function calloutClasses(tone) {
		if (tone === "warning") return "border-amber-400/70 bg-amber-50 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100";
		if (tone === "success") return "border-green-500/60 bg-green-50 text-green-950 dark:bg-green-950/30 dark:text-green-100";
		if (tone === "tip") return "border-primary/60 bg-accent text-accent-foreground";
		return "border-blue-500/60 bg-blue-50 text-blue-950 dark:bg-blue-950/30 dark:text-blue-100";
	}
</script>

<article class="prose prose-neutral max-w-none dark:prose-invert prose-a:text-primary prose-img:rounded-xl prose-headings:scroll-mt-24">
	{#if blocks.length === 0}
		<div class="not-prose rounded-lg border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
			This postcard’s story is still being prepared. Please check back soon.
		</div>
	{:else}
		{#each blocks as block, index (`${block.kind}-${index}`)}
			{#if block.kind === "paragraph" || block.kind === "legacy_html"}
				<!-- The domain sanitizer produces this allowlisted HTML on the server. -->
				<div class:legacy-article-content={block.kind === "legacy_html"}>{@html block.html}</div>
			{:else if block.kind === "heading"}
				{#if block.level === 3}
					<h3 id={block.id}>{block.text}</h3>
				{:else if block.level === 4}
					<h4 id={block.id}>{block.text}</h4>
				{:else}
					<h2 id={block.id}>{block.text}</h2>
				{/if}
			{:else if block.kind === "image"}
				<figure>
					<ResilientImage src={block.src} fallbackSrc={null} hideOnError={true} alt={block.alt} class="max-h-[42rem] w-full rounded-xl object-cover" loading="lazy" />
					{#if block.caption || block.credit}
						<figcaption>{block.caption}{#if block.caption && block.credit} · {/if}{#if block.credit}{block.credit}{/if}</figcaption>
					{/if}
				</figure>
			{:else if block.kind === "quote"}
				<blockquote>
					<p>{block.text}</p>
					{#if block.attribution}<footer>— {block.attribution}</footer>{/if}
				</blockquote>
			{:else if block.kind === "list"}
				{#if block.ordered}
					<ol>{#each block.items as item}<li>{item}</li>{/each}</ol>
				{:else}
					<ul>{#each block.items as item}<li>{item}</li>{/each}</ul>
				{/if}
			{:else if block.kind === "callout"}
				<aside class={`not-prose my-7 flex gap-3 rounded-xl border-l-4 p-5 ${calloutClasses(block.tone)}`}>
					{#if block.tone === "warning"}<TriangleAlert class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
					{:else if block.tone === "tip"}<Lightbulb class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
					{:else}<Info class="mt-0.5 size-5 shrink-0" aria-hidden="true" />{/if}
					<div>{#if block.title}<p class="font-semibold">{block.title}</p>{/if}<p class="text-sm leading-relaxed">{block.text}</p></div>
				</aside>
			{:else if block.kind === "divider"}
				<hr />
			{:else if block.kind === "code"}
				<pre aria-label={block.language ? `${block.language} code` : "Code sample"}><code>{block.code}</code></pre>
			{:else if block.kind === "link"}
				<a class="not-prose my-6 flex items-start justify-between gap-4 rounded-xl border border-border p-5 no-underline hover:bg-muted/50" href={block.href} target="_blank" rel="noopener noreferrer">
					<span><span class="block font-semibold text-foreground">{block.title}</span>{#if block.description}<span class="mt-1 block text-sm text-muted-foreground">{block.description}</span>{/if}</span>
					<ExternalLink class="size-4 shrink-0" aria-hidden="true" />
				</a>
			{/if}
		{/each}
	{/if}
</article>

<style>
	.legacy-article-content :global(img) {
		max-height: 42rem;
		width: 100%;
		object-fit: cover;
		border-radius: 0.75rem;
	}

	.legacy-article-content :global(table) {
		display: block;
		overflow-x: auto;
	}
</style>
