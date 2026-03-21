<script>
    import * as Card from "$lib/components/ui/card";

    let {
        title = "",
        rootClass = "gap-0 p-6 px-7",
        titleClass = "mb-4 text-xl font-semibold text-foreground"
    } = $props();
</script>

<Card.Root class={rootClass}>
    {#if title}
        <h2 class={titleClass}>{title}</h2>
    {/if}
    <slot />
</Card.Root>
