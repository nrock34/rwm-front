<script>
  import ScholarshipApplicationProcess from './ScholarshipApplicationProcess.svelte';


    import ScholarshipQuickActionsCard from './ScholarshipQuickActionsCard.svelte';
    import ScholarshipSimilarsCard from './ScholarshipSimilarsCard.svelte';
    import ScholarshipProviderContactCard from './ScholarshipProviderContactCard.svelte';
    import ScholarshipDeadlineCard from './ScholarshipDeadlineCard.svelte';
    import ScholarshipTimelineCard from "./ScholarshipTimelineCard.svelte";


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

 <Card.Root class="p-6 px-7 gap-0">
    <h2 class="text-xl font-semibold text-foreground mb-4">Application Requirements</h2>
    <div class="space-y-2">
        {#each scholarship.requirements as requirement, idx}
            {@const isSelected = completedAppReqs.has(requirement.id)}
            <div class="flex items-center space-x-2">
                <Toggle
                    size='sm'
                    pressed={completedAppReqs.has(requirement.id)} 
                    onPressedChange={() => updateCompletedAppReq(requirement.id)}
                    variant="outline">

                    <Check class={completedAppReqs.has(requirement.id) ? '' : 'hidden'}/>
                </Toggle>
                <span class="text-sm text-muted-foreground"> {requirement.req} </span>
            </div>
        {/each}
    </div>
</Card.Root>

