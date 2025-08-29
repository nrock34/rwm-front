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

    import * as Card from "$lib/components/ui/card"
    import Button from '$lib/components/ui/button/button.svelte';

    import { innerWidth } from 'svelte/reactivity/window';
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    let sm = $derived(innerWidth.current < 550)
    let md = $derived(innerWidth.current < 768)
    let xl = $derived(innerWidth.current < 1150)

    $inspect(xl)

</script>

<div class="space-y-10">

    <!-- <NewsAndUpdates /> -->
    <!-- <Scholarships /> -->

    <div class="bg-gradient-to-br from-secondary/50 to-accent/40 border-b border-muted-foreground/60 px-6 sm:px-10 md:px-14 lg:px-18 xl:px-22 mb-8">
        <NewsUpdates />
    </div>

    <div class="px-6 sm:px-8 md:px-14 lg:px-18 xl:px-22">
        <div class="grid grid-cols-10 gap-x-8 gap-8 w-full max-w-[105rem] justify-self-center">

            {#if md}
                <div class="col-span-10 xl:order-first mb-6">
                    <Button
                        href="#" 
                        variant='ghost' 
                        class='h-fit w-full mx-auto p-0'>
                        {#snippet children()}
                            <Card.Root class="gap-0 p-2 px-3 sm:p-4 sm:px-4 m-0 w-full">
                                <div class="flex items-center justify-between gap-x-6">
                                    <h1 class="text-base sm:text-lg font-semibold text-primary">
                                        Social Feed
                                    </h1>
                                    <div>
                                        <p class="text-xs sm:text-[0.8rem] text-wrap font-medium">
                                            Click here to view the latest posts, please visit posts page
                                        </p>
                                    </div>
                                </div>
                            </Card.Root>
                        {/snippet}
                    </Button>
                </div>
            {/if}

            <div class="flex flex-col col-span-10 md:col-span-7 order-first">
                {#if !md}
                    <SocialFeed limit={xl ? 2 : 6}/>
                {/if}
            </div>
        
            <div class="grid grid-cols-1 md:flex md:flex-col col-span-10 md:col-span-3 gap-8 gap-y-6 order-3 md:order-2">
                <div>
                   <NewsletterSignup />
                </div>
                <div>
                    <TrendingTags />
                </div>
                {#if !md}
                    <div class="col-span-2">
                    <CommunityStats />
                    </div>
                {/if}
                {#if !xl}
                    <div>
                        <ScholarshipSection cardClass="w-full" limit=2 />
                    </div>
                    <div>
                        <StudyAbroadSection cardClass="w-full" limit=2/>
                    </div>
                {/if}

                <!-- <UpcomingEvents />
                <TopContributers/>
                <QuickLinks/> -->
            </div>

            {#if xl}
                <div class="flex flex-col sm:flex-row justify-between gap-4 col-span-10 w-full md:order-2 md:order-3">
                    <StudyAbroadSection cardClass="w-full" limit=2 />
                    <ScholarshipSection cardClass="w-full" limit=2 />
                </div>
            {/if}

        </div>
    </div>
    

    
    
    
    
    
    
    
    
</div>