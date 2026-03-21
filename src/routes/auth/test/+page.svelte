<script>
    import { getTokenState, setTokenState } from '$lib/stores/jwt.svelte.js';
    import { onMount } from 'svelte';


    let { data } = $props()

    const tokenState = getTokenState();

    onMount(async () => {
        // await tokenState.refreshAccessToken()
    })

</script>


<p class="text-wrap m-10 max-w-10">{tokenState.token}</p>