<script>
    import { CheckCircle } from 'lucide-svelte';

    
    import {program} from '../test'


    const descriptionParagraphs = program.fullDescription.split('\n\n')

</script>


<div class="space-y-6">

    <!-- description of program -->
    <div>
        <h3 class="text-base sm:text-lg font-semibold text-foreground mb-3">About This Program</h3>
        <div class="text-sm sm:text-base sm:leading-tight tracking-wide max-w-none font-light text-foreground/90">
            {#each descriptionParagraphs as paragraph, idx}
                <p key={idx} class="mb-4">{paragraph}</p>
            {/each}
        </div>
    </div>

    <div>
        <h3 class="text-base sm:text-lg font-semibold text-foreground mb-3">Program Highlights</h3>
        <div class="grid md:grid-cols-2 gap-3">
            {#each program.highlights as highlight, idx}
                <div key={idx} class="flex items-center space-x-2">
                    <CheckCircle class="h-4 w-4 text-green-600 flex-shrink-0"/>
                    <span class="text-sm sm:text-base sm:leading-tight tracking-normal max-w-none text-foreground/90">{highlight}</span>
                </div>
            {/each}
        </div>
    </div>

    <div>
        <h3 class="text-base sm:text-lg font-semibold text-foreground mb-3">University / Provider Information</h3>
        <div class="bg-secondary/90 rounded-(--radius) p-5 ring-ring/10 ring">
            <h4 class="font-medium text-foreground mb-1 sm:mb-1.5">{program.university.name}</h4>
            <p class="text-xs sm:text-sm tracking-normal max-w-none font-normal text-foreground/90 mb-3">{program.university.description}</p>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="space-x-1.5">
                    <span class="font-medium text-foreground">Founded: </span>
                    <span class="text-foreground/90">{program.university.founded}</span>
                </div>
                <div class="space-x-1.5">
                    <span class="font-medium text-foreground">Students: </span>
                    <span class="text-foreground/90">~{program.university.students}</span>
                </div>
                <div class="space-x-1.5">
                    <span class="font-medium text-foreground">Ranking: </span>
                    <span class="text-nowrap text-foreground/90">{program.university.ranking}</span>
                </div>
                <div class="space-x-1.5">
                    <span class="font-medium text-foreground">Accreditation: </span>
                    <span class="text-nowrap text-foreground/90">{program.university.accreditation}</span>
                </div>
            </div>
        </div>
    </div>
</div>