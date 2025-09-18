<script>
    import { goto } from '$app/navigation';
    import CommunityCs from '$lib/components/coming-soon/CommunityCS.svelte';
    import { onMount } from 'svelte';

    
    let { data } = $props()

</script>

<div>
    <CommunityCs />
</div>