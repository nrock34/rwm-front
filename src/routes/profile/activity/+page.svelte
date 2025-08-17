<script>
    import Activity from "$lib/components/profile-page/self-tabs/Activity.svelte";

    let { data } = $props()
    let { activityData} = data

    console.log(data)
</script>


<Activity {activityData}/>