<script>

    import * as Card from '$lib/components/ui/card';
    import {Badge} from '$lib/components/ui/badge';
    import {Button} from '$lib/components/ui/button';
    import {Toggle} from '$lib/components/ui/toggle';
    import { Book, Bookmark, Calendar, DollarSign, Globe, MapPin, Star, Users } from 'lucide-svelte';
    import X from '@lucide/svelte/icons/x';



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


<div class="grid lg:grid-cols-3 gap-4">

    {#each sortedPrograms as program}

        {@const isSaved = savedPrograms.has(program.id)}
        {@const isComparing = compareList.has(program.id)}

       <Card.Root key={program.id} class="m-0 gap-0 col-span-1 overflow-hidden py-0">
            
            <div class="relative">
                <img
                    src={program.image}
                    alt={program.title}
                    class="w-full h-48 object-cover" 
                />
                {#if program.featured}
                    <div class="absolute top-3 left-3">
                        <Badge>
                            Featured
                        </Badge>
                    </div>
                {/if}
                <div class="absolute top-3 right-3 flex space-x-2">
                    <Toggle
                        
                        class={`rounded-full ${isSaved ? 
                        'bg-primary text-primary-foreground' : 
                        'bg-white/80 text-foreground hover:bg-white'}`}
                    >
                        <Bookmark class="h-4 h-4"/>
                    </Toggle>
                </div>
            </div>


            <div class="p-6 h-full flex-col flex justify-between">
                <div>
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <a
                            href={`/programs/${program.id}`}
                            class="font-semibold text-foreground hover:text-primary"
                        >
                            {program.title}
                        </a>
                        <p class="text-sm text-secondary-foreground">
                            {program.provider}
                        </p>
                        <div class="flex items-center space-x-1 mt-1">
                            <MapPin class="h-3 w-3"/>
                            <span class="text-sm text-muted-foreground">{program.location}</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-1">
                        <Star class="h-4 w-4 text-yellow-500 fill-current"/>
                        <span class="font-medium">{program.rating}</span>
                    </div>
                </div>
                <p class="rounded-l-xs border-l-3 border-secondary-foreground pl-2.5 text-sm text-secondary-foreground mb-5">{program.description}</p>
                </div>
                
                <div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="flex items-center space-x-2">
                        <Calendar class="h-4 w-4 text-secondary-foreground" />
                        <span class="text-sm capitalize">{program.duration}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <DollarSign class="h-4 w-4 text-muted-foreground"/>
                        <span class="text-sm font-medium">{program.cost}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <Users class="h-4 w-4 text-muted-foreground"/>
                        <span class="text-sm">{program.participants} students</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <Globe class="h-4 w-4 text-secondary-foreground"/>
                        <span class="text-sm capitalize">{program.language}</span>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-x-2 gap-y-2 mb-4">
                    {#each program.highlights.slice(0, 3) as highlight, idx}
                        <span key={idx} class="text-xs bg-muted/90 border-muted-foreground/20 border-1 rounded py-0.25 p-1 px-2">
                            {highlight}
                        </span>
                    {/each}
                    {#if program.highlights.length > 3}
                        <span class="text-xs bg-muted/90 border-muted-foreground/20 border-1 rounded py-0.25 p-1 px-2">
                            +{program.highlights.length - 3} more
                        </span>
                    {/if}
                </div>

                <div class="flex items-center justify-between mt-6">
                    <!-- add compare here -->
                    <Button variant="ghost" class={`text-foreground/70 pl-3 cursor-pointer hover:bg-transparent hover:underline hover:text-accent-foreground/60 ${compareList.has(program.id) ? 'text-accent-foreground/90' : ''}`}
                        onclick={() => {
                            if (!compareList.delete(program.id)) {
                                compareList.add(program.id)
                            }
                        }}>
                        {isComparing ? 'Remove From Compare' : 'Add To Compare'} {#if isComparing} <X class="h-5"/> {/if}
                    </Button>
                    <Button
                        href={`/programs/${program.id}`}
                        class="text-sm"    
                    >
                        View Details
                    </Button>
                </div>
                </div>
            </div>
        </Card.Root>
    {/each}
</div>