<script>
    import Dashboard from "$lib/components/profile-page/self-tabs/Dashboard.svelte";

    let { data } = $props();
    let { applicationsData, activityData } = data;


 </script>


<p></p>
<Dashboard {applicationsData} {activityData}/>