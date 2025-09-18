<script>
    import ProfileInfo from "$lib/components/profile-page/self-tabs/Info.svelte";

    let { data } = $props()

    const profileInfoAction = "/profile/info?/info";
</script>


<ProfileInfo infoActionName="?/info" {data}/>


