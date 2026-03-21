<script>
    import ScholarshipView from '$lib/components/scholarship-single-page/ScholarshipView.svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
</script>

<div class="page-detail-shell mx-auto w-full px-8 py-8 sm:px-12 md:px-16 lg:px-20 lg:py-10">
    <ScholarshipView scholarship={data.scholarship} similarScholarships={data.similarScholarships} />
</div>
