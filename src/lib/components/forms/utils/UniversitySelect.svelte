<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Command from "$lib/components/ui/command";
    
    import * as Popover from "$lib/components/ui/popover";
    import { Check, ChevronsUpDown } from "lucide-svelte";

    let { value = $bindable(), className , formProps, } = $props()
    let searchValue = $state('')

    const universities = [
        {value: 'sju', label: 'St. John\'s University'},
        {value: 'sjp', label: 'St. Joesph\'s University'},
        {value: 'nyu', label: 'New York University'}
    ]

</script>

<div class={className + " flex"}>
    <Popover.Root>
        <Popover.Trigger>
            {#snippet child({ props })}
                <Button
                    {...props}
                    variant="outline"
                    role="combobox"
                    class="w-full h-full"
                    >
                    <span class="flex items-center py-5 justify-between w-full">
                        {value ?
                            universities.find((uni) => uni.value === value)?.label
                        : "Select University"}
                        <ChevronsUpDown class="h-4 w-4 shrink-0" />
                    </span>
                </Button>
            {/snippet}
        </Popover.Trigger>
        <Popover.Content class="p-0">
            <Command.Root>
                <Command.Input
                    bind:value={searchValue} 
                    placeholder="Search"/>
                <Command.Empty>No university found.</Command.Empty>
                <Command.Group>
                    {#each universities as uni}
                        <Command.Item
                            class="flex w-full justify-between"
                            key={uni.value}
                            value={uni.value}
                            onSelect={
                                () => {value = uni.value}
                            }
                        >
                            <span>{uni.label}</span>
                            {#if value === uni.value}
                                <Check width=10 class="text-foreground w-3 h-3"/>
                            {/if}
                        </Command.Item>

                    {/each}
                </Command.Group>
            </Command.Root>
        </Popover.Content>
    </Popover.Root>
</div>