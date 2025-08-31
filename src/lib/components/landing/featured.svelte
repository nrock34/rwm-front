<script>
  import FeaturedScholarship from './FeaturedScholarship.svelte';
  import FeaturedProgram from './featuredProgram.svelte';
  import FeaturedResource from './featuredResource.svelte';
</script>

<section class="py-20 bg-background">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Featured Opportunities
            </h2>
            <p class="text-xl text-muted-foreground">
                Don't miss these amazing opportunities
            </p>
        </div>
        
        <div class="grid lg:grid-cols-3 gap-8">
        {/* Featured Scholarship */}
            <FeaturedScholarship></FeaturedScholarship>

        {/* Featured Program */}
            <FeaturedProgram></FeaturedProgram>

        {/* Featured Resource */}
            <FeaturedResource></FeaturedResource>
        </div>
    </div>
</section>