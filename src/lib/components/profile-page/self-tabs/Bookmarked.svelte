<script>
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { X } from "lucide-svelte";
    import { savedItems } from "../test";

</script>


<div class="space-y-4">

    <h3 class="text-lg font-semibold text-foreground">Saved Items</h3>
    {#each savedItems as item}
        <Card.Root key={item.id} class="p-4 gap-0">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-1">
                        <h4 class="font-medium text-foreground">{item.title}</h4>
                        <span class="capitalize border-1 text-xs border-border bg-muted px-1.5 p-0.5 rounded-xl">
                            {item.type}
                        </span>
                    </div>
                    <p class="text-sm text-secondary-foreground mb-2">
                        {item.provider || item.author}
                    </p>
                    <div class="flex items-center space-x-4 text-xs text-secondary-foreground">
                        {#if item.amount}
                            <span>Amount: {item.amount}</span>
                        {:else if item.cost}
                            <span>Cost: {item.cost}</span>
                        {:else if item.downloads}
                            <span>Downloads: {item.downloads}</span>
                        {/if}
                        <span>Saved: {new Date(item.dateSaved).toLocaleDateString()}</span>
                    </div>
                </div>
                <Button variant='ghost text-secondary-foreground hover:text-destructive'>
                    <X class="h-4 w-4"/>
                </Button>
            </div>
        </Card.Root> 
    {/each}
</div>