<script>
    import ScholarshipHeaderCard from './ScholarshipHeaderCard.svelte';

    import ScholarschipFullDescCard from './ScholarschipFullDescCard.svelte';

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



<div class="max-w-7xl mx-auto px-6 p-16">
    <div class="grid lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2 space-y-8">

            <!-- header -->
            <ScholarshipHeaderCard></ScholarshipHeaderCard>

            <!-- full description -->
            <ScholarschipFullDescCard></ScholarschipFullDescCard>

            <!-- benefits -->
            <ScholarshipBenefitsCard></ScholarshipBenefitsCard>

            <!-- eligbility requirements -->
            <ScholarshipEligibilityReqCard></ScholarshipEligibilityReqCard>

            <!-- application requirement tracker -->
            

            <!-- application process -->
            <ScholarshipApplicationProcess></ScholarshipApplicationProcess>
            
        </div>

        <!-- sidebarr -->

        <div class="">
            <div class="space-y-6">

                <ScholarshipProviderContactCard></ScholarshipProviderContactCard>

                <ScholarshipDeadlineCard></ScholarshipDeadlineCard>
                
                <ScholarshipQuickActionsCard></ScholarshipQuickActionsCard>

                

                <!-- timeline -->
                <ScholarshipTimelineCard />

                

                <ScholarshipReqTrackerCard></ScholarshipReqTrackerCard>

                

                <ScholarshipSimilarsCard></ScholarshipSimilarsCard>

            </div>

                    </div>
    </div>
</div>


