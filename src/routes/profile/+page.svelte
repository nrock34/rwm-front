<script>
    import ProfileSelf from "$lib/components/profile-page/ProfileSelf.svelte";

    let { data } = $props();


    console.log(data)
</script>



<div>
    <ProfileSelf { data } />
</div>