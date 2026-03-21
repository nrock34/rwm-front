<script>
    let {
        label = "",
        value = "",
        wrapperClass = "",
        valueClass = "text-sm font-medium",
        labelClass = "text-xs text-muted-foreground"
    } = $props();
</script>

<div class={wrapperClass}>
    <p class={valueClass}>{value}</p>
    <p class={labelClass}>{label}</p>
</div>
