<script>
    import { program } from "../test";

</script>




<div class="space-y-6">
    <div>
        <h3 class="text-base sm:text-lg font-semibold text-foreground mb-3">Program Costs</h3>
        <div class="rounded p-4 py-2">
            <div class="space-y-3 divide-y-1">
                <div class="flex justify-between text-sm sm:text-base items-center">
                    <span class="text-foreground">Program Fee</span>
                    <span class="font-medium text-foreground">{program.costs.tuition}</span>
                </div>
                <div class="flex justify-between text-sm sm:text-base items-center">
                    <span class="text-foreground">Accomodations</span>
                    <span class="font-medium text-foreground">{program.costs.housing}</span>
                </div>
                <div class="flex justify-between text-sm sm:text-base items-center">
                    <span class="text-foreground">Meals</span>
                    <span class="font-medium text-foreground">{program.costs.meals}</span>
                </div>
                <div class="flex justify-between text-sm sm:text-base items-center">
                    <span class="text-foreground">Extra Fees</span>
                    <span class="font-medium text-foreground">{program.costs.extra_fees ?? 'N/A'}</span>
                </div>
            </div>
            <div class="border-t-3 border-secondary-foreground pt-2 mt-2">
                <div class="flex justify-between items-center">
                    <span class="font-semibold text-sm sm:text-base text-foreground">Total Program Cost:</span>
                    <span class="font-bold text-primary text-lg">{program.costs.total}</span>
                </div>
            </div>
        </div>
        <p hidden class="text-sm text-secondary-foreground mt-3">{program.costs.additional}</p>
    </div>
</div>