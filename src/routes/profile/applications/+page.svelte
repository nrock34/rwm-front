<script>
    import ApplicationTracker from "$lib/components/profile-page/self-tabs/ApplicationTracker.svelte";

    let { data } = $props()
    let { applicationsData } = data
</script>


<ApplicationTracker {applicationsData} />