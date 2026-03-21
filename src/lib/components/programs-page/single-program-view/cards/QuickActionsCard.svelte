<script>
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";

    let { program } = $props();
</script>

<Card.Root class="gap-2 p-6">
    <h3 class="mb-4 font-semibold text-foreground">Quick Actions</h3>
    <div class="space-y-3">
        <Button href={program.applicationLink} class="w-full">
            Apply Now
        </Button>
        <Button href={program.infoLink} variant="secondary" class="w-full">
            More Information
        </Button>
    </div>
</Card.Root>
