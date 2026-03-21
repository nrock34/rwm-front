<script>
    import * as ToggleGroup from "$lib/components/ui/toggle-group";
    import UniversitySelect from "$lib/components/forms/utils/UniversitySelect.svelte";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { superForm } from "sveltekit-superforms/client";
    import { yupClient } from "sveltekit-superforms/adapters";
    import { academicBackgroundSchema } from "../schema";
    import * as Form from "$lib/components/ui/form";
    import { Button } from "$lib/components/ui/button";
    import { ChevronRight } from "lucide-svelte";
    import {
        CURRENT_GRADUATION_YEAR,
        MAX_GRADUATION_YEAR,
        MIN_GRADUATION_YEAR,
        ONBOARDING_STEP_IDS,
        ONBOARDING_STORAGE_KEYS,
        writeStoredJson
    } from "$domains/onboarding/index.js";

    let {
        data = $bindable(),
        currentFormId = $bindable(),
        prevFormId = $bindable()
    } = $props();

    let { studentOptions } = data;

    const form = superForm(data.form, {
        dataType: "json",
        validators: yupClient(academicBackgroundSchema),
        onResult: ({ result }) => {
            if (result.data?.nextForm && result.data?.success) {
                prevFormId = ONBOARDING_STEP_IDS.academic;
                currentFormId = ONBOARDING_STEP_IDS.global;

                data.prevForm = data.form;
                data.form = data.GlobalBackgroundForm;
                data.academicPayload = result.data.onboardingDraft?.academic_background ?? null;

                writeStoredJson(
                    ONBOARDING_STORAGE_KEYS.academicFields,
                    result.data.form.data
                );
                writeStoredJson(
                    ONBOARDING_STORAGE_KEYS.academicStep,
                    result.data.onboardingDraft?.academic_background ?? null
                );
            }
        }
    });

    const studentLang = {
        current: {
            school: "What school do you currently attend?",
            major: "What is your major?",
            yr: "Expected Graduation Year"
        },
        alumni: {
            school: "What school did you attend?",
            major: "What did you major in?",
            yr: "Graduating Year"
        }
    };

    const { form: formData, enhance } = form;

    let isFormValid = $derived.by(() => {
        const university = typeof $formData.university === "string" ? $formData.university.trim() : "";
        const major = typeof $formData.major === "string" ? $formData.major.trim() : "";
        const year = Number($formData.year);
        const hasValidUniversity = university.length > 0 &&
            (/^\d+$/u.test(university) || university.length >= 2);

        return Boolean($formData.studentLevel) &&
            hasValidUniversity &&
            major.length >= 2 &&
            Number.isInteger(year) &&
            year >= MIN_GRADUATION_YEAR &&
            year <= MAX_GRADUATION_YEAR;
    });
</script>

<Card.Root class="mx-auto w-full max-w-3xl p-8 sm:p-10 sm:text-right">
    <h1 class="text-2xl font-serif text-center mb-4">Your Academic Background</h1>
    <form method="POST" action={"?/academicBackground"} use:enhance>
        <div class="flex flex-col gap-4">
            <Form.Field {form} name="studentLevel">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label class="font-medium text-md sm:text-lg">What status best represents you?</Form.Label>
                        <ToggleGroup.Root
                            {...props}
                            onValueChange={() => {
                                form.validate("studentLevel");
                            }}
                            bind:value={$formData.studentLevel}
                            type="single"
                            class="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 justify-center items-center w-full"
                        >
                            {#each studentOptions as option, idx}
                                {@const idxOddAndEnd = (studentOptions.length - 1 === idx) && (studentOptions.length % 2 !== 0)}
                                <div class={`rounded-(--radius) w-full ${idxOddAndEnd ? "col-span-2" : ""} sm:col-span-1`}>
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
                    {$formData.studentLevel === "almn" ? studentLang.alumni.school : studentLang.current.school}
                </label>
                <div>
                    {#if data.universityList?.length}
                        <UniversitySelect
                            name="university"
                            onchange={() => form.validate("university")}
                            bind:value={$formData.university}
                            className="h-10"
                            {data}
                        />
                    {:else}
                        <Input
                            bind:value={$formData.university}
                            name="university"
                            class="h-10 text-right"
                            placeholder="Enter your university"
                        />
                    {/if}
                </div>
            </div>
            <div class="grid-cols-2 grid gap-4">
                <div class="flex flex-col gap-2">
                    <label for="major" class="font-medium text-sm md:text-lg sm:text-md">
                        {$formData.studentLevel === "almn" ? studentLang.alumni.major : studentLang.current.major}
                    </label>
                    <Input
                        bind:value={$formData.major}
                        name="major"
                        class="h-10 text-right"
                        placeholder={"e.g. History"}
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="year" class="font-medium text-nowrap text-sm sm:text-md md:text-lg">
                        {$formData.studentLevel === "almn" ? studentLang.alumni.yr : studentLang.current.yr}
                    </label>
                    <Input
                        bind:value={$formData.year}
                        name="year"
                        type="number"
                        class="h-10 text-right"
                        min={String(MIN_GRADUATION_YEAR)}
                        max={String(MAX_GRADUATION_YEAR)}
                        placeholder={String(CURRENT_GRADUATION_YEAR)}
                    />
                </div>
            </div>
            <Button disabled={!isFormValid} type="submit">
                <span>Next</span>
                <ChevronRight />
            </Button>
        </div>

    </form>
</Card.Root>
