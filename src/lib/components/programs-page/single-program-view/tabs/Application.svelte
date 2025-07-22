<script>
    import { program } from "../test";

</script>


<div class="space-y-6">
    <div>
        <h3 class="text-lg font-semibold text-foreground mb-3">Application Process</h3>
        <div class="space-y-4">
            {#each program.applicationProcess as step, idx}
                <div key={idx} class="flex space-x-4">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {step.step}
                        </div>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-medium text-foreground">{step.title}</h4>
                        <p class="text-sm text-secondary-foreground/80 mb-1">{step.description}</p>
                        <p class="text-xs text-secondary-foreground font-medium">{step.deadline}</p>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div>
        <h3 class="text-lg font-semibold text-foreground mb-3">Requirements</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <div>
                <h4 class="font-medium text-foreground mb-2">Academic Requirements</h4>
                <div class="space-y-2 text-sm">
                    <div>
                        <span class="font-medium text-foreground">Minimum GPA:</span>
                        <span class="text-muted-foreground ml-2">{program.requirements.gpa}</span>
                    </div>
                    <div>
                        <span class="font-medium text-foreground">Minimum Prerequisites:</span>
                        <span class="text-muted-foreground ml-2">{program.requirements.prerequisites}</span>
                    </div>
                </div>
            </div>
            <div>
                <h4 class="font-medium text-foreground mb-2">Language Requirements</h4>
                <p class="text-sm text-secondary-foreground">{program.requirements.language}</p>
            </div>
        </div>
    </div>
</div>