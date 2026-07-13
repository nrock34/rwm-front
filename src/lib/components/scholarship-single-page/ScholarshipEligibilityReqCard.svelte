<script>
    import { BadgeAlert } from "lucide-svelte";
    import * as Card from "../ui/card";
    let { scholarship } = $props();

    const eligibility = $derived(Array.isArray(scholarship.eligibility) ? scholarship.eligibility : []);
</script>

<Card.Root class="p-5 px-6 gap-0">
    <h2 class="text-lg font-semibold text-foreground mb-4">
        Eligibility & Requirements
    </h2>
    <div class="space-y-2">
        {#each eligibility as requirement, idx}
            <div key={idx} class="flex items-center space-x-2">
                <BadgeAlert class="h-4 w-4 text-yellow-500"/>
                <span class="text-[0.92rem] text-muted-foreground">{requirement}</span>
            </div>
        {/each}
    </div>
</Card.Root>
