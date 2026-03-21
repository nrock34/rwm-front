<script>
    import { Globe } from "lucide-svelte";
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    let { data } = $props();
</script>

<div class="relative bg-muted grid min-h-screen w-full place-items-center p-4 sm:p-8 lg:p-12">

    <Card.Root class="mx-auto w-full max-w-4xl gap-0 p-8 sm:p-10">
        <Card.Header class="space-y-2 px-0 pt-0">
            <Card.Title class="text-2xl font-serif">Onboarding Test Success</Card.Title>
            <Card.Description class="text-sm sm:text-base">
                This is the mapped onboarding payload captured from the completed form.
            </Card.Description>
        </Card.Header>

        <Card.Content class="space-y-6 px-0 pb-0">
            {#if data.payload}
                <div class="overflow-hidden rounded-lg border border-border bg-background">
                    <pre class="overflow-x-auto p-4 text-sm leading-6 text-foreground">{JSON.stringify(data.payload, null, 2)}</pre>
                </div>
            {:else}
                <div class="rounded-lg border border-dashed border-border bg-background/60 p-6 text-sm text-muted-foreground">
                    No onboarding payload was found. Complete the onboarding form first to inspect the mapped data here.
                </div>
            {/if}

            <div class="flex flex-wrap gap-3">
                <Button href="/onboarding" variant="outline">
                    Back to Onboarding
                </Button>
            </div>
        </Card.Content>
    </Card.Root>
</div>
