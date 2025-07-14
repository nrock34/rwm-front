<script>


    import { AlertCircle, Clock, BadgeAlert, Bookmark, Calendar,
             CheckCircle, DollarSign, ExternalLink, MapPin,
              Share2, Star, Users, 
              Check} from "lucide-svelte";
    import Badge from "../ui/badge/badge.svelte";
    import * as Card from "../ui/card";
    import { scholarship, similarScholarships } from "./testdata";
    import Button from "../ui/button/button.svelte";
    import Toggle from "../ui/toggle/toggle.svelte";
    import { getDaysUntil } from "$lib/helper-funcs/funcs";
    import { SvelteSet } from 'svelte/reactivity'
    


    let isScholarshipSaved = $state(false)

    let completedAppReqs = $state(new SvelteSet())
    const updateCompletedAppReq = (id) => {
        if (!completedAppReqs.delete(id)) completedAppReqs.add(id);
    }

    const daysLeft = getDaysUntil(scholarship.deadline)

</script>

<Card.Root class="p-8 gap-0">
    <Card.Header class="flex items-start justify-between mb-4 p-0">
        <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
                <h1 class="text-3xl font-bold text-foreground">
                    {scholarship.title}
                </h1>
                {#if scholarship.featured}
                    <Badge class="">
                        Featured
                    </Badge>
                {/if}
            </div>
            <p class="text-muted-foreground mb-2">
                {scholarship.provider}
            </p>
            <div class="flex items-center space-x-1">
                <Star class="h-4 w-4 text-yellow-500 fill-current" />
                <span class="font-medium">{scholarship.rating}</span>
                <span class="text-muted-foreground">
                    ({scholarship.applicants} applicants, {scholarship.awarded} awarded)
                </span>
            </div>
        </div>

        <div class="flex items-center space-x-2">
            <Toggle
                onPressedChange={() => {isScholarshipSaved = !isScholarshipSaved}}
                >
                <Bookmark class={isScholarshipSaved ? 'fill-current transition' : ''}/>
            </Toggle>
            <Button class="bg-muted hover:bg-muted/70 transition-colors">
                <Share2 class="h-4 w-4 text-secondary-foreground"/>
            </Button>
        </div>
    </Card.Header>

    <Card.Content class="p-0">
        <div class="grid grid-cols-2 md-grid-cols-4 gap-4 mb-4">
            <div class="flex items-center space-x-2">
                <DollarSign class="h-4 w-4 text-secondary-foreground"/>
                <div>
                    <p class="text-sm font-medium">{scholarship.amount}</p>
                    <p class="text-xs text-muted-foreground">Award Amount</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <Calendar class="h-4 w-4 text-secondary-foreground"/>
                <div>
                    <p class="text-sm font-medium">
                        {new Date(scholarship.deadline).toLocaleDateString()}
                    </p>
                    <p class="text-xs text-muted-foreground">Deadline</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <MapPin class='h-4 w-4 text-secondary-foreground'/>
                <div>
                    <p class="text-sm font-medium">{scholarship.location}</p>
                    <p class="text-xs text-muted-foreground">Location</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <Users class="h-4 w-4 text-secondary-foreground"/>
                <div>
                    <p class="text-sm font-medium">{scholarship.successRate}</p>
                    <p class="text-xs text-muted-foreground">Success Rate</p>
                </div>
            </div>
        </div>

        {#if daysLeft <= 14}
            <div class="bg-yellow-50 border border-yellow-200 rounded-(--radius) p-4 mb-4">
                <div class="flex items-center space-x-2">
                    <AlertCircle class="h-6 w-6 text-destructive/70"/>
                    <span class="text-sm font-medium text-destructive">
                        Deadline approaching: {daysLeft} days remaining
                    </span>
                </div>
            </div>
        {/if}
        
        <p class="text-muted-foreground">{scholarship.description}</p>
    </Card.Content>
</Card.Root>

