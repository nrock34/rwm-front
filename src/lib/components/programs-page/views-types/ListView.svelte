<script>
    import Badge from "$lib/components/ui/badge/badge.svelte";
import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import Toggle from "$lib/components/ui/toggle/toggle.svelte";
    import { Bookmark, Calendar, DollarSign, Link, MapPin, Star, Users } from "lucide-svelte";


    let { savedPrograms = $bindable(), compareList = $bindable(), sortedPrograms } = $props()

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
        
        {@const isSaved = savedPrograms.has(program.id)}
        {@const isComparing = compareList.has(program.id)}

        <div key={program.id} class="bg-background flex-1 max-w-full p-6 border-muted-foreground/30 border-1 rounded-xl">
            <div class="flex w-full items-start space-x-4">
                <img
                    src={program.image}
                    alt={program.title}
                    class="w-24 h-24 object-cover rounded" 
                />

                <div class="flex-1">
                    <div class="flex items-start justify-between mb-2">
                        <div>
                            <div class="flex items-center space-x-2">
                                <a
                                    href={`/programs/${program.id}`}
                                    class="font-semibold text-foreground hover:text-primary transition-colors"
                                >
                                    {program.title}
                                </a>
                                {#if program.featured}
                                    <Badge class="text-xs ml-1">Featured</Badge>
                                {/if}
                            </div>
                            <p class="text-sm text-secondary-foreground">{program.provider}</p>
                            <div class="flex items-center space-x-1 mt-1">
                                <MapPin class="h-4 w-4"/>
                                <span class="text-sm text-muted-foreground">{program.location}</span>
                            </div>
                        </div>

                        <div class="flex items-center space-x-2">
                            <div class="flex items-center space-x-1">
                                <Star class="h-4 w-4 text-yellow-500 fill-current"/>
                                <span class="font-medium">{program.rating}</span>
                            </div>
                            <Toggle>
                                <Bookmark class="h-4 w-4"/>
                            </Toggle>
                        </div>
                    </div>

                    <p class="text-sm text-secondary-foreground mb-3">
                        {program.description}
                    </p>

                    <div class="flex items-center space-x-5 text-sm text-secondary-foreground mb-3">
                        <div class="flex items-center space-x-1">
                            <Calendar class="h-3 w-3 text-secondary-foreground"/>
                            <span class="capitalize">{program.duration}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <DollarSign class="h-3 w-3 text-secondary-foreground"/>
                            <span class="font-medium">{program.cost}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <Users class="h-3 w-3 text-secondary-foreground"/>
                            <span>{program.participants} students</span>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex flex-wrap gap-2">
                            {#each program.highlights.slice(0, 4) as highlight, idx}
                                <span key={idx} class="text-xs bg-muted px-2 py-0.5 rounded-xl border border-border/30">
                                    {highlight}
                                </span>
                            {/each}
                        </div>

                        <div class="flex items-center space-x-3">
                            <Button>
                                {isComparing ? 'Remove from Compare' : 'Add to Compare'}
                            </Button>
                            <a 
                                class="text-sm"
                                href={`/programs/${program.id}`}
                            >
                                View Details
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>