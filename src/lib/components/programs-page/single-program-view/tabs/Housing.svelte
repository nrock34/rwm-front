<script>
    import { Home } from "lucide-svelte";

    let { program } = $props()

</script>

<div class="space-y-6">
    <div>
        <h3 class="text-base sm:text-lg font-semibold text-foreground mb-0.5 sm:mb-1">Accomodations</h3>
        <p class="text-sm sm:text-base text-foreground/90 mb-4">{program.housing.description}</p>

        <div class="grid md:grid-cols-2 gap-6">
            <div>
                <h4 class="font-semibold text-foreground mb-0.5 mb-1">Housing Details</h4>
                <div class="space-y-2 text-sm">
                    <div class="space-x-1.5">
                        <span class="font-medium text-foreground">Type:</span>
                        <span class="tracking-normal text-secondary-foreground ">{program.housing.type}</span>
                    </div>
                    <div class="space-x-1.5">
                        <span class="font-medium text-foreground">Location:</span>
                        <span class="tracking-normal text-secondary-foreground">{program.housing.location}</span>
                    </div>
                    <div class="space-x-1.5">
                        <span class="font-medium text-foreground">Cost:</span>
                        <span class="tracking-normal text-secondary-foreground ">{program.housing.cost}</span>
                    </div>
                </div>
            </div>
            <div>
                <h4 class="font-semibold text-foreground mb-0.5 mb-1">Amentities</h4>
                <div class="grid grid-cols-2 gap-2">
                    {#each program.housing.amenities as amentity, idx}
                        <div key={idx} class="flex items-center space-x-2">
                            <Home class="h-3 w-3 text-primary flex-shrink-0" />
                            <span class="text-sm text-secondary-foreground">{amentity}</span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>