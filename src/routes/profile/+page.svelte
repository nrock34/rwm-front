<script>
    import { goto } from "$app/navigation";
    import ProfileSelf from "$lib/components/profile-page/ProfileSelf.svelte";
    import { getTokenState } from "$lib/stores/jwt.svelte.js";
    import { onMount } from "svelte";

    let { data } = $props();

    onMount(() => {
        const tokenState = getTokenState()
        console.log(tokenState.isExpired)
        if (!tokenState.isExpired) {
            goto('profile/dashboard/')
        }
        tokenState.refreshAccessToken()
    })
</script>


<div>
    
</div>