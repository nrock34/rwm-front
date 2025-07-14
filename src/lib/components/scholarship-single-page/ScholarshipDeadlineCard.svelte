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
    import ScholarshipTimelineCard from "./ScholarshipTimelineCard.svelte";


    let isScholarshipSaved = $state(false)

    let completedAppReqs = $state(new SvelteSet())
    const updateCompletedAppReq = (id) => {
        if (!completedAppReqs.delete(id)) completedAppReqs.add(id);
    }

    const daysLeft = getDaysUntil(scholarship.deadline)

</script>

<Card.Root class="p-6 px-7 bg-ring/5 border-primary/30 gap-0">
    <div class="flex items-center space-x-2 mb-2">
        <Clock class="h-5 w-5 text-accent-foreground"/>
        <h3 class="font-semibold text-foreground">Deadline Alert</h3>
    </div>
    <p class="text-sm text-muted-foreground mb-3">
        Application deadline is in {daysLeft} days
    </p>
    <div class="text-center">
        <div class="text-2xl font-bold text-accent-foreground">{daysLeft}</div>
        <div class="text-xs text-secondary-foreground font-n">days remaining</div>
    </div>
</Card.Root>

