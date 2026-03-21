<script>
    import * as Select from "$lib/components/ui/select";

    let {
        value = $bindable(),
        options = [],
        label = "",
        wrapperClass = "",
        labelClass = "block text-sm font-medium",
        triggerClass = ""
    } = $props();

    const selectedLabel = $derived(
        options.find((option) => option.id === value)?.name ?? options[0]?.name ?? ""
    );
</script>

<div class={wrapperClass}>
    {#if label}
        <p class={labelClass}>{label}</p>
    {/if}
    <Select.Root type="single" bind:value>
        <Select.Trigger class={triggerClass}>
            {selectedLabel}
        </Select.Trigger>
        <Select.Content>
            {#each options as option}
                <Select.Item value={option.id} label={option.name} />
            {/each}
        </Select.Content>
    </Select.Root>
</div>
