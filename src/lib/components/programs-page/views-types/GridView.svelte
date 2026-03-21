<script>

    import * as Card from '$lib/components/ui/card';
    import {Badge} from '$lib/components/ui/badge';
    import {Button} from '$lib/components/ui/button';
    import {Toggle} from '$lib/components/ui/toggle';
    import { Bookmark, Calendar, DollarSign, Globe, MapPin, Star, Users } from 'lucide-svelte';
    import X from '@lucide/svelte/icons/x';



    let { durations, savedPrograms = $bindable(), compareList = $bindable(), sortedPrograms } = $props()

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

    const bookmarkEnabled = false;

</script>


<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

    {#each sortedPrograms as program}

        {@const programDurationLabel = durations.find((d) => program.duration === d.id)?.name.split('-')[0]}
        {@const isSaved = savedPrograms.has(program.id)}
        {@const isComparing = compareList.has(program.id)}

       <Card.Root
            key={program.id}
            class="col-span-1 m-0 gap-0 overflow-hidden border-border/70 bg-gradient-to-br from-card via-card to-muted/18 py-0 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
        >
            
            <div class="relative">
                <img
                    src={program.image}
                    alt={program.title}
                    class="h-44 w-full object-cover" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-background/96 via-background/36 to-transparent"></div>
                {#if program.featured}
                    <div class="absolute top-3 left-3">
                        <Badge class="bg-primary/92 text-primary-foreground shadow-sm">
                            Featured
                        </Badge>
                    </div>
                {/if}
                <div hidden={!bookmarkEnabled} class="absolute top-3 right-3 flex space-x-2">
                    <Toggle
                        class={`rounded-full ${isSaved ? 
                        'bg-primary text-primary-foreground' : 
                        'bg-white/80 text-foreground hover:bg-white'}`}
                    >
                        <Bookmark class="h-4 h-4"/>
                    </Toggle>
                </div>
                <div class="absolute inset-x-0 bottom-0 flex items-end justify-end gap-3 px-3 py-2.5">
                    <div class="flex items-center gap-1 rounded-full border border-border/70 bg-card/88 px-2 py-0.75 shadow-sm backdrop-blur">
                        <Star class="tone-star h-3 w-3 fill-current" />
                        <span class="text-xs font-semibold text-foreground">{program.rating}</span>
                    </div>
                </div>
            </div>


            <div class="flex h-full flex-col justify-between p-4">
                <div class="space-y-3">
                    <div class="space-y-1.5">
                        <div class="space-y-1">
                            <p class="truncate text-[0.68rem] font-medium uppercase tracking-[0.2em] text-primary/95">
                                {program.provider}
                            </p>
                            <div class="flex items-center gap-1 text-[0.72rem] text-muted-foreground">
                                <MapPin class="h-3 w-3 text-primary/85" />
                                <span class="truncate">{program.location}</span>
                            </div>
                        </div>
                        <a
                            href={`/programs/${program.id}`}
                            class="block text-[0.98rem] font-semibold leading-snug tracking-tight text-foreground transition-colors hover:text-primary"
                        >
                            {program.title}
                        </a>
                        <p class="line-clamp-2 text-xs leading-5 text-secondary-foreground/95">
                            {program.description}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-x-3 gap-y-2 border-y border-border/55 py-2.5">
                        <div class="space-y-0.5">
                            <div class="flex items-center gap-1.5 text-secondary-foreground">
                                <Calendar class="h-3 w-3 text-primary/85" />
                                <span class="text-[0.64rem] uppercase tracking-[0.16em]">Duration</span>
                            </div>
                            <p class="text-[0.8rem] font-medium capitalize leading-5 text-foreground">{programDurationLabel}</p>
                        </div>
                        <div class="space-y-0.5">
                            <div class="flex items-center gap-1.5 text-secondary-foreground">
                                <DollarSign class="h-3 w-3 text-primary/85"/>
                                <span class="text-[0.64rem] uppercase tracking-[0.16em]">Cost</span>
                            </div>
                            <p class="text-[0.8rem] font-medium leading-5 text-foreground">{program.cost}</p>
                        </div>
                        <div class="space-y-0.5">
                            <div class="flex items-center gap-1.5 text-secondary-foreground">
                                <Users class="h-3 w-3 text-primary/85"/>
                                <span class="text-[0.64rem] uppercase tracking-[0.16em]">Students</span>
                            </div>
                            <p class="text-[0.8rem] font-medium leading-5 text-foreground">{program.participants}</p>
                        </div>
                        <div class="space-y-0.5">
                            <div class="flex items-center gap-1.5 text-secondary-foreground">
                                <Globe class="h-3 w-3 text-primary/85"/>
                                <span class="text-[0.64rem] uppercase tracking-[0.16em]">Language</span>
                            </div>
                            <p class="text-[0.8rem] font-medium capitalize leading-5 text-foreground">{program.language}</p>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                    {#each program.highlights.slice(0, 3) as highlight, idx}
                        <span
                            key={idx}
                            class="rounded-full border border-border/55 bg-background/68 px-2 py-0.75 text-[0.68rem] font-medium text-secondary-foreground"
                        >
                            {highlight}
                        </span>
                    {/each}
                    {#if program.highlights.length > 3}
                        <span class="rounded-full border border-border/60 bg-background/70 px-2 py-0.75 text-[0.68rem] font-medium text-muted-foreground">
                            +{program.highlights.length - 3} more
                        </span>
                    {/if}
                    </div>
                </div>

                <div class="mt-4 flex items-center justify-end border-t border-border/60 pt-3">
                    <!-- add compare here -->
                    <Button hidden variant="ghost" class={`text-foreground/70 pl-3 cursor-pointer hover:bg-transparent hover:underline hover:text-accent-foreground/60 ${compareList.has(program.id) ? 'text-accent-foreground/90' : ''}`}
                        onclick={() => {
                            if (!compareList.delete(program.id)) {
                                compareList.add(program.id)
                            }
                        }}>
                        {isComparing ? 'Remove From Compare' : 'Add To Compare'} {#if isComparing} <X class="h-5"/> {/if}
                    </Button>
                    <Button
                        href={`/programs/${program.id}`}
                        class="h-9 w-full text-xs shadow-sm"    
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </Card.Root>
    {/each}
</div>
