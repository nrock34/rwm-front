<script>
    import ScholarshipCs from '$lib/components/coming-soon/ScholarshipCS.svelte';
    import ScholarshipsView from '$lib/components/scholarships-page/Scholarships.svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
</script>

<ScholarshipCs />