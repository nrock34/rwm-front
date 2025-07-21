<script>

    import * as Card from '$lib/components/ui/card';
    import {Badge} from '$lib/components/ui/badge';
    import {Button} from '$lib/components/ui/button';
    import {Toggle} from '$lib/components/ui/toggle';
    import { Book, Bookmark, Calendar, DollarSign, Globe, MapPin, Star, Users } from 'lucide-svelte';



    let { savedPrograms = $bindable(), compareList = $bindable()} = $props()

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


<div class="grid lg-grid-cols-3 gap-4">

    {#each sortedPrograms as program}

        {@const isSaved = savedPrograms.includes(program.id)}
        {@const isComparing = compareList.includes(program.id)}


        <div key={program.id} class="">

        </div>

       <Card.Root key={program.id} class="">
            
            <div class="relative">
                <img
                    src={program.image}
                    alt={program.title}
                    class="w-full object-cover" 
                />
                {#if program.featured}
                    <div class="absolute top-3 left-3">
                        <Badge>
                            Featured
                        </Badge>
                    </div>
                {/if}
                <div>
                    <Toggle
                        
                        class={`rounded-full ${isSaved ? 
                        'bg-primary text-primary-foreground' : 
                        'bg-white/80 text-foreground hover:bg-white'}`}
                    >
                        <Bookmark class="h-4 h-4"/>
                    </Toggle>
                </div>
            </div>


            <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <a
                            href={`/programs/${program.id}`}
                            class="font-semibold text-foreground hover:text-primary"
                        >
                            {program.title}
                        </a>
                        <p class="text-sm text-muted-foreground">
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

                <p class="text-sm text-muted-foreground mb-4">{program.description}</p>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="flex items-center space-x-2">
                        <Calendar />
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
                        <Globe />
                        <span class="text-sm-capitalize">{program.language}</span>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                    {#each program.highlights.slice(0, 3) as highlight, idx}
                        <span key={idx}>
                            {highlight}
                        </span>
                    {/each}
                    {#if program.highlights.length > 3}
                        <span class="">
                            +{program.highlights.length - 3} more
                        </span>
                    {/if}
                </div>

                <div class="flex items-center jusitfy-between">
                    <!-- add compare here -->
                    <Button class="hidden">
                        {isComparing ? 'Remove From Compare' : 'Add To Compare'}
                    </Button>
                    <Button
                        href={`/programs/${program.id}`}
                        class="text-sm"    
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </Card.Root>
    {/each}
</div>