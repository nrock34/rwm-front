<script>
    
    import { Users, MessageCircle, Heart, Share2, Globe, Bell, CheckCircle, Camera, MapPin, Calendar } from 'lucide-svelte';
    import Input from '../ui/input/input.svelte';
    import Button from '../ui/button/button.svelte';
    import { Search } from '@lucide/svelte';
    
    let { form } = $props()

</script>

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

