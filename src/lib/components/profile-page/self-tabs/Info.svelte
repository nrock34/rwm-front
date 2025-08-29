<script>
    import * as Card from "$lib/components/ui/card";

    import EditProfileEducationForm from '$lib/components/forms/EditProfileEducation/form.svelte';
    import EditProfileInfoForm from '$lib/components/forms/EditProfileInfo/form.svelte';

    
    let { data, infoActionName, eduActionName } = $props()

</script>

<div class="space-y-10">

    <Card.Root class="p-2 py-3">
        <div class="flex flex-col py-6 px-10 space-y-6">
            <div class="">
                <h3 class="text-xl sm:text-3xl font-bold text-nowrap">Profile Info</h3>
                <p class="leading-tight text-xs sm:text-sm font-light text-secondary-foreground">Edit your account's profile information</p>
            </div>
            <div class="">
                <EditProfileInfoForm actionName={infoActionName} {data}/>
            </div>
        </div>
    </Card.Root>

    <Card.Root class="p-2 py-3">
        <div class="flex items-center py-6 px-10 space-x-10 w-full">
            <div class="mb">
                <h3 class="text-xl sm:text-3xl font-bold text-wrap">Education Profile</h3>
                <p class="leading-tight text-xs sm:text-sm font-light text-secondary-foreground">Info about your current education</p>
            </div>
            <div class="pl-5 w-full">
                <EditProfileEducationForm actionName={eduActionName} {data}/>
            </div>
        </div>
    </Card.Root>

</div>