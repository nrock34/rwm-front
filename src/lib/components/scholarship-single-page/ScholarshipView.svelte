<script>
    import { Button } from '$lib/components/ui/button';
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
    import { getDaysUntil } from "$lib/helper-funcs/funcs";
    import { ArrowLeft } from 'lucide-svelte';
    let {
        scholarship,
        similarScholarships = []
    } = $props();

    const daysLeft = $derived(getDaysUntil(scholarship.deadline));
    const description = $derived(String(scholarship.description ?? "").trim());
    const fullDescription = $derived(String(scholarship.fullDescription ?? "").trim());
    const hasDistinctDescription = $derived(
        Boolean(
            fullDescription &&
            fullDescription !== "A full scholarship description is not available yet." &&
            fullDescription !== description
        )
    );
    const hasBenefits = $derived(Array.isArray(scholarship.benefits) && scholarship.benefits.length > 0);
    const hasEligibility = $derived(Array.isArray(scholarship.eligibility) && scholarship.eligibility.length > 0);
    const hasApplicationProcess = $derived(
        Array.isArray(scholarship.applicationProcess) && scholarship.applicationProcess.length > 0
    );
    const hasTimeline = $derived(Array.isArray(scholarship.timeline) && scholarship.timeline.length > 0);
    const hasRequirements = $derived(
        Array.isArray(scholarship.requirements) && scholarship.requirements.length > 0
    );
    const hasSimilarScholarships = $derived(
        Array.isArray(similarScholarships) && similarScholarships.length > 0
    );
</script>

<div class="w-full">
    <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 pb-1">
            <div class="inline-flex items-center gap-3 rounded-(--radius) border border-border/70 bg-card/60 px-3 py-2">
                <p class="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-primary/80">Scholarships</p>
                <span class="h-3.5 w-px bg-border/80"></span>
                <Button href="/scholarships" variant="ghost" class="h-auto w-fit px-1 py-0 text-[0.95rem]">
                    <ArrowLeft class="h-4 w-4" />
                    Back to Scholarships
                </Button>
            </div>
        </div>

        <div class="hidden lg:block"></div>

        <div class="lg:col-span-2 space-y-6">
            <ScholarshipHeaderCard {scholarship} {daysLeft}></ScholarshipHeaderCard>
            {#if hasDistinctDescription}
                <ScholarschipFullDescCard {scholarship}></ScholarschipFullDescCard>
            {/if}
            {#if hasBenefits}
                <ScholarshipBenefitsCard {scholarship}></ScholarshipBenefitsCard>
            {/if}
            {#if hasEligibility}
                <ScholarshipEligibilityReqCard {scholarship}></ScholarshipEligibilityReqCard>
            {/if}
            {#if hasApplicationProcess}
                <ScholarshipApplicationProcess {scholarship}></ScholarshipApplicationProcess>
            {/if}
        </div>

        <div class="">
            <div class="space-y-5">
                <ScholarshipProviderContactCard {scholarship}></ScholarshipProviderContactCard>
                <ScholarshipDeadlineCard {daysLeft}></ScholarshipDeadlineCard>
                <ScholarshipQuickActionsCard {scholarship}></ScholarshipQuickActionsCard>
                {#if hasTimeline}
                    <ScholarshipTimelineCard {scholarship} />
                {/if}
                {#if hasRequirements}
                    <ScholarshipReqTrackerCard {scholarship}></ScholarshipReqTrackerCard>
                {/if}
                {#if hasSimilarScholarships}
                    <ScholarshipSimilarsCard {similarScholarships}></ScholarshipSimilarsCard>
                {/if}
            </div>
        </div>
    </div>
</div>
