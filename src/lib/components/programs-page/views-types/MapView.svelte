<script>
    import * as Card from "$lib/components/ui/card";
    import { ExternalLink, MapPin } from "lucide-svelte";

    let { programs = [] } = $props();
    let selectedId = $state(null);
    let selectedProgram = $derived(
        programs.find((program) => program.id === selectedId) ?? programs[0] ?? null
    );
    let mapQuery = $derived(selectedProgram?.location || selectedProgram?.title || "Study abroad");
    let embedUrl = $derived(`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`);
    let externalUrl = $derived(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`);
</script>

{#if selectedProgram}
    <Card.Root class="overflow-hidden p-0">
        <div class="grid min-h-[34rem] lg:grid-cols-[22rem_minmax(0,1fr)]">
            <div class="max-h-[34rem] overflow-y-auto border-b border-border lg:border-b-0 lg:border-r" aria-label="Program locations">
                <div class="sticky top-0 z-10 border-b border-border bg-card/95 p-4 backdrop-blur">
                    <h2 class="font-semibold text-foreground">Explore by location</h2>
                    <p class="text-xs text-muted-foreground">Select a program to center its destination.</p>
                </div>
                <div class="divide-y divide-border/70">
                    {#each programs as program (program.id)}
                        <button
                            type="button"
                            class={`w-full p-4 text-left transition-colors hover:bg-muted/60 ${selectedProgram.id === program.id ? "bg-primary/10" : ""}`}
                            aria-pressed={selectedProgram.id === program.id}
                            onclick={() => selectedId = program.id}
                        >
                            <span class="flex items-start gap-2">
                                <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span class="min-w-0">
                                    <span class="block truncate text-sm font-medium text-foreground">{program.title}</span>
                                    <span class="block truncate text-xs text-muted-foreground">{program.location}</span>
                                </span>
                            </span>
                        </button>
                    {/each}
                </div>
            </div>
            <div class="relative min-h-[28rem] bg-muted">
                <iframe
                    src={embedUrl}
                    title={`Map showing ${selectedProgram.location}`}
                    class="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
                <a
                    href={externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    class="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-md bg-background px-3 py-2 text-xs font-medium text-foreground shadow-md hover:bg-muted"
                >
                    Open full map <ExternalLink class="h-3.5 w-3.5" />
                </a>
            </div>
        </div>
    </Card.Root>
{:else}
    <Card.Root class="p-12 text-center">
        <MapPin class="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <h2 class="font-medium text-foreground">No program locations to display</h2>
    </Card.Root>
{/if}
