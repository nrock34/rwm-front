<script>
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import * as Card from "$lib/components/ui/card";
    import { Mail } from "lucide-svelte";

</script>


<Card.Root class="bg-ring/10 border-ring">
    <Card.Header>
        <div class="flex items-center space-x-4">
            <Mail class="w-6 h-6" />
            <h3 class="text-lg font-semibold text-foreground">Want to Stay Updated?</h3>
        </div>
        <p class="text-secondary-foreground text-sm">
            Get monthly updates with the latest community highlights & opportunities.</p>
    </Card.Header>

    <Card.Content>
        
        <form class="space-y-3">
            <Input
                type="email"
                placeholder="Enter your email"
                class="h-11" 
            />
            <Button 
                type="submit"
                class="w-full h-10 text-md"
                >
                Subscribe
            </Button>
        </form>
        <p class="text-xs text-secondary-foreground mt-2 ml-[1px]">
            Unsubscribe anytime.
        </p>
    </Card.Content>
</Card.Root>