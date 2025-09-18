

<script>


    import { BookOpen, Download, Star, FileText, Video, Map, CheckCircle, Bell, ArrowRight, Users, Award, Globe } from 'lucide-svelte';
    import NewsletterFormCs from './NewsletterFormCS.svelte';

    let email = $state()

    const resourceCategories = [
        {
        icon: FileText,
        title: 'Study Guides',
        description: 'Comprehensive guides for visa applications, pre-departure prep, and academic success',
        count: '50+ guides'
        },
        {
        icon: Video,
        title: 'Video Tutorials',
        description: 'Step-by-step video content covering everything from housing to cultural adaptation',
        count: '100+ videos'
        },
        {
        icon: Map,
        title: 'Interactive Tools',
        description: 'Budget calculators, packing checklists, and destination comparison tools',
        count: '25+ tools'
        },
        {
        icon: Award,
        title: 'Expert Tips',
        description: 'Insider advice from study abroad veterans and local experts',
        count: '200+ tips'
        }
    ];

    const interestOptions = [
        'Visa & Documentation',
        'Housing & Accommodation',
        'Academic Resources',
        'Cultural Guides',
        'Budget & Finance',
        'Language Learning',
        'Travel Itineraries',
        'Safety & Health'
    ];

    const timeline = [
        { phase: 'Content Creation', status: 'completed', date: 'Jan 2024' },
        { phase: 'Platform Development', status: 'in-progress', date: 'Feb 2024' },
        { phase: 'Beta Testing', status: 'upcoming', date: 'Mar 2024' },
        { phase: 'Public Launch', status: 'upcoming', date: 'Apr 2024' }
    ];

    let { form } = $props()

</script>


    <div class="min-h-screen bg-gradient-to-br from-blue-100 via-background to-indigo-200/60">
      <section class="py-16 lg:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <div class="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen class="h-4 w-4" />
              <span>Resources Hub Coming Soon</span>
            </div>
            
            <h1 class="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Your Complete
              <span class="text-blue-600 block">Study Abroad Toolkit</span>
            </h1>
            
            <p class="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Access hundreds of guides, tools, and resources created by students, for students. 
              Everything you need for a successful study abroad journey, all in one place.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button href="a" class="text-lg flex items-center px-8 py-4 bg-blue-500 hover:bg-blue-400 rounded-md ">
                {#snippet children()}
                    <a href="#rsc-signup" class="flex items-center">
                       <Bell class="h-5 w-5 mr-2" />
                        Get Notified at Launch 
                    </a>
                {/snippet}
                {@render children()}
              </button>
              <a href="#comingsoon" class="btn-secondary text-lg px-8 py-4">
                Explore Community
              </a>
            </div>

            
            <div class="max-w-md mx-auto">
              <div class="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Development Progress</span>
                <span>75% Complete</span>
              </div>
              <div class="w-full bg-muted rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section id="comingsoon" class="py-16 bg-card/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-foreground mb-4">What's Coming</h2>
            <p class="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive resource library designed to support every step of your study abroad journey
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each resourceCategories as category, index}
                {@const IconComponent = category.icon}
                <div key={index} class="card p-6 text-center hover:shadow-lg transition-shadow">
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent class="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 class="font-semibold text-foreground mb-2">{category.title}</h3>
                    <p class="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {category.count}
                    </span>
                </div>
            {/each}
          </div>
        </div>
        </section>

      
      <section class="py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-foreground mb-4">Launch Timeline</h2>
            <p class="text-muted-foreground">Track our progress toward the full resource library launch</p>
          </div>

          <div class="space-y-6">
            {#each timeline as item, index}
              <div key={index} class="flex items-center space-x-4">
                <div class={`w-4 h-4 rounded-full flex-shrink-0 ${
                  item.status === 'completed' ? 'bg-green-500' :
                  item.status === 'in-progress' ? 'bg-blue-500' :
                  'bg-muted'
                }`}></div>
                <div class="flex-1 flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-foreground">{item.phase}</h3>
                    <p class="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  {#if item.status === 'completed'} 
                    <CheckCircle class="h-5 w-5 text-green-500" />
                  {:else if item.status === 'in-progress'}
                    <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </section>

      
      <section id="rsc-signup" class="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-bold mb-4">Be the First to Know</h2>
          <p class="text-xl opacity-90 mb-8">
            Get early access to our resource library and exclusive study abroad content
          </p>

            <NewsletterFormCs {form} />

          <!-- {/* Interest Selection */}
            <div class="max-w-2xl mx-auto">
                <p class="text-sm opacity-90 mb-4">What resources interest you most?</p>
                <div class="flex flex-wrap gap-2 justify-center">
                    {interestOptions.map((interest) => (
                        <button
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        class={`px-3 py-1 rounded-full text-sm transition-colors ${
                            interests.includes(interest)
                            ? 'bg-white text-blue-600'
                            : 'bg-white/20 hover:bg-white/30'
                        }`}
                        >
                        {interest}
                        </button>
                    ))}
                </div>
            </div> -->
        </div>
    </section>
</div>
 
