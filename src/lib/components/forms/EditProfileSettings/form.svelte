<script>
    import * as Form from '$lib/components/ui/form';
    import { superForm } from 'sveltekit-superforms';
    import { yupClient } from 'sveltekit-superforms/adapters';
    import { emailNotificationOptions, profileSettingsSchema, profileVisibilityOptions } from './schema';
    import * as Select from '$lib/components/ui/select';
   
    import { Checkbox } from '$lib/components/ui/checkbox';
    
    //form supervalidated
    let { data } = $props();
    
    const form = superForm( data.editProfileSettingsForm, {
        dataType: 'json',
        validators: yupClient(profileSettingsSchema),
    })

    const { form: formData, enhance } = form;


    // select trigger content

    const profileVisibilityTriggerContent = $derived(
            profileVisibilityOptions.find(opt => opt.id === $formData.profileVisibility)?.label
        )
                
    console.log($formData.emailNotifications)
</script>



<form class="space-y-10 " method="POST" use:enhance>
    <Form.Field class="text-left" {form} name="profileVisibility">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Profile Visibility</Form.Label>
                <Select.Root type='single' bind:value={$formData.profileVisibility}>
                    <Select.Trigger class="w-xs" {...props}>
                        {profileVisibilityTriggerContent}
                    </Select.Trigger>
                    <Select.Content>
                        {#each profileVisibilityOptions as item}
                            <Select.Item value={item.id}>{item.label}</Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors/>
        <Form.Description>
            If your profile is visible to others.
        </Form.Description>
    </Form.Field>
    
    <Form.Fieldset class="flex flex-col items-start" {form} name="emailNotifications">
        <Form.Legend class="text-left mb-1">
            Notification Opportunities
        </Form.Legend>
        <Form.Description class="text-xs mb-3">
            Get notified for ...
        </Form.Description>
        {#each emailNotificationOptions as option}
            {@const checked = $formData.emailNotifications[option.id]}
            <Form.Control>
                {#snippet children({ props })}
                    <div class="flex items-center space-x-2">
                        <Checkbox
                            {...props}
                            bind:checked={$formData.emailNotifications[option.id]}
                            value={option.id}
                            />
                        <Form.Label class="font-normal">
                            {option.label}
                        </Form.Label>
                    </div>
                {/snippet}
            </Form.Control>
        {/each}
    </Form.Fieldset>
    <Form.Button>
        Save Changes
    </Form.Button>
</form>