<script>

import { Award, DollarSign, Calendar, MapPin, Bell, CheckCircle, TrendingUp, Users, Globe, Star } from 'lucide-svelte';
    import NewsletterFormCs from './NewsletterFormCS.svelte';

  let email = $state();

    const scholarshipTypes = [
        {
        icon: Award,
        title: 'Merit-Based',
        description: 'Scholarships based on academic excellence and achievements',
        count: '150+ opportunities',
        color: 'text-yellow-600 bg-yellow-100'
        },
        {
        icon: DollarSign,
        title: 'Need-Based',
        description: 'Financial aid for students with demonstrated need',
        count: '80+ programs',
        color: 'text-green-600 bg-green-100'
        },
        {
        icon: Globe,
        title: 'Cultural Exchange',
        description: 'Programs promoting international understanding',
        count: '120+ exchanges',
        color: 'text-blue-600 bg-blue-100'
        },
        {
        icon: Star,
        title: 'Specialized Fields',
        description: 'Targeted funding for specific academic disciplines',
        count: '200+ fields',
        color: 'text-purple-600 bg-purple-100'
        }
    ];

    const features = [
        'Advanced search and filtering system',
        'Personalized scholarship recommendations',
        'Application deadline tracking and reminders',
        'Document management and submission tools',
        'Success rate analytics and insights',
        'Expert application review services'
    ];

    const stats = [
        { number: '$2.5M+', label: 'Total Funding Available' },
        { number: '500+', label: 'Active Scholarships' },
        { number: '25+', label: 'Countries Covered' },
        { number: '95%', label: 'Student Satisfaction' }
    ];

    let { form } = $props()

</script>

  
<div class="min-h-screen bg-gradient-to-br from-yellow-50 via-background to-orange-50">

      
    <section class="py-16 lg:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
        <div class="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award class="h-4 w-4" />
            <span>Scholarship Platform Launching Soon</span>
        </div>
        
        <h1 class="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Fund Your
            <span class="text-yellow-600 block">Study Abroad Dreams</span>
        </h1>
        
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover thousands of scholarship opportunities tailored to your profile. 
            Our AI-powered platform matches you with the perfect funding for your international education.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button class="btn-primary text-lg px-8 py-4 bg-yellow-600 hover:bg-yellow-700 rounded-md">
                {#snippet children()}
                    <a href="#sc-signup" class="flex items-center">
                        <Bell class="h-5 w-5 mr-2" />
                        Get Early Access
                    </a>
                {/snippet}
                {@render children()}
            </button>
            <a href="/" class="btn-secondary text-lg px-8 py-4">
            Browse Community
            </a>
        </div>

        
        <div class="max-w-md mx-auto bg-card p-6 rounded-xl shadow-sm">
            <p class="text-sm text-muted-foreground mb-2">Launching in</p>
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
        </div>
    </div>
    </section>

    
    <section class="py-12 bg-card/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {#each stats as stat, index}
            <div key={index}>
            <div class="text-3xl font-bold text-yellow-600 mb-2">{stat.number}</div>
            <div class="text-sm text-muted-foreground">{stat.label}</div>
            </div>
        {/each}
        </div>
    </div>
    </section>

    <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-foreground mb-4">Scholarship Categories</h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
            Access a diverse range of funding opportunities across multiple categories and fields of study
        </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each scholarshipTypes as type, index}
            {@const IconComponent = type.icon}
    
            <div key={index} class="card p-6 text-center hover:shadow-lg transition-shadow">
                <div class={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${type.color}`}>
                <IconComponent class="h-6 w-6" />
                </div>
                <h3 class="font-semibold text-foreground mb-2">{type.title}</h3>
                <p class="text-sm text-muted-foreground mb-3">{type.description}</p>
                <span class="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                {type.count}
                </span>
            </div>
            
        {/each}
        </div>
    </div>
    </section>

    
    <section class="py-16 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-3xl font-bold mb-6">Powerful Features Coming Soon</h2>
                    <div class="space-y-4">
                    {#each features as feature, index}
                        <div key={index} class="flex items-center space-x-3">
                        <CheckCircle class="h-5 w-5 flex-shrink-0" />
                        <span>{feature}</span>
                        </div>
                    {/each}
                    </div>
                </div>
            
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h3 class="text-xl font-semibold mb-4">Smart Matching Algorithm</h3>
                    <p class="opacity-90 mb-4">
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

    
    <section id="sc-signup" class="py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold text-foreground mb-4">Get Early Access</h2>
            <p class="text-muted-foreground mb-8">
                Be among the first to access our scholarship platform and get personalized recommendations
            </p>

            <div class="max-w-2xl mx-auto">
                <NewsletterFormCs {form}/>
            </div>
                
            <p class="text-xs text-muted-foreground mt-4">
                Join 2,500+ students already on our waitlist
            </p>
        </div>
    </section>

      
</div>