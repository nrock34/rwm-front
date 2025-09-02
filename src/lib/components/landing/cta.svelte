<script>
    import Button from "../ui/button/button.svelte";

</script>
<section class="py-20 bg-gradient-to-br from-primary/90 via-primary/80 to-secondary text-primary-foreground">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Roman Adventure?
        </h2>
        <p class="text-xl mb-8 opacity-90">
            Join thousands of students who have made their study abroad dreams a reality with RomeWithMe.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button class="py-8 bg-primary-foreground text-primary text-base border-2 border-primary-foreground" variant="secondary" href="/community">
                Join Community
            </Button>
            <Button class="py-8 text-base !border-white" variant="outline" href="/scholarships">
                Find Scholarships
            </Button>
        </div>
        
        <p class="text-sm mt-6 opacity-95">
        Free to join 
        <!-- • No spam • Unsubscribe anytime -->
        </p>
    </div>
</section>