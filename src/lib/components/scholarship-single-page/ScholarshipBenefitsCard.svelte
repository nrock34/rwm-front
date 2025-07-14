<script>
  import ScholarshipEligibilityReqCard from './ScholarshipEligibilityReqCard.svelte';

  import ScholarshipReqTrackerCard from './ScholarshipReqTrackerCard.svelte';

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

<Card.Root class="p-6 px-8 gap-0">
                <h2 class="text-xl">Benefits & Coverage</h2>
                <div class="grid grid-cols-2 gap-3">
                    {#each scholarship.benefits as benefit, idx}
                        <div key={idx} class="flex items-center space-x-2">
                            <CheckCircle class="h-4 w-4 text-green-600"/>
                            <span class="text-sm text-muted-foreground">{benefit}</span>
                        </div>
                    {/each}    
                </div>
            </Card.Root>

