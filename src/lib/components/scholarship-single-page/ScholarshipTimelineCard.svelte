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

<Card.Root class="p-6 px-7 gap-0">
    <h2 class="text-xl font-semibold text-foreground mb-4">Important Dates</h2>
    <div>
        {#each scholarship.timeline as item, idx}
            {@const statusColor = item.status === 'upcoming' ? 'yellow-300' :
                                item.status === 'current' ? 'green-500/80' : 'muted-foreground'}
            <div key={idx} class="flex items-center space-x-2 mb-3">
                <div class="flex-shrink-0">
                    <div class={`w-4 h-4 rounded-full bg-${statusColor} border-muted-foreground/60 border`}></div>
                </div>
                <div class="flex-1 flex justify-between items-center">
                    <span class="text-sm font-medium text-foreground">{item.event}</span>
                    <span class={`text-sm text-${statusColor}`}>
                        {new Date(item.date).toLocaleDateString()}
                    </span>
                </div>
            </div>
        {/each}
    </div>
</Card.Root>

