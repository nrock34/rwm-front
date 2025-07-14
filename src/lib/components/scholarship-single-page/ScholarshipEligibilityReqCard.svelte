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
    <h2 class="text-xl font-semibold text-foreground mb-4">
        Eligibility & Requirements
    </h2>
    <div class="space-y-2">
        {#each scholarship.eligibility as requirement, idx}
            <div key={idx} class="flex items-center space-x-2">
                <BadgeAlert class="h-4 w-4 text-yellow-500"/>
                <span class="text-sm text-muted-foreground">{requirement}</span>
            </div>
        {/each}
    </div>
</Card.Root>

