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
    <h2 class="text-xl font-semibold text-foreground mb-4">Application Process</h2>
    <div class="space-y-4">
        {#each scholarship.applicationProcess as step, idx}
            <div key={idx} class="flex space-x-4">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-primary/40 text-accent-foreground rounded-full flex items-center justify-center font-medium text-sm">
                        {step.step}
                    </div>
                </div>
                <div class="flex-1 leading-tight">
                    <h3 class="font-medium text-foreground">{step.title}</h3>
                    <p class="text-sm text-muted-foreground mb-2">{step.description}</p>
                    <p class="text-sm text-secondary-foreground font-medium">{step.timeframe}</p>
                </div>
            </div>
        {/each}
    </div>
</Card.Root>

