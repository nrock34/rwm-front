<script>

  import FeaturedResource from './featuredResource.svelte';
</script>

<div class="card p-6 ring-2 ring-primary/20">
                <div class="flex items-center space-x-2 mb-4">
                    <Globe class="h-5 w-5 text-primary" />
                    <span class="badge-default text-xs">Featured Program</span>
                </div>
                <h3 class="text-lg font-semibold text-foreground mb-2">Semester in Florence</h3>
                <p class="text-muted-foreground mb-4">
                Immerse yourself in Renaissance art and Italian culture in the heart of Tuscany.
                </p>
                <div class="space-y-2 text-sm text-muted-foreground mb-4">
                    <div class="flex items-center space-x-2">
                        <Calendar class="h-4 w-4" />
                        <span>Duration: 1 Semester</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <Star class="h-4 w-4 text-yellow-500 fill-current" />
                        <span>4.8 rating</span>
                    </div>
                </div>
                <a to="/programs/1" class="btn-primary w-full">
                    Explore Program
                </a>
            </div>

