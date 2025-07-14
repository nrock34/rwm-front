<script>
  import ScholarshipBenefitsCard from './ScholarshipBenefitsCard.svelte';

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
                <h2>
                    About This Scholarship
                </h2>
                <div class="prose prose-sm text-muted-foreground">
                    {#each scholarship.fullDescription.split('\n\n') as paragraph, idx}
                        <p key={idx} class="mb-3">  {paragraph} </p>
                    {/each}
                </div>
            </Card.Root>

