<script>
    import Hero from "$lib/components/landing/hero.svelte";
    import Stats from "$lib/components/landing/stats.svelte";
    import Features from "$lib/components/landing/features.svelte";
    import Activity from "$lib/components/landing/activity.svelte";

    import { Users, Award, BookOpen, Globe, Heart, Calendar } from "lucide-svelte";
    import Testimonials from "$lib/components/landing/testimonials.svelte";
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

    const testimonials = [
        {
        name: 'Sarah Johnson',
        university: 'UC Berkeley',
        program: 'Art History in Florence',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        quote: 'RomeWithMe made my study abroad experience incredible. The community support and resources were invaluable.',
        rating: 5
        },
        {
        name: 'Marco Benedetti',
        university: 'Sapienza University',
        program: 'Local Student Mentor',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        quote: 'As a local student, I love helping international students discover the real Rome. This platform connects us all.',
        rating: 5
        },
        {
        name: 'Emma Chen',
        university: 'NYU',
        program: 'Business Studies in Rome',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        quote: 'Found my scholarship through RomeWithMe and connected with amazing people. Highly recommend!',
        rating: 5
        }
    ];

    const stats = [
        { number: '2,500+', label: 'Active Students' },
        { number: '150+', label: 'Study Programs' },
        { number: '89', label: 'Scholarships' },
        { number: '25+', label: 'Universities' }
    ];

    const recentActivity = [
        {
        type: 'scholarship',
        title: 'New Fulbright applications open',
        time: '2 hours ago',
        icon: Award
        },
        {
        type: 'community',
        title: 'Sarah shared photos from Florence',
        time: '4 hours ago',
        icon: Heart
        },
        {
        type: 'event',
        title: 'Study group forming for Italian language',
        time: '6 hours ago',
        icon: Calendar
        },
        {
        type: 'resource',
        title: 'New visa guide published',
        time: '1 day ago',
        icon: BookOpen
        }
    ];

</script>

<div class="min-h-screen">
    <Hero />
    <AboutMe />
    <Features {features}/>
    <!-- <Stats {stats}/> -->
    <!-- <Activity {recentActivity}/> -->
    <!-- <Testimonials {testimonials}/> -->
    <!-- <HIW /> -->
    <Cta />
    <Newsletter />
</div>