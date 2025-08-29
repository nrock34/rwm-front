<script>
    import { yupClient } from "sveltekit-superforms/adapters";
    import { globalBackgroundSchema } from "../schema";
    import * as Card from "$lib/components/ui/card";
    import { superForm } from "sveltekit-superforms";
    import { BeanIcon, ChevronLeft, ChevronRight } from "lucide-svelte";
    import * as ToggleGroup from "$lib/components/ui/toggle-group";


    import backpackSvg from "$lib/assets/backpack-bag-outline-svgrepo-com.svg"
    import ticketSvg from "$lib/assets/plane-ticket-travel-svgrepo-com.svg"
    import beachSvg from "$lib/assets/beach-svgrepo-com.svg"
    import castleSvg from "$lib/assets/ancient-architecture-castle-svgrepo-com.svg"
    import thumbsUpSvg from "$lib/assets/thumbs-up-svgrepo-com.svg"

    import americasSvg from "$lib/assets/regions/globe-showing-americas-svgrepo-com.svg"
    import ausasiaSvg from "$lib/assets/regions/globe-showing-asia-australia-svgrepo-com.svg"
    import eurafricaSvg from "$lib/assets/regions/globe-showing-europe-africa-svgrepo-com.svg"

    import Input from "$lib/components/ui/input/input.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    import { toast } from "svelte-sonner";
   
    let { data = $bindable(), invalidateAll, currentFormId = $bindable(), prevFormId = $bindable()  } = $props()

    const form = superForm(data.form, {
        dataType: 'json',
        validators: yupClient(globalBackgroundSchema),
        onChange: (oops) => {
            console.log(oops)
        },

        
    })

    const { form: formData, enhance, errors } = form

    const travelExperienceOptions = [
        {label: "0 countries", value:"none", icon: backpackSvg},
        {label: "1-3 countries", value:"1to3", icon: beachSvg},
        {label: "4-7 countries", value:"4to7", icon: ticketSvg},
        {label: "8+ countries", value:"8plus", icon: castleSvg}
    ]

    const regionOptions = [
        {label: "Americas", value: "americas", icon: americasSvg},
        {label: "West Asia", value: "wasia", icon: ausasiaSvg},
        {label: "East Asia", value: "easia", icon: ausasiaSvg},
        {label: "Northen Europe", value: "neurope", icon: eurafricaSvg },
        {label: "Southern Europe", value: 'seurope', icon: eurafricaSvg},
        {label: "Northern Africa", value: "nafrica", icon: eurafricaSvg},
        {label: "Southern Africa", value: "safrica", icon: eurafricaSvg},
        {label: "Australia", value: "australia", icon: ausasiaSvg},
    ]

    const initialFormState = await form.validateForm({ update: true })

    let formValid = $derived.by(() => {
        return Object.values($errors).every(
            (field) => field === undefined
        )
    })

    onMount(async () => {
        const academicBackgroundFormData = sessionStorage.getItem('acd_bck_fields')
        
        if (!academicBackgroundFormData) { 
            currentFormId = prevFormId
            let prevForm = data.prevForm
            invalidateAll()
            data.form = prevForm
            toast.warning("Error occured, please try again. Contact us if this behavior is repeated.")
        } else {
            console.log(academicBackgroundFormData)
        }
    })


</script>


<Card.Root class="w-full p-6 sm:px-11">
    <h1 class="text-2xl font-serif font-medium text-center">Travel Experience & Global Interests</h1>
    <form class="px-4 text-center" method="POST" use:enhance>
        <div class="flex flex-col w-full">
            <div class="flex flex-col space-y-3">
                <label for="travelExperience" class="font-medium text-md sm:text-lg tracking-normal">How many different countries have you been to?</label>
                <ToggleGroup.Root
                    bind:value={$formData.travelExperience} 
                    onValueChange={() => {form.validate('travelExperience'); console.log($errors)}} 
                    name="travelExperience" type="single" 
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full gap-4 px-2"
                >
                    {#each travelExperienceOptions as opt}
                        <ToggleGroup.Item
                            class={`py-10 sm:py-16 flex flex-col jusitfy-center items-center border-1 border-border rounded-(--radius)`}
                            value={opt.value}
                        >
                            <img alt={`${opt.label} Icon`} class="object-cover flex-1 w-9 sm:w-16" src={opt.icon}/>
                            <span class="text-xs sm:text-sm">{opt.label}</span>
                        </ToggleGroup.Item>
                    {/each}
                </ToggleGroup.Root>
            </div>

            <div class="flex flex-col space-y-3 mt-10">
                <label for="hasTraveledEdu" class="font-medium text-md sm:text-lg tracking-normal">Have you ever participated in an educational program abroad?</label>
                <ToggleGroup.Root bind:value={$formData.hasTraveledEdu} onValueChange={() => {form.validate('hasTraveledEdu')}} name="hasTraveledEdu" type="single" class="grid grid-cols-2 w-full gap-4 px-2">
                    <ToggleGroup.Item class="py-10 sm:py-12 flex flex-col jusitfy-center items-center border-1 border-border rounded-(--radius)" value={true}>
                        <img alt="thumbs up" class="w-9 sm:w-11" src={thumbsUpSvg}/>
                        Yes
                    </ToggleGroup.Item>
                    <ToggleGroup.Item class="py-10 sm:py-12 flex flex-col jusitfy-center items-center border-1 border-border rounded-(--radius)" value={false}>
                        <img alt="thumbs down" class="w-9 sm:w-11 -rotate-180" src={thumbsUpSvg}/>
                        No
                    </ToggleGroup.Item>
                </ToggleGroup.Root>
            </div>

            <div class="flex flex-col space-y-3 mt-8">
                <label for="otherLanguageSpoken" class="font-medium text-md sm:text-lg tracking-normal">Do you speak/want to speak another language?</label>
                <div class="flex flex-col space-y-1 pl-2 pr-3">
                    <Input
                        bind:value={$formData.otherLanguageSpoken}
                        class="text-sm"
                        placeholder="Enter language here..."
                        name="otherLanguageSpoken"
                    />
                    <p class="pl-0.5 text-xs">Enter another language you speak fluently, or want to speak fluently.</p>
                </div>
            </div>


            <div class="flex flex-col space-y-4 mt-8">
                <label for="interestedRegions" class="font-medium text-md sm:text-lg tracking-normal">What regions are you interested in?</label>
                <ToggleGroup.Root bind:value={$formData.interestedRegions} onValueChange={() => {form.validate('interestedRegions')}} name="interestedRegions" type="multiple" class="px-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full gap-4">
                    {#each regionOptions as opt}
                        <ToggleGroup.Item
                            class={`py-10 sm:py-12 flex flex-col jusitfy-center items-center border-1 border-border rounded-(--radius)`}
                            value={opt.value}
                        >
                            <img alt={`${opt.label} Icon`} class="object-cover flex-1 w-9 sm:w-11" src={opt.icon}/>
                            <span class="text-xs sm:text-sm">{opt.label}</span>
                        </ToggleGroup.Item>
                    {/each}
                </ToggleGroup.Root>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-12 px-4 pt-8 pb-4">
            <Button
                hidden
                class=""
                onclick={() => {currentFormId = prevFormId}}
                >
                <ChevronLeft />
                <span>Back</span>
            </Button>
            <Button
                disabled={!formValid}
                class='col-span-2'
                type="submit"
            >
                <span>Continue</span>
                <ChevronRight />
            </Button>
        </div>
    </form>
</Card.Root>