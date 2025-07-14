<script>
  import ScholarshipProviderContactCard from './ScholarshipProviderContactCard.svelte';

  import ScholarshipDeadlineCard from './ScholarshipDeadlineCard.svelte';

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
    import ScholarshipTimelineCard from "./ScholarshipTimelineCard.svelte";


    let isScholarshipSaved = $state(false)

    let completedAppReqs = $state(new SvelteSet())
    const updateCompletedAppReq = (id) => {
        if (!completedAppReqs.delete(id)) completedAppReqs.add(id);
    }

    const daysLeft = getDaysUntil(scholarship.deadline)

</script>

<Card.Root class="p-6 px-7 gap-0">
    <h3 class="font-semibold text-foreground mb-4">Similar Scholarships</h3>
    <div class="space-y-4">
        {#each similarScholarships as similar}
            <div key={similar.id} class="border border-border rounded p-3">
                <a
                    href={`/scholarships/${similar.id}`}
                    class="font-medium text-foreground hover:text-primary text-sm"
                >
                    {similar.title}
                </a>
                <p class="text-xs text-muted-foreground mb-1">{similar.provider}</p>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-muted-foreground"> {similar.amount} </span>
                    <div class="flex items-center space-x-1">
                        <Star class="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{similar.rating}</span>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</Card.Root>

