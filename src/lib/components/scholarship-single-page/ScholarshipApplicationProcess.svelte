<script>
    import * as Card from "../ui/card";
    import { scholarship as fallbackScholarship } from "./testdata";

    let { scholarship = fallbackScholarship } = $props();

    const applicationProcess = $derived(
        Array.isArray(scholarship.applicationProcess) ? scholarship.applicationProcess : []
    );
</script>

<Card.Root class="p-5 px-6 gap-0">
    <h2 class="text-lg font-semibold text-foreground mb-4">Application Process</h2>
    {#if applicationProcess.length > 0}
        <div class="space-y-3.5">
            {#each applicationProcess as step, idx}
                <div key={idx} class="flex space-x-4">
                    <div class="flex-shrink-0">
                        <div class="w-7 h-7 bg-primary/40 text-accent-foreground rounded-full flex items-center justify-center font-medium text-xs">
                            {step.step}
                        </div>
                    </div>
                    <div class="flex-1 leading-tight">
                        <h3 class="text-[0.95rem] font-medium text-foreground">{step.title}</h3>
                        <p class="text-[0.92rem] text-muted-foreground mb-2">{step.description}</p>
                        <p class="text-[0.92rem] text-secondary-foreground font-medium">{step.timeframe}</p>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p class="text-[0.92rem] text-muted-foreground">
            Application steps have not been provided yet.
        </p>
    {/if}
</Card.Root>
