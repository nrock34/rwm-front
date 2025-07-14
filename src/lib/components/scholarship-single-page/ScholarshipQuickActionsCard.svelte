<script>
  import ScholarshipSimilarsCard from './ScholarshipSimilarsCard.svelte';

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
    <h3 class="font-semibold text-foreground mb-4">Quick Actions</h3>
    <div class="space-y-3">
        <Button class="w-full">
            I Want To Apply
        </Button>
        <Button class="w-full">
            Visit Website
        </Button>
        <Button class="w-full">
            Contact Provider
        </Button>
    </div>
</Card.Root>

