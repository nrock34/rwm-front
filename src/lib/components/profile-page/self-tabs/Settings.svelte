<script>
    import * as Card from "$lib/components/ui/card";

    import EditProfileSettingsForm from '$lib/components/forms/EditProfileSettings/form.svelte'
    import { Button } from "$lib/components/ui/button";

    let { data } = $props();

    console.log( data )
</script>


<div class="space-y-6">
    <Card.Root class="gap-1 p-10">
        <h3 class="text-xl font-semibold text-foreground mb-4">Profile Settings</h3>
        <div class="space-y-4">
            <div>
                <EditProfileSettingsForm { data } />
            </div>
        </div>
    </Card.Root>

    <Card.Root class="p-8 px-10 gap-2">
        <h3 class="text-lg font-semibold text-foreground mb-3">Account Settings</h3>
        <div class="space-y-3 flex space-x-2.5">
            <Button variant='outline' class="bg-accent/30 border-ring/20">
                Change Email
            </Button>
            <Button variant='outline' class="bg-accent/30 border-ring/20">
                Change Password
            </Button>
            <Button variant='destructive'>
                Delete Account
            </Button>
        </div>
    </Card.Root>
</div>