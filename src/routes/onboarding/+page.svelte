<script>
    import { invalidateAll } from '$app/navigation';
    import GlobeLogo from "$lib/assets/logos/VX78WS01.svelte";
    import { Book, Globe } from "lucide-svelte";
    import { ONBOARDING_STEP_IDS } from "$domains/onboarding/index.js";
    import AcademicBackgroundForm from "./forms/academic-background-form.svelte";
    import GlobalBackgroundForm from "./forms/global-background-form.svelte";
    import { Skeleton } from '$lib/components/ui/skeleton';

    let { data } = $props();

    let prevFormId = $state("");
    let currentFormId = $state(ONBOARDING_STEP_IDS.academic);
    let CurrentForm = $derived.by(() => {
        if (currentFormId === ONBOARDING_STEP_IDS.academic) {
            return AcademicBackgroundForm;
        }

        if (currentFormId === ONBOARDING_STEP_IDS.global) {
            return GlobalBackgroundForm;
        }

        return AcademicBackgroundForm;
    });

    const studentOptions = [
        { label: "Undergraduate", id: "ungrd", icon: Book },
        { label: "Graduate", id: "grad", icon: Book },
        { label: "Alumni", id: "almn", icon: Book }
    ];

    data = {
        studentOptions,
        ...data
    };
</script>

<div class="relative bg-muted grid min-h-screen w-full place-items-center p-4 sm:p-8 lg:p-12">
    <div class="mx-auto w-full max-w-3xl">
        <a href="/" class="">
            <div class="flex justify-center items-center gap-x-2 p-4">
                <GlobeLogo class="stroke-primary fill-primary h-24 w-24 sm:h-30 sm:w-30" />
                <div class="brand-lockup-tight flex flex-col">
                    <h3 class="font-bold text-3xl sm:text-4xl">RomeWithMe</h3>
                    <p class="tracking-tight text-foreground/85 tracking-wide text-base sm:tracking-normal sm:text-xl">Grow Roots in New Places</p>
                </div>
            </div>
        </a>
        <svelte:boundary>
            
            <CurrentForm
                invalidateAll={() => {
                    invalidateAll();
                }}
                bind:currentFormId
                bind:prevFormId
                bind:data
            />
    
            {#snippet pending()}
                <Skeleton class="bg-muted-foreground/30 h-48 w-full shadow-sm" />
            {/snippet}
        </svelte:boundary>
    </div>
</div>
