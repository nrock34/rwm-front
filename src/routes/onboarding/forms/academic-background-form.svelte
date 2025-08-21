<script>
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import UniversitySelect from "$lib/components/forms/utils/UniversitySelect.svelte";
    import * as Card from "$lib/components/ui/card";
    import Input from "$lib/components/ui/input/input.svelte";
    import { superForm } from "sveltekit-superforms/client";
    import { yupClient } from "sveltekit-superforms/adapters";
    import { academicBackgroundSchema } from "../schema";
    import * as Form from "$lib/components/ui/form";

    let { data, actionName } = $props()

    let { studentOptions } = data

    console.log(data.AcademicBackgroundForm)

    const form = superForm(data.AcademicBackgroundForm, {
        dataType: 'json',
        validators: yupClient(academicBackgroundSchema)
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
            yr: "Year of graduation",
        }
    }

    const { form: formData, enhance, errors } = form

    console.log($formData.studentLevel)
</script>

<Card.Root class="w-full p-10">
    <form method="POST" use:enhance>
        <div class="flex flex-col gap-4">
            <Form.Field {form} name="studentLevel">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label class="font-semibold text-lg">What kind of student are you?</Form.Label>
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
                <Form.FieldErrors/>
            </Form.Field>

        </div>
        <div hidden={!$formData.studentLevel} class="flex flex-col gap-6 mt-10">
            <div class="flex flex-col gap-4">
                <label for="university" class="font-semibold text-lg">
                    {$formData.studentLevel === 'almn' ? studentLang.alumni.school : studentLang.current.school}
                </label>
                <div>
                    <UniversitySelect name="university" onchange={() => form.validate('university')} bind:value={$formData.university} className="h-12" {data} />
                </div>
            </div>
            <div class="grid-cols-2 grid gap-4">
                <div class="flex flex-col gap-2">
                    <label for="major">
                        {$formData.studentLevel === 'almn' ? studentLang.alumni.major : studentLang.current.major}
                    </label>
                    <Input
                        name="major"
                        class="h-10"
                        placeholder={"e.g. History"}/>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="year">
                        {$formData.studentLevel === 'almn' ? studentLang.alumni.yr : studentLang.current.yr}
                    </label>
                    <Input
                        name="year"
                        type="number"
                        class="h-10"
                        min="1990"
                        max="2030"
                        placeholder={"2025"}/>
                </div>
            </div>
        </div>
    </form>
</Card.Root>