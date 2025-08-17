<script>
    import Bookmarked from "$lib/components/profile-page/self-tabs/Bookmarked.svelte";

    let { data } = $props();
    let { savedItemData } = data; 

</script>


<Bookmarked {savedItemData} />