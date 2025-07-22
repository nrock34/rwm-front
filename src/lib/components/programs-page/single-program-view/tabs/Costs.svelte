<script>
    import { program } from "../test";

</script>




<div class="space-y-6">
    <div>
        <h3 class="text-lg font-semibold text-foreground mb-3">Program Costs</h3>
        <div class="bg-secondary/60 rounded p-4">
            <div class="space-y-3">
                <div class="flex justify-between items-center">
                    <span class="text-foreground">Program Fee</span>
                    <span class="font-medium text-foreground">{program.costs.tuition}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-foreground">Accomodations</span>
                    <span class="font-medium text-foreground">{program.costs.housing}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-foreground">Meals</span>
                    <span class="font-medium text-foreground">{program.costs.meals}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-foreground">Extra Fees</span>
                    <span class="font-medium text-foreground">{program.costs.extra_fees}</span>
                </div>
                <div class="border-t border-border pt-3">
                    <div class="flex justify-between items-center">
                        <span class="font-semibold text-foreground">Total Program Cost:</span>
                        <span class="font-bold text-primary text-lg">{program.costs.total}</span>
                    </div>
                </div>
            </div>
        </div>
        <p class="text-sm text-muted-foreground mt-3">{program.costs.additional}</p>
    </div>
</div>