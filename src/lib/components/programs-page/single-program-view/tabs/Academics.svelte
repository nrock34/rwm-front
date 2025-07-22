<script>
    import { GraduationCap, Plane } from "lucide-svelte";
    import { program } from "../test";

</script>



<div class="space-y-6">
    <div>
        <h3 class="text-lg font-semibold text-foreground mb-3">Course Offerings</h3>
        <div class="grid md:grid-cols-2 gap-3">
            {#each program.academics.courses as course, idx}
                <div key={idx} class="flex items-center space-x-2">
                    <GraduationCap class="h-4 w-4 text-primary flex-shrink-0"/>
                    <span class="text-sm text-secondary-foreground">{course}</span>
                </div>
            {/each}
        </div>
    </div>

    <div>
        <h3 class="text-lg font-semibold text-foreground mb-3">Offered Trips & Excursioons</h3>
        <div class="grid md:grid-cols-2 gap-3">
            {#each program.academics.fieldTrips as trip, idx}
                <div key={idx} class="flex items-center space-x-2">
                    <Plane class="h-4 w-4 text-primary flex-shrink-0"/>
                    <span class="text-sm text-secondary-foreground">{trip}</span>
                </div>
            {/each}
        </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
        <div>
            <h4 class="font-medium text-foreground mb-2">Academic Details</h4>
            <div class="space-y-2 text-sm">
                <div>
                    <span class="font-medium text-foreground">Faculty:</span>
                    <span class="text-secondary-foreground ml-2">{program.academics.faculty}</span>
                </div>
                <div>
                    <span class="font-medium text-foreground">Class Size:</span>
                    <span class="text-secondary-foreground ml-2">{program.academics.classSize}</span>
                </div>
            </div>
        </div>
        <div>
            <h4 class="font-medium text-foreground mb-2">Requirements</h4>
            <div class="space-y-2 text-sm">
                <div>
                    <span class="font-medium text-foreground">GPA:</span>
                    <span class="text-secondary-foreground ml-2">{program.requirements.gpa}</span>
                </div>
                <div>
                    <span class="font-medium text-foreground">Credits:</span>
                    <span class="text-secondary-foreground ml-2">{program.requirements.credits}</span>
                </div>
                <div>
                    <span class="font-medium text-foreground">Field:</span>
                    <span class="text-secondary-foreground ml-2">{program.requirements.field}</span>
                </div>
                <div>
                    <span class="font-medium text-foreground">Level:</span>
                    <span class="text-secondary-foreground ml-2">{program.requirements.level}</span>
                </div>
            </div>
        </div>
    </div>
</div>