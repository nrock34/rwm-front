<script>
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import UniversitySelect from "$lib/components/forms/utils/UniversitySelect.svelte";
    import * as Card from "$lib/components/ui/card";
    import Input from "$lib/components/ui/input/input.svelte";
    import { superForm } from "sveltekit-superforms/client";
    import { yupClient } from "sveltekit-superforms/adapters";
    import { academicBackgroundSchema } from "../schema";
    import * as Form from "$lib/components/ui/form";
    import Button from "$lib/components/ui/button/button.svelte";
    import { ChevronRight } from "lucide-svelte";

    let { data = $bindable(), currentFormId = $bindable(), prevFormId = $bindable(), actionName } = $props()

    let { studentOptions } = data

    console.log(data.form)

    const form = superForm(data.form, {
        dataType: 'json',
        validators: yupClient(academicBackgroundSchema),
        onResult: ({ result }) => {
            if (result.data.nextForm && result.data.success) {
                prevFormId = 'acd'
                currentFormId = 'glb'
                console.log(result)

                data.prevForm = data.form
                data.form = data.GlobalBackgroundForm
                
                sessionStorage.setItem(
                    'acd_bck_fields', JSON.stringify(result.data.form.data)
                )
            }
        } 
    })

    const studentLang = {
        current: {
            school: "What school do you currently attend?",
            major: "What is your major?",
            yr: "Expected Graduation Year",
        },
        alumni: {
            school: "What school did you attend?",
            major: "What did you major in?",
            yr: "Graduating Year",
        }
    }

    const { form: formData, enhance, errors } = form


    const initialFormState = await form.validateForm({ update: true })
    let isFormValid = $derived.by(() => {
        return Object.values($errors).every((field) => field === undefined)
    })

    console.log($formData.studentLevel)
</script>

<Card.Root class="w-full p-10 sm:text-right">
    <h1 class="text-2xl font-serif text-center mb-4">Your Academic Background</h1>
    <form method="POST" action={"?/acdBackground"} use:enhance>
        <div class="flex flex-col gap-4">
            <Form.Field {form} name="studentLevel">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label class="font-medium text-md sm:text-lg">What status best represents you?</Form.Label>
                        <ToggleGroup.Root {...props} onValueChange={() => {form.validate('studentLevel')}} 
                            bind:value={$formData.studentLevel} 
                            type="single" 
                            class="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 justify-center items-center w-full"
                        >
                            {#each studentOptions as option, idx}
                                {@const idxOddAndEnd = (studentOptions.length-1 === idx) && (studentOptions.length % 2 !== 0)}
                                <div class={`rounded-(--radius) w-full ${idxOddAndEnd ? 'col-span-2': ''} sm:col-span-1`}>
                                    <ToggleGroup.Item class="text-xs sm:text-sm py-10 border-2 w-full border-muted " value={option.id}>
                                        {option.label}
                                    </ToggleGroup.Item>
                                </div>
                            {/each}
                        </ToggleGroup.Root>
                    {/snippet}
                </Form.Control>
            </Form.Field>

        </div>
        <div hidden={!$formData.studentLevel} class="flex flex-col gap-6 mt-8">
            <div class="flex flex-col gap-2">
                <label for="university" class="font-medium text-md sm:text-lg">
                    {$formData.studentLevel === 'almn' ? studentLang.alumni.school : studentLang.current.school}
                </label>
                <div>
                    <UniversitySelect name="university" onchange={() => form.validate('university')} bind:value={$formData.university} className="h-10" {data} />
                </div>
            </div>
            <div class="grid-cols-2 grid gap-4">
                <div class="flex flex-col gap-2">
                    <label for="major"
                        class="font-medium text-sm md:text-lg sm:text-md"
                    >
                        {$formData.studentLevel === 'almn' ? studentLang.alumni.major : studentLang.current.major}
                    </label>
                    <Input
                        bind:value={$formData.major}
                        name="major"
                        class="h-10 text-right"
                        placeholder={"e.g. History"}/>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="year"
                        class="font-medium text-nowrap text-sm sm:text-md md:text-lg"
                    >
                        {$formData.studentLevel === 'almn' ? studentLang.alumni.yr : studentLang.current.yr}
                    </label>
                    <Input
                        bind:value={$formData.year}
                        name="year"
                        type="number"
                        class="h-10 text-right"
                        min="1990"
                        max="2030"
                        placeholder={"2025"}/>
                </div>
            </div>
            <Button
                disabled={!isFormValid}
                type="submit">
                <span>Next</span>
                <ChevronRight />
            </Button>
        </div>
        
    </form>
</Card.Root>