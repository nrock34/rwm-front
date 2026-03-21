<script>
    import * as Card from "$lib/components/ui/card";

    import EditProfileSettingsForm from '$lib/components/forms/EditProfileSettings/form.svelte'
    import EditPasswordForm from '$lib/components/forms/EditProfileSettings/password-form.svelte'
    import { Button } from "$lib/components/ui/button";

    let { data } = $props();

    
</script>


<div class="space-y-6">
    <Card.Root class="gap-1 p-10">
        <h3 class="text-xl font-semibold text-foreground mb-4">Account Information</h3>
        <div class="space-y-4">
            <div>
                <EditProfileSettingsForm actionName="accountInfo" { data } />
            </div>
        </div>
    </Card.Root>

    <Card.Root class="p-8 px-10 gap-2">
        <h3 class="text-lg font-semibold text-foreground mb-3">Account Security</h3>
        <div class="space-y-5">
            <EditPasswordForm actionName="passwordChange" {data} />
            <Button disabled variant='destructive' class="w-fit">
                Delete Account
            </Button>
            <p class="text-xs text-muted-foreground">
                Account deletion is disabled until a documented API endpoint is available.
            </p>
        </div>
    </Card.Root>
</div>
