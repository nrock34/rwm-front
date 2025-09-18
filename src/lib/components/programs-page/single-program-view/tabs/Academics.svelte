<script>
    import { GraduationCap, Plane } from "lucide-svelte";
    
    
    let { program } = $props();

</script>



<div class="space-y-3 sm:space-y-4.5 w-full">
    <div class="flex flex-col w-full">
        <h3 class="text-sm sm:text-base font-semibold text-foreground mb-1 sm:mb-2">Course Offerings</h3>
        <div class="grid md:grid-cols-2 gap-1 sm:gap-2 md:gap-2.5">
            {#each program.academics.courses as course, idx}
                <div key={idx} class="flex items-center space-x-2">
                    <GraduationCap class="h-4 w-4 text-primary flex-shrink-0"/>
                    <span class="text-xs sm:text-sm text-secondary-foreground">{course}</span>
                </div>
            {/each}
        </div>
    </div>

    <div class="flex flex-col w-full">
        <h3 class="text-sm sm:text-base font-semibold text-foreground mb-1 sm:mb-2">Offered Trips & Excursioons</h3>
        <div class="grid md:grid-cols-2 gap-1 sm:gap-2 md:gap-2.5">
            {#each program.academics.fieldTrips as trip, idx}
                <div key={idx} class="flex items-center space-x-2">
                    <Plane class="h-4 w-4 text-primary flex-shrink-0"/>
                    <span class="text-xs sm:text-sm text-secondary-foreground">{trip}</span>
                </div>
            {/each}
        </div>
    </div>

    <div class="grid grid-cols-2 gap-x-4 sm:gap-6 w-full">
        <div class="flex flex-col w-full">
            <h4 class="sm:text-base text-sm font-medium text-foreground mb-1 sm:mb-2">Academic Details</h4>
            <div class="space-y-1 text-xs sm:text-sm w-full">
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
        <div class="flex flex-col w-full">
            <h4 class="sm:text-base text-sm font-medium text-foreground mb-1 sm:mb-2">Requirements</h4>
            <div class="space-y-1 text-xs sm:text-sm flex flex-col w-full">
                <div class="w-full">
                    <span class="font-medium text-foreground">GPA:</span>
                    <span class="text-secondary-foreground ml-2">{program.requirements.gpa}</span>
                </div>
                <div>
                    <span class="font-medium text-foreground">Credits:</span>
                    <span class="text-secondary-foreground ml-2">{program.requirements.active_credits_needed}</span>
                </div>
                <div>
                    <span class="font-medium text-foreground">Field:</span>
                    <span class="text-secondary-foreground ml-2">{program.fields}</span>
                </div>
                <div>
                    <span class="font-medium text-foreground">Level:</span>
                    <span class="text-secondary-foreground ml-2">{program.requirements.level}</span>
                </div>
            </div>
        </div>
    </div>
</div>