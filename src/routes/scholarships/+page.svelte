<script>
    import ScholarshipsView from '$lib/components/scholarships-page/Scholarships.svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
</script>

<div class="page-shell mx-auto w-full px-6 py-8 sm:px-10 md:px-16">
    <ScholarshipsView scholarshipItems={data.scholarshipItems} />
</div>
