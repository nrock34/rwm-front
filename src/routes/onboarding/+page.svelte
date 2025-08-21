<script>
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import UniversitySelect from "$lib/components/forms/utils/UniversitySelect.svelte";
    import * as Card from "$lib/components/ui/card";
    import Input from "$lib/components/ui/input/input.svelte";
    import { Book } from "lucide-svelte";

    
    import { yup } from "sveltekit-superforms/adapters";
    import AcademicBackgroundForm from "./forms/academic-background-form.svelte";
    import GlobalBackgroundForm from "./forms/global-background-form.svelte";


    let { data } = $props()

    const studentOptions = [
        {label: "Undergraduate", id: "ungrd", icon: Book},
        {label: "Graduate", id: "grad", icon: Book},
        {label: "Alumni", id: "almn", icon: Book},
    ]

    data = {
        studentOptions,
        ...data
    }

</script>


<svelte:boundary>
    <div class="bg-muted min-h-svh flex items-center justify-center p-12 sm:p-14">
        <div class="w-full max-w-3xl">
            <GlobalBackgroundForm {data} />
        </div>
        
        
        <!-- <AcademicBackgroundForm {data} /> -->
    </div>

    {#snippet pending()}
        loading
    {/snippet}
</svelte:boundary>