<script>
    import {
        Award,
        Bell,
        CheckCircle,
        DollarSign,
        Globe,
        Star,
        TrendingUp
    } from "lucide-svelte";

    import ComingSoonPage from "./shared/ComingSoonPage.svelte";

    const scholarshipTypes = [
        {
            icon: Award,
            title: "Merit-Based",
            description: "Scholarships based on academic excellence and achievements",
            count: "150+ opportunities",
            iconContainerClass: "bg-yellow-100",
            iconClass: "text-yellow-600"
        },
        {
            icon: DollarSign,
            title: "Need-Based",
            description: "Financial aid for students with demonstrated need",
            count: "80+ programs",
            iconContainerClass: "bg-green-100",
            iconClass: "text-green-600"
        },
        {
            icon: Globe,
            title: "Cultural Exchange",
            description: "Programs promoting international understanding",
            count: "120+ exchanges",
            iconContainerClass: "bg-blue-100",
            iconClass: "text-blue-600"
        },
        {
            icon: Star,
            title: "Specialized Fields",
            description: "Targeted funding for specific academic disciplines",
            count: "200+ fields",
            iconContainerClass: "bg-purple-100",
            iconClass: "text-purple-600"
        }
    ];

    const platformFeatures = [
        "Advanced search and filtering system",
        "Personalized scholarship recommendations",
        "Application deadline tracking and reminders",
        "Document management and submission tools",
        "Success rate analytics and insights",
        "Expert application review services"
    ];

    const stats = [
        { number: "$2.5M+", label: "Total Funding Available" },
        { number: "500+", label: "Active Scholarships" },
        { number: "25+", label: "Countries Covered" },
        { number: "95%", label: "Student Satisfaction" }
    ];

    let { form } = $props();
</script>

<ComingSoonPage
    {form}
    backgroundClass="bg-gradient-to-br from-yellow-50 via-background to-orange-50"
    badgeIcon={Award}
    badgeText="Scholarship Platform Launching Soon"
    badgeClass="bg-yellow-100 text-yellow-700"
    titleLead="Fund Your"
    titleHighlight="Study Abroad Dreams"
    titleHighlightClass="text-yellow-600"
    description="Discover thousands of scholarship opportunities tailored to your profile. Our AI-powered platform matches you with the perfect funding for your international education."
    primaryCtaHref="#sc-signup"
    primaryCtaLabel="Get Early Access"
    primaryCtaIcon={Bell}
    primaryCtaClass="bg-yellow-600 text-white hover:bg-yellow-700"
    secondaryCtaHref="/"
    secondaryCtaLabel="Browse Community"
    features={scholarshipTypes}
    featuresTitle="Scholarship Categories"
    featuresDescription="Access a diverse range of funding opportunities across multiple categories and fields of study"
    featureBadgeClass="bg-yellow-50 text-yellow-600"
    signupId="sc-signup"
    signupSectionClass=""
    signupTitle="Get Early Access"
    signupDescription="Be among the first to access our scholarship platform and get personalized recommendations"
    signupFootnote="Join 2,500+ students already on our waitlist"
>
    {#snippet heroAddon()}
        <div class="mx-auto max-w-md rounded-xl bg-card p-6 shadow-sm">
            <p class="mb-2 text-sm text-muted-foreground">Launching in</p>
            <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                    <div class="text-2xl font-bold text-yellow-600">45</div>
                    <div class="text-xs text-muted-foreground">Days</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-yellow-600">12</div>
                    <div class="text-xs text-muted-foreground">Hours</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-yellow-600">30</div>
                    <div class="text-xs text-muted-foreground">Minutes</div>
                </div>
            </div>
        </div>
    {/snippet}

    {#snippet middleSection()}
        <section class="bg-card/50 py-12">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
                    {#each stats as stat}
                        <div>
                            <div class="mb-2 text-3xl font-bold text-yellow-600">{stat.number}</div>
                            <div class="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    {/each}
                </div>
            </div>
        </section>
    {/snippet}

    {#snippet afterFeaturesSection()}
        <section class="bg-gradient-to-r from-yellow-600 to-orange-600 py-16 text-white">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <h2 class="mb-6 text-3xl font-bold">Powerful Features Coming Soon</h2>
                        <div class="space-y-4">
                            {#each platformFeatures as feature}
                                <div class="flex items-center space-x-3">
                                    <CheckCircle class="h-5 w-5 flex-shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div class="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                        <h3 class="mb-4 text-xl font-semibold">Smart Matching Algorithm</h3>
                        <p class="mb-4 opacity-90">
                            Our AI analyzes your profile, academic background, and goals to recommend
                            the most relevant scholarship opportunities with the highest success probability.
                        </p>
                        <div class="flex items-center space-x-2 text-sm">
                            <TrendingUp class="h-4 w-4" />
                            <span>3x higher application success rate</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    {/snippet}
</ComingSoonPage>
