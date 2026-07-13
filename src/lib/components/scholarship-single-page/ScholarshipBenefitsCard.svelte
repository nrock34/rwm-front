<script>
    import { CheckCircle } from "lucide-svelte";
    import * as Card from "../ui/card";
    let { scholarship } = $props();

    const benefits = $derived(Array.isArray(scholarship.benefits) ? scholarship.benefits : []);
</script>

<Card.Root class="p-5 px-6 gap-0">
    <h2 class="text-lg font-semibold text-foreground mb-4">Benefits & Coverage</h2>
    {#if benefits.length > 0}
        <div class="grid grid-cols-2 gap-3">
            {#each benefits as benefit, idx}
                <div key={idx} class="flex items-center space-x-2">
                    <CheckCircle class="h-4 w-4 text-green-600"/>
                    <span class="text-[0.92rem] text-muted-foreground">{benefit}</span>
                </div>
            {/each}
        </div>
    {:else}
        <p class="text-[0.92rem] text-muted-foreground">
            Benefits and coverage details have not been provided yet.
        </p>
    {/if}
</Card.Root>
