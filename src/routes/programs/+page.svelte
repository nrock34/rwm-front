<script>
    import ProgramsVIewAll from "$lib/components/programs-page/ProgramsVIewAll.svelte";

    let { data } = $props();
    
    let { pageCount, pageNum = 1, results } = $derived(data)
</script>


<div class="max-w-[105rem] px-4 sm:px-6 md:px-10 lg:px-16 justify-self-center">
    <ProgramsVIewAll/>
</div>

