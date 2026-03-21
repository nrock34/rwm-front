<script>

    let { data } = $props()

    import EditProfileEducationForm from '$lib/components/forms/EditProfileEducation/form.svelte'
    import EditProfileSettingsForm from '$lib/components/forms/EditProfileSettings/form.svelte'
    import EditProfileInfoForm from '$lib/components/forms/EditProfileInfo/form.svelte'
    import UniversitySelect from '$lib/components/forms/utils/UniversitySelect.svelte';

</script>

<div class="p-12 space-y-12 text-center">
    <EditProfileEducationForm { data }/>
    <UniversitySelect />
    <EditProfileInfoForm {data} />
    <EditProfileSettingsForm {data}/>
</div>
