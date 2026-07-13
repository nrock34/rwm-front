<script>
    import Hero from "$lib/components/landing/hero.svelte";
    import Stats from "$lib/components/landing/stats.svelte";
    import Features from "$lib/components/landing/features.svelte";
    import Activity from "$lib/components/landing/activity.svelte";

    import { Users, Award, BookOpen, Globe } from "lucide-svelte";
    import HIW from "$lib/components/landing/hiw.svelte";
    import AboutMe from "$lib/components/landing/about-me.svelte";
    import Cta from "$lib/components/landing/cta.svelte";
    import Newsletter from "$lib/components/landing/newsletter.svelte";
    
    const features = [
        {
        icon: Users,
        title: 'Connect with Students',
        description: 'Join a vibrant community of international students studying in Rome and across Italy.'
        },
        {
        icon: Award,
        title: 'Find Scholarships',
        description: 'Discover funding opportunities with our comprehensive scholarship database and application tracking.'
        },
        {
        icon: BookOpen,
        title: 'Access Resources',
        description: 'Get guides, tips, and essential information for your study abroad journey.'
        },
        {
        icon: Globe,
        title: 'Explore Programs',
        description: 'Browse study abroad programs and find the perfect fit for your academic goals.'
        }
    ];

    let { data, form } = $props()

    
</script>

<div class="min-h-screen mx-auto">
    <Hero />
    <AboutMe />
    <Features {features}/>
    {#if data.stats.length > 0}
        <Stats stats={data.stats}/>
    {/if}
    {#if data.recentActivity.length > 0}
        <Activity recentActivity={data.recentActivity}/>
    {/if}
    <HIW />
    <Cta />
    <Newsletter form={form} />
</div>
