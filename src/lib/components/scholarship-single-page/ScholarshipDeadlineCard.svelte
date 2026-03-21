<script>
    import { Clock } from "lucide-svelte";
    import * as Card from "../ui/card";
    let { daysLeft = 0 } = $props();

    const remainingDays = $derived(daysLeft === 'TODAY' ? 0 : Number(daysLeft ?? 0));
    const isToday = $derived(daysLeft === 'TODAY');
    const isPassed = $derived(!isToday && remainingDays < 0);
</script>

<Card.Root class={`p-5 px-6 gap-0 ${isPassed ? 'bg-destructive/5 border-destructive/20' : 'bg-ring/5 border-primary/30'}`}>
    <div class="flex items-center space-x-2 mb-2">
        <Clock class={`h-5 w-5 ${isPassed ? 'text-destructive/80' : 'text-accent-foreground'}`}/>
        <h3 class="text-[0.95rem] font-semibold text-foreground">
            {isPassed ? 'Deadline Passed' : 'Deadline Alert'}
        </h3>
    </div>
    <p class="text-[0.92rem] text-muted-foreground mb-3">
        {#if isPassed}
            This application deadline has already passed.
        {:else if isToday}
            Application deadline is today.
        {:else}
            Application deadline is in {remainingDays} days
        {/if}
    </p>
    <div class="text-center">
        <div class={`text-xl font-bold ${isPassed ? 'text-destructive/80' : 'text-accent-foreground'}`}>
            {#if isPassed}
                Closed
            {:else if isToday}
                Today
            {:else}
                {remainingDays}
            {/if}
        </div>
        <div class="text-xs text-secondary-foreground font-n">
            {#if isPassed}
                application window ended
            {:else if isToday}
                deadline day
            {:else}
                days remaining
            {/if}
        </div>
    </div>
</Card.Root>
