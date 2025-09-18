<script>
    import { goto } from '$app/navigation';
    import ScholarshipView from '$lib/components/scholarship-single-page/ScholarshipView.svelte';
    import { onMount } from 'svelte';

    let { data } = $props();

    onMount(() => {
        goto('/scholarships')
    })
</script>

<div class="max-w-[105rem] px-6 sm:px-10 md:px-14 lg:px-18 xl:px-24 justify-self-center">
    <ScholarshipView/>
</div>
