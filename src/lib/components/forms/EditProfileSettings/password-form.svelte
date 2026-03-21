<script>
    import * as Form from '$lib/components/ui/form';
    import { superForm } from 'sveltekit-superforms';
    import { yupClient } from 'sveltekit-superforms/adapters';
    import { passwordChangeSchema } from './schema';
    import { Input } from '$lib/components/ui/input';

    let { data, actionName = "passwordChange" } = $props();

    const form = superForm(data.changePasswordForm, {
        dataType: 'json',
        validators: yupClient(passwordChangeSchema)
    });

    const { form: formData, enhance, message } = form;
    const isComplete = $derived.by(() => {
        const currentPassword = typeof $formData.old_pwd === "string" ? $formData.old_pwd.trim() : "";
        const newPassword = typeof $formData.new_pwd1 === "string" ? $formData.new_pwd1.trim() : "";
        const confirmPassword = typeof $formData.new_pwd2 === "string" ? $formData.new_pwd2.trim() : "";

        return currentPassword.length > 0 &&
            newPassword.length > 0 &&
            confirmPassword.length > 0;
    });

    $effect(() => {
        if (typeof $formData.old_pwd !== "string") {
            $formData.old_pwd = "";
        }

        if (typeof $formData.new_pwd1 !== "string") {
            $formData.new_pwd1 = "";
        }

        if (typeof $formData.new_pwd2 !== "string") {
            $formData.new_pwd2 = "";
        }
    });
</script>

<form class="space-y-4" action={`?/${actionName}`} method="POST" use:enhance>
    <Form.Field {form} name="old_pwd">
        <Form.Control>
            {#snippet children({ props })}
                <div class="space-y-2">
                    <Form.Label>Current Password</Form.Label>
                    <Input
                        {...props}
                        type="password"
                        autocomplete="current-password"
                        bind:value={$formData.old_pwd}
                    />
                </div>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <div class="grid gap-4 sm:grid-cols-2">
        <Form.Field {form} name="new_pwd1">
            <Form.Control>
                {#snippet children({ props })}
                    <div class="space-y-2">
                        <Form.Label>New Password</Form.Label>
                        <Input
                            {...props}
                            type="password"
                            autocomplete="new-password"
                            bind:value={$formData.new_pwd1}
                        />
                    </div>
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="new_pwd2">
            <Form.Control>
                {#snippet children({ props })}
                    <div class="space-y-2">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Input
                            {...props}
                            type="password"
                            autocomplete="new-password"
                            bind:value={$formData.new_pwd2}
                        />
                    </div>
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    </div>

    {#if $message?.msg}
        <p class={`text-sm ${$message?.error ? "text-destructive" : "text-secondary-foreground"}`}>
            {$message.msg}
        </p>
    {/if}

    <Form.Button disabled={!isComplete}>
        Update Password
    </Form.Button>
</form>
