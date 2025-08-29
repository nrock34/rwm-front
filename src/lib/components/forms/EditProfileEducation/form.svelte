<script>

    import * as Form from '$lib/components/ui/form';
    import { superForm } from 'sveltekit-superforms';
    import { yupClient } from 'sveltekit-superforms/adapters';
    import { profileEducationSchema } from './schema';
    import * as Select from '$lib/components/ui/select';
   
    import { Checkbox } from '$lib/components/ui/checkbox';
    import Input from '$lib/components/ui/input/input.svelte';
    import { CameraIcon } from 'lucide-svelte';

    import { today, getLocalTimeZone } from "@internationalized/date";

    import Button from '$lib/components/ui/button/button.svelte';
    import Textarea from '$lib/components/ui/textarea/textarea.svelte';
    import UniversitySelect from '../utils/UniversitySelect.svelte';
    import { range } from '$lib/utils';
    import SelectItem from '$lib/components/ui/select/select-item.svelte';
 
    let value = $state()
    let updated = $state(false)

    //form supervalidated
    let { data, actionName } = $props();
    
    const form = superForm( data.editProfileEducationForm, {
        dataType: 'json',
        validators: yupClient(profileEducationSchema),
    })

    const { form: formData, enhance, errors, valid } = form;

    let currentYear = today(getLocalTimeZone()).year
    let yearOptions = range(currentYear-20, currentYear+8)
    $formData.gradYear = currentYear
    // select trigger content
                
    
</script>

<div>
    <form method="POST" action={actionName} use:enhance>

        <div class="grid gap-4">

            <Form.Field { form } name="university" class="col-span-2">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Your University</Form.Label>
                        <UniversitySelect 
                            {data} className="h-10 " 
                            bind:value={$formData.university}
                            onchange={() => {updated = true}}
                            fieldProps={props}/>
                    {/snippet}
                </Form.Control>
                <!-- <span>{$formData.university}</span> -->
            </Form.Field>

            <div class="grid col-span-2 gap-4 grid-cols-2">
                <Form.Field {form } name="major" class="">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Major</Form.Label>
                            <Input
                                {...props}
                                class="w-full h-10 text-xs sm:text-sm" 
                                placeholder="Enter your major"
                                oninput={() => {updated = true}}
                                bind:value={$formData.major}
                            />
                        {/snippet}
                    </Form.Control>
                </Form.Field>

                <Form.Field {form} name="year">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Graduation Year</Form.Label>
                            <Select.Root type='single' bind:value={$formData.grad_year}>
                                <Select.Trigger class="min-h-10 w-full text-xs sm:text-sm" {...props}>
                                    {$formData.grad_year}
                                </Select.Trigger>
                                <Select.Content class="max-h-68 px-2.5">
                                    {#each yearOptions as year, idx}
                                        <Select.Item value={year}>{year}</Select.Item>
                                        {#if !(idx == yearOptions.length - 1)}
                                            <Select.Separator class="mx-auto bg-muted-foreground/50 "></Select.Separator>
                                        {/if}
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                        {/snippet}
                    </Form.Control>
                </Form.Field>
            </div>
            

            <div class="flex w-full col-span-2 flex-col items-end mt-6">
                <Form.Button disabled={!updated}>
                    Save Changes
                </Form.Button>
            </div>
        </div>

    
    </form>
</div>