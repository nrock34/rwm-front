<script>

    let { program } = $props();
</script>




<div class="space-y-6">
    <div>
        <h3 class="text-base sm:text-lg font-semibold text-foreground mb-3">Program Costs</h3>
        <div class="rounded p-4 py-2">
            <div class="space-y-3 divide-y-1">
                <div class="flex justify-between text-sm sm:text-base items-center">
                    <span class="text-foreground">Program Fee</span>
                    <span class="font-medium text-foreground">${program.cost.program_fee}</span>
                </div>
                <div class="flex justify-between text-sm sm:text-base items-center">
                    <span class="text-foreground">Accomodations</span>
                    <span class="font-medium text-foreground">${program.cost.accommodation_fee}</span>
                </div>
                <div class="flex justify-between text-sm sm:text-base items-center">
                    <span class="text-foreground">Extra Fees</span>
                    <span class="font-medium text-foreground">${program.cost.extra_fee ?? 'N/A'}</span>
                </div>
            </div>
            <div class="border-t-3 border-secondary-foreground pt-2 mt-2">
                <div class="flex justify-between items-center">
                    <span class="font-semibold text-sm sm:text-base text-foreground">Total Program Cost:</span>
                    <span class="font-bold text-primary text-lg">${program.cost.program_fee + program.cost.accommodation_fee + program.cost.extra_fee}</span>
                </div>
            </div>
        </div>
        <p class="text-sm text-foreground mt-3">{program.cost.additional}</p>
    </div>
</div>