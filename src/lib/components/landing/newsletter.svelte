<script>
    import Button from "../ui/button/button.svelte";
    import Input from "../ui/input/input.svelte";

    import { fly } from "svelte/transition";
    import { enhance } from "$app/forms";

    let { form } = $props()

</script>

<section class="py-16 bg-muted">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl font-bold text-foreground mb-2">
            Stay Updated with Weekly Highlights
        </h2>
        <p class="text-secondary-foreground mb-6">
            Get the latest scholarships, program updates, and community highlights delivered to your inbox.
        </p>
        
        <form use:enhance method="POST" action={'?/newsletterSignup'} class="flex flex-col sm:flex-row sm:items-start gap-4 max-w-md mx-auto">
            <!-- <label for="email">
                Email:
            </label> -->
            <div class="flex-1 flex-col flex items-start gap-y-1">
                 <Input
                    name="email"
                    value={form?.email}
                    type="email"
                    placeholder="Enter your email address"
                    class="flex-1 border-border border-2"
                />
                {#if form?.error}
                    <p in:fly={{y: 10}} class="pt-1 pl-1 capitalize tracking-normal text-destructive text-xs ">Error: {form.error} - {form.description} </p>
                {/if}
                {#if form?.status === 'success'}
                    <p in:fly={{y: 10}} class="pt-1 pl-1 leading-none tracking-normal text-green-600 text-xs ">Success, you're now subscribed to the newsletter. Stay tuned for updates sent to your email!</p>
                {/if}

            </div>
            
            <Button type="submit" class="btn-primary cursor-pointer">
                Subscribe
            </Button>
        </form>
        
        
        <p class="text-xs text-muted-foreground mt-2.5">
            Join other students already subscribed
        </p>
    </div>
</section>