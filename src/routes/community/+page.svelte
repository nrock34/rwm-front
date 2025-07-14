<script>
    import NewsUpdates from '$lib/components/community/CommunityNewsUpdates/NewsUpdates.svelte';
    import CommunityStats from '$lib/components/community/sidebar-elements/CommunityStats.svelte';
    import NewsletterSignup from '$lib/components/community/sidebar-elements/NewsletterSignup.svelte';
    import QuickLinks from '$lib/components/community/sidebar-elements/QuickLinks.svelte';
    import TopContributers from '$lib/components/community/sidebar-elements/TopContributers.svelte';
    import TrendingTags from '$lib/components/community/sidebar-elements/TrendingTags.svelte';
    import UpcomingEvents from '$lib/components/community/sidebar-elements/UpcomingEvents.svelte';
    import SocialFeed from '$lib/components/community/socialFeed/SocialFeed.svelte';
    import StudyAbroadSection from '$lib/components/community/StudyAbroad/ProgramsSection.svelte';
    import ScholarshipSection from '$lib/components/community/StudyAbroad/ScholarshipSection.svelte';
    import FilterSearch from '$lib/components/news-page/FilterSearch.svelte';
    import NewsAndUpdates from '$lib/components/news-page/NewsAndUpdates.svelte';
    import Scholarships from '$lib/components/scholarships-page/Scholarships.svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
</script>

<div class="space-y-10">

    <!-- <NewsAndUpdates /> -->
    <!-- <Scholarships /> -->

    <NewsUpdates />

    <div class="px-15 grid grid-cols-2 gap-5">
        <StudyAbroadSection />
        <ScholarshipSection />
    </div>
    
    <TrendingTags />
    <UpcomingEvents />
    <TopContributers/>
    <QuickLinks/>
    <CommunityStats />
    <NewsletterSignup />
    <SocialFeed/>
</div>