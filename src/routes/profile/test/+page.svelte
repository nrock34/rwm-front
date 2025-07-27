<script>

    let { data } = $props()

    import EditProfileSettingsForm from '$lib/components/forms/EditProfileSettings/form.svelte'

</script>

<div class="p-12 text-center">
    <EditProfileSettingsForm {data}/>
</div>
