<script>
    import { Badge } from "$lib/components/ui/badge";
    import * as Card from "$lib/components/ui/card";
    import { getDaysUntil, getTimeAgo } from "$lib/helper-funcs/funcs";
    import { BadgeEuro, Bookmark, Calendar, Clock, DollarSign, Eye, Heart, Link, MapPin, Star } from "lucide-svelte";
    import {Button} from "../ui/button";
    import Toggle from "../ui/toggle/toggle.svelte";
    

    let view = 'card-view'
    let { paginatedScholarships, categories, totalPage, userSavedScholarships} = $props();

    const updateSavedScholarships = (id) => {
        if (!userSavedScholarships.delete(id)) {
            userSavedScholarships.add(id)
        }

        console.log(userSavedScholarships)
    }

</script>


<div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
    {#if view === 'card-view'}
    {#each paginatedScholarships as scholarshipItem}
        
        {@const isSelected = userSavedScholarships.has(scholarshipItem.id)}
        {@const daysLeft = getDaysUntil(scholarshipItem.deadline)}

        <Card.Root class="py-0 gap-4 p-6 h-full tracking-tight ring-2 ring-primary/30">
            <div class="flex items-start justify-between mb-1">
                <div class="flex items-center">
                    <div class="">
                        <div class="flex items-center space-x-2 mb-2 leading-tight">
                            <a href={`/scholarship/${scholarshipItem.id}`}
                                class="font-semibold text-foreground text-nowrap">
                                {scholarshipItem.title}
                            </a>
                            {#if scholarshipItem.featured}
                                <Badge class="text-xs">
                                    Featured
                                </Badge>            
                            {/if}
                        </div>
                        <p class="text-sm text-secondary-foreground"> {scholarshipItem.provider} </p>
                        <div class="flex items-center space-x-1 mb-2">
                            <Star class="h-3 w-3 text-yellow-500 fill-current"/>
                            <span class="text-xs font-medium"> {scholarshipItem.rating} </span>
                            <span class="text-xs text-muted-foreground"> 
                                ({scholarshipItem.applicants} applicants)
                            </span>
                        </div>
                    </div>                    
                </div>
                <div class="flex items-center pl-auto">
                    <Toggle pressed={userSavedScholarships.has(scholarshipItem.id)}
                            onPressedChange={() => {
                                updateSavedScholarships(scholarshipItem.id)
                            }}>
                        <Bookmark class="h-4 w-4"/>
                    </Toggle>
                </div>
            </div>

            <p class="text-sm text-secondary-foreground mb-2"> {scholarshipItem.description} </p>
            
            <div class="grid grid-cols-2 gap-2 mb-2">
                <div class="flex items-center space-x-2 text-sm">
                    <DollarSign class="h-4 w-4 text-muted-foreground"/>
                    <span class=" font-medium"> {scholarshipItem.amount} </span>
                </div>
                <div class="flex items-center space-x-2">
                    <MapPin class="h-4 w-4 text-muted-foreground"/>
                    <span> {scholarshipItem.location} </span>
                </div>
                <div class="flex items-center space-x-2">
                    <Calendar class="h-4 w-4 text-muted-foreground"/>
                    <span> {new Date(scholarshipItem.deadline).toLocaleDateString()} </span>
                </div>
                <div class="flex items-center space-x-2">
                    <Clock class={`h-4 w-4 text-muted-foreground`}/>
                    <span class={`${daysLeft < 0 ? 'text-destructive font-bold tracking-tight' : daysLeft <= 7 ? 'text-destructive font-medium' :  ''}`}
                        > {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline Passed'} </span>
                </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-3">
                {console.log(scholarshipItem.eligibility)}
                {#each scholarshipItem.eligibility.slice(0,2) as requirement, idx}
                    <Badge variant='outline' key={idx}
                            class="text-xs bg-muted/10">
                        {requirement}
                    </Badge>
                {/each}
                {#if scholarshipItem.eligibility.length > 2}
                    <Badge variant='outline'
                            class='text-xs bg-muted/10'>
                        +{scholarshipItem.eligibility.length - 2} more
                    </Badge>
                {/if}
            </div>

            <div class="flex items-center mt-auto justify-between">
                <Badge>
                    {scholarshipItem.status.replace('-', ' ').toUpperCase()}
                </Badge>
                <Button class="p-0">
                    <a  
                        class="text-sm p-3"
                        href={`/scholarships/${scholarshipItem.id}`}>
                        View Details
                    </a>
                </Button>
                
            </div>
            
        </Card.Root>
    {/each}
    {:else if view === 'list-view'}
        <p>pass</p>
    {/if}
</div>

