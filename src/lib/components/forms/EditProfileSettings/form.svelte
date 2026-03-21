<script>
    import * as Form from '$lib/components/ui/form';
    import { superForm } from 'sveltekit-superforms';
    import { yupClient } from 'sveltekit-superforms/adapters';
    import { profileSettingsSchema } from './schema';
    import { Input } from '$lib/components/ui/input';
    
    //form supervalidated
    let { data, actionName = "accountInfo" } = $props();
    
    let updated = $state(false);

    const form = superForm( data.editProfileSettingsForm, {
        dataType: 'json',
        validators: yupClient(profileSettingsSchema)
    })

    const { form: formData, enhance, message } = form;
                
    
</script>



<form class="space-y-6" action={`?/${actionName}`} method="POST" use:enhance>
    <div class="grid gap-4 sm:grid-cols-2">
        <Form.Field class="text-left" {form} name="first_name">
            <Form.Control>
                {#snippet children({ props })}
                    <div class="space-y-2">
                        <Form.Label>First Name</Form.Label>
                        <Input
                            {...props}
                            class="h-10"
                            bind:value={$formData.first_name}
                            oninput={() => {updated = true}}
                        />
                    </div>
                {/snippet}
            </Form.Control>
            <Form.FieldErrors/>
        </Form.Field>

        <Form.Field class="text-left" {form} name="last_name">
            <Form.Control>
                {#snippet children({ props })}
                    <div class="space-y-2">
                        <Form.Label>Last Name</Form.Label>
                        <Input
                            {...props}
                            class="h-10"
                            bind:value={$formData.last_name}
                            oninput={() => {updated = true}}
                        />
                    </div>
                {/snippet}
            </Form.Control>
            <Form.FieldErrors/>
        </Form.Field>
    </div>

    <Form.Field class="text-left" {form} name="email">
        <Form.Control>
            {#snippet children({ props })}
                <div class="space-y-2">
                    <Form.Label>Email</Form.Label>
                    <Input
                        {...props}
                        class="h-10"
                        type="email"
                        bind:value={$formData.email}
                        oninput={() => {updated = true}}
                    />
                </div>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors/>
    </Form.Field>

    <Form.Field class="text-left" {form} name="username">
        <Form.Control>
            {#snippet children({ props })}
                <div class="space-y-2">
                    <Form.Label>Username</Form.Label>
                    <Input
                        {...props}
                        class="h-10"
                        bind:value={$formData.username}
                        disabled
                    />
                </div>
            {/snippet}
        </Form.Control>
        <Form.Description>
            Username is read-only according to the current API contract.
        </Form.Description>
    </Form.Field>

    {#if $message?.msg}
        <p class={`text-sm ${$message?.error ? "text-destructive" : "text-secondary-foreground"}`}>
            {$message.msg}
        </p>
    {/if}

    <Form.Button disabled={!updated}>
        Save Changes
    </Form.Button>
</form>
