<script>
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import * as Card from "$lib/components/ui/card";
    import { Mail } from "lucide-svelte";

</script>


<Card.Root class="bg-ring/10 gap-2 sm:gap-4 border-ring">
    <Card.Header class="gap-1 sm:gap-2">
        <div class="flex items-center space-x-2 sm:space-x-3">
            <Mail class="w-4" />
            <h3 class="text-xs sm:text-sm font-semibold text-foreground">Want to Stay Updated?</h3>
        </div>
        <p class="text-secondary-foreground text-[0.65rem] sm:text-xs">
            Get monthly updates with the latest community highlights & opportunities.</p>
    </Card.Header>

    <Card.Content>
        <form class="space-y-1 sm:space-y-3">
            <Input
                type="email"
                placeholder="Enter your email"
                class="h-7 sm:h-11 text-xs sm:text-sm" 
            />
            <Button 
                type="submit"
                class="w-full h-6 text-xs sm:text-sm"
                >
                Subscribe
            </Button>
        </form>
        <p class="text-[0.60rem] text-secondary-foreground mt-2 ml-[1px]">
            Unsubscribe anytime.
        </p>
    </Card.Content>
</Card.Root>