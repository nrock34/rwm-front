<script>
    import { Badge } from "$lib/components/ui/badge";
    import * as Card from "$lib/components/ui/card";
    import { getDaysUntil, getTimeAgo } from "$lib/helper-funcs/funcs";
    import { BadgeEuro, Bookmark, Calendar, CalendarClock, CalendarSync, CalendarX, Clock, DollarSign, Eye, Heart, Link, MapPin, Star } from "lucide-svelte";
    import {Button} from "../ui/button";
    import Toggle from "../ui/toggle/toggle.svelte";
    

    let view = 'card-view'
    let { paginatedScholarships, categories, totalPage, userSavedScholarships} = $props();

    const updateSavedScholarships = (id) => {
        if (!userSavedScholarships.delete(id)) {
            userSavedScholarships.add(id)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-green-200/35 text-green-600 border-green-600/40'

            case 'closing-soon':
                return 'bg-secondary/35 text-primary border-primary/30'

            case 'closed':
                return 'bg-destructive/10 text-destructive border-destructive/25'
            
            default:
                return ''
        }
    }

</script>


<div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
    {#if view === 'card-view'}
    {#each paginatedScholarships as scholarshipItem}
        
        {@const isSelected = userSavedScholarships.has(scholarshipItem.id)}
        {@const daysLeft = getDaysUntil(scholarshipItem.deadline)}

        <Card.Root class={`py-0 gap-4 p-6 h-full tracking-tight ${scholarshipItem.featured ? 'ring-2 ring-ring/45 bg-ring/10' : ''}`}>
            <div>

                <div class="flex justify-between">
                    <div class="flex gap-x-1.5">
                        <Badge class={`capitalize rounded-xl tracking-normal border-1 ${getStatusColor(scholarshipItem.status)} px-2.5 py-0.5 h-fit`}>
                            {scholarshipItem.status}
                        </Badge>
                        <Badge class={`rounded-xl tracking-normal bg-muted text-secondary-foreground border-secondary-foreground/20 px-2.5 py-0.5 h-fit text-xs`}>
                            <div class="flex items-center gap-x-1">
                                <Star class="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                <span>{scholarshipItem.rating}</span>
                            </div>
                            {#if scholarshipItem.applicants}
                                •
                                <div>
                                    {scholarshipItem.applicants}
                                </div>
                            {/if}
                        </Badge>
                    </div>
                    <Toggle pressed={userSavedScholarships.has(scholarshipItem.id)}
                            onPressedChange={() => {
                                updateSavedScholarships(scholarshipItem.id)
                            }}
                    >
                        <Bookmark class="h-4 w-4"/>
                    </Toggle>
                </div>

                <div>
                    <h1 class="font-semibold">{scholarshipItem.title}</h1>
                    <p class="text-sm text-secondary-foreground/80 font-normal tracking-normal">{scholarshipItem.provider}</p>
                </div>

                <div class="mt-4">
                    <p class="leading-tight tracking-normal font-normal text-sm text-foreground/90">{scholarshipItem.description}</p>
                </div>

                <div class="mt-4 flex-col flex gap-y-0.75">
                    <div class="flex items-center gap-x-1.5">
                        <DollarSign class="text-foreground/90 h-5 w-5" />
                        <span class="text-sm font-semibold">{scholarshipItem.amount} <span class="text-secondary-foreground/80 font-medium"> / semester</span> </span>
                    </div>
                    <div class="flex items-center gap-x-1.5">
                        <MapPin class="h-5 w-5 text-secondary-foreground/80" />
                        <span class="text-sm text-foreground/90 font-normal tracking-normal">{scholarshipItem.location}</span>
                    </div>
                    <div class="flex items-center gap-x-1.5">
                        <CalendarClock class="h-5 w-5 text-secondary-foreground/80" />
                        <span class="text-sm text-foreground/90 font-normal tracking-normal items-center flex gap-x-5">
                            <span>
                                {scholarshipItem.deadline}
                            </span>
                            <span class={`${daysLeft < 0 ? 'text-red-900/80 font-semibold tracking-normal text-xs' : daysLeft <= 7 ? 'text-yellow-500 font-medium' :  ''}`}> 
                                {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline Passed'} 
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex gap-x-1.25">
                {#each scholarshipItem.eligibility.slice(0,2) as requirement, idx}
                    <Badge variant='outline' key={idx}
                            class="text-[0.675rem] bg-background/90 h-fit px-2 py-0.25 pt-0.5">
                        {requirement}
                    </Badge>
                {/each}
                {#if scholarshipItem.eligibility.length > 2}
                    <Badge variant='outline'
                            class='text-[0.675rem] bg-background/90 h-fit px-2 py-0.25 pt-0.5'>
                        +{scholarshipItem.eligibility.length - 2} more
                    </Badge>
                {/if}
            </div>


            <div class="flex items-center mt-2">
                <Button class="p-0 h-fit">
                    <a  
                        class="text-xs sm:text-sm font-semibold tracking-normal p-0 py-1.5 px-2.5"
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

