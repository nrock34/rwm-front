<script>
    let {
        icon: IconComponent,
        text = "",
        iconClass = "h-4 w-4 text-secondary-foreground",
        textClass = "text-sm text-muted-foreground",
        rowClass = "flex items-center space-x-2"
    } = $props();
</script>

<div class={rowClass}>
    {#if IconComponent}
        <IconComponent class={iconClass} />
    {/if}
    <span class={textClass}>{text}</span>
</div>
