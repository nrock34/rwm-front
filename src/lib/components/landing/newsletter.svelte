<script>
    import Button from "../ui/button/button.svelte";
import Input from "../ui/input/input.svelte";

</script>
<section class="py-16 bg-muted">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl font-bold text-foreground mb-2">
            Stay Updated with Weekly Highlights
        </h2>
        <p class="text-secondary-foreground mb-6">
            Get the latest scholarships, program updates, and community highlights delivered to your inbox.
        </p>
        
        <form class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
                type="email"
                placeholder="Enter your email address"
                class="flex-1 border-border border-2"
            />
            <Button type="submit" class="btn-primary cursor-pointer">
                Subscribe
            </Button>
        </form>
        
        <p class="text-xs text-muted-foreground mt-2.5">
            Join other students already subscribed
        </p>
    </div>
</section>