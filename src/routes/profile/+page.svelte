<script>
    import { goto } from "$app/navigation";
    import { getTokenState } from "$lib/stores/jwt.svelte.js";
    import { onMount } from "svelte";

    let { data } = $props();

    onMount(() => {
        const tokenState = getTokenState()
        if (!tokenState) return;
        if (!tokenState.isExpired) {
            goto('/profile/dashboard')
            return;
        }
        tokenState.refreshAccessToken()
    })
</script>


<div>
    
</div>
