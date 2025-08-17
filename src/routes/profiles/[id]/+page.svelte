<script>
    import ProfilePublic from "$lib/components/profile-page/ProfilePublic.svelte";

    let { data } = $props()
    let { profileData } = data
    console.log(data)

</script>


<div class="bg-muted/50">
    <ProfilePublic {profileData} />
</div>