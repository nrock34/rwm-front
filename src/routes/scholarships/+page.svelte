<script>
    import ScholarshipsView from '$lib/components/scholarships-page/Scholarships.svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
</script>

<div class="max-w-[105rem] justify-self-center px-6 sm:px-10 md:px-16 py-8
            bg-gradient-to-tl from-accent/30 via-secondary/15 to-ring/5">
    <ScholarshipsView />
</div>