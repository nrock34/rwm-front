<script>
    import { Badge } from "$lib/components/ui/badge";
import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Calendar, DollarSign, Globe, MapPin, Star, Users } from "lucide-svelte";


    let { savedPrograms = $bindable(), compareList = $bindable(), sortedPrograms, durations } = $props()

    const updateSavedPrograms = (id) => {
        if(!savedPrograms.delete(id)) {
            savedPrograms.add(id)
        }
    }

    const updateCompareList = (id) => {
        if(!compareList.delete(id)) {
            compareList.add(id)
        }
    }

</script>




<div class="space-y-4 flex-1 flex flex-col w-full">

    {#each sortedPrograms as program}
        
        {@const programDurationLabel = durations.find((d) => program.duration === d.id)?.name.split('-')[0]}
        {@const isSaved = savedPrograms.has(program.id)}
        {@const isComparing = compareList.has(program.id)}

        <Card.Root
            key={program.id}
            class="flex-1 max-w-full overflow-hidden border-border/70 bg-gradient-to-br from-card via-card to-muted/12 p-0 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
        >
            <div class="flex w-full flex-col items-stretch sm:flex-row">
                <img
                    src={program.image}
                    alt={program.title}
                    class="h-32 w-full object-cover sm:h-auto sm:w-36" 
                />

                <div class="flex flex-1 flex-col justify-between p-4">
                    <div class="mb-3 flex items-start justify-between gap-4">
                        <div class="min-w-0">
                            <div class="space-y-1.5">
                                <div class="space-y-1">
                                    <p class="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-primary/95">{program.provider}</p>
                                    <div class="flex items-center gap-1">
                                        <MapPin class="h-3 w-3 text-primary/85"/>
                                        <span class="text-xs text-muted-foreground">{program.location}</span>
                                    </div>
                                </div>
                                <div class="flex flex-wrap items-center gap-2">
                                <a
                                    href={`/programs/${program.id}`}
                                    class="text-[0.98rem] font-semibold leading-snug tracking-tight text-foreground transition-colors hover:text-primary"
                                >
                                    {program.title}
                                </a>
                                {#if program.featured}
                                    <Badge class="bg-primary/92 text-xs text-primary-foreground">Featured</Badge>
                                {/if}
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <div class="flex items-center gap-1 rounded-full border border-border/70 bg-secondary/45 px-2 py-0.75 shadow-sm">
                                <Star class="tone-star h-3 w-3 fill-current"/>
                                <span class="text-xs font-semibold text-foreground">{program.rating}</span>
                            </div>
                        </div>
                    </div>

                    <p class="mb-3 line-clamp-2 text-xs leading-5 text-secondary-foreground/95">
                        {program.description}
                    </p>

                    <div class="mb-3 grid gap-0 border-y border-border/55 py-2 sm:grid-cols-2 lg:grid-cols-4">
                        <div class="border-b border-border/55 px-2.5 py-1 sm:border-r lg:border-b-0">
                            <div class="flex items-center gap-2 text-secondary-foreground">
                                <Calendar class="h-3 w-3 text-primary/85"/>
                                <span class="text-[0.64rem] uppercase tracking-[0.16em]">Duration</span>
                            </div>
                            <p class="mt-0.5 text-[0.8rem] font-medium capitalize leading-5 text-foreground">{programDurationLabel}</p>
                        </div>
                        <div class="border-b border-border/55 px-2.5 py-1 lg:border-b-0 lg:border-r">
                            <div class="flex items-center gap-2 text-secondary-foreground">
                                <DollarSign class="h-3 w-3 text-primary/85"/>
                                <span class="text-[0.64rem] uppercase tracking-[0.16em]">Cost</span>
                            </div>
                            <p class="mt-0.5 text-[0.8rem] font-medium leading-5 text-foreground">{program.cost}</p>
                        </div>
                        <div class="px-2.5 py-1 sm:border-r sm:border-border/55">
                            <div class="flex items-center gap-2 text-secondary-foreground">
                                <Users class="h-3 w-3 text-primary/85"/>
                                <span class="text-[0.64rem] uppercase tracking-[0.16em]">Students</span>
                            </div>
                            <p class="mt-0.5 text-[0.8rem] font-medium leading-5 text-foreground">{program.participants}</p>
                        </div>
                        <div class="px-2.5 py-1">
                            <div class="flex items-center gap-2 text-secondary-foreground">
                                <Globe class="h-3 w-3 text-primary/85"/>
                                <span class="text-[0.64rem] uppercase tracking-[0.16em]">Language</span>
                            </div>
                            <p class="mt-0.5 text-[0.8rem] font-medium capitalize leading-5 text-foreground">{program.language}</p>
                        </div>
                    </div>

                    <div class="flex flex-col gap-3 border-t border-border/60 pt-3 lg:flex-row lg:items-center lg:justify-between">
                        <div class="flex flex-wrap gap-2">
                            {#each program.highlights.slice(0, 4) as highlight, idx}
                                <span
                                    key={idx}
                                    class="rounded-full border border-border/60 bg-muted/70 px-2 py-0.75 text-[0.68rem] font-medium text-secondary-foreground"
                                >
                                    {highlight}
                                </span>
                            {/each}
                        </div>

                        <div class="flex items-center space-x-3">
                            <Button 
                                class="h-9 text-xs shadow-sm"
                                href={`/programs/${program.id}`}
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card.Root>
    {/each}
</div>
