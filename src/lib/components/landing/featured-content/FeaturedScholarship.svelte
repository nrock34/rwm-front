<script>
  import featuredProgram from './featuredProgram.svelte';


  import FeaturedResource from './featuredResource.svelte';
</script>

<div class="card p-6 ring-2 ring-primary/20">
                <div class="flex items-center space-x-2 mb-4">
                    <Award class="h-5 w-5 text-accent" />
                    <span class="badge-default text-xs">Featured Scholarship</span>
                </div>
                <h3 class="text-lg font-semibold text-foreground mb-2">Fulbright Student Program</h3>
                <p class="text-muted-foreground mb-4">
                    $25,000 - $50,000 funding for one academic year of study or research in Italy.
                </p>
                <div class="space-y-2 text-sm text-muted-foreground mb-4">
                    <div class="flex items-center space-x-2">
                        <Calendar class="h-4 w-4" />
                        <span>Deadline: March 15, 2024</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <MapPin class="h-4 w-4" />
                        <span>Italy</span>
                    </div>
                </div>
                <a to="/scholarships/1" class="btn-primary w-full">
                    Learn More
                </a>
            </div>

