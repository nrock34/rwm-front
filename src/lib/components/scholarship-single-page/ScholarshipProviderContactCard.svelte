<script>
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
    <h3 class="font-semibold text-foreground mb-4">Contact Information</h3>
    <div class="space-y-3 text-sm">
        <div>
            <p class="font-medium text-foreground">Email</p>
            <p class="text-muted-foreground">{scholarship.contact.email}</p>
        </div>
        <div>
            <p class="font-medium text-foreground">Phone</p>
            <p class="text-muted-foreground">{scholarship.contact.phone}</p>
        </div>
        <div>
            <p class="font-medium text-foreground">Website</p>
            <a
                class="flex items-center "
                href={scholarship.contact.website}
                rel="noopener noreferrer">
                Visit Website
                <ExternalLink class="h-3 w-3 ml-1"/>
            </a>
        </div>
        <div>
            <p class="font-medium text-foreground">Address</p>
            <p class="text-muted-foreground">{scholarship.contact.address}</p>
        </div>
    </div>
</Card.Root>

