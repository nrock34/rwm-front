<script>
    import Dashboard from "$lib/components/profile-page/self-tabs/Dashboard.svelte";

    let { data } = $props();
    let { applicationsData, activityData, savedItemData } = data;


 </script>


<p></p>
<Dashboard {applicationsData} {activityData} {savedItemData}/>
