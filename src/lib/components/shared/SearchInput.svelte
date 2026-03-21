<script>
    import { Search } from "lucide-svelte";
    import { Input } from "$lib/components/ui/input";

    let {
        value = $bindable(),
        label = "",
        placeholder = "Search...",
        containerClass = "",
        labelClass = "block text-sm",
        inputClass = "h-10 pl-10",
        iconClass = "w-5 h-5 text-muted-foreground"
    } = $props();
</script>

<div class={containerClass}>
    {#if label}
        <p class={labelClass}>{label}</p>
    {/if}
    <div class="relative">
        <div class="absolute inset-y-0 left-3 flex items-center">
            <Search class={iconClass} />
        </div>
        <Input
            type="text"
            {placeholder}
            class={inputClass}
            value={value}
            oninput={(event) => {
                value = event.target.value;
            }}
        />
    </div>
</div>
