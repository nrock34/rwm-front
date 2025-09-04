<script>
    import ProgramDetailView from "$lib/components/programs-page/single-program-view/ProgramDetailView.svelte";

    let { data } = $props()
</script>

<div class="w-full justify-self-center">
    <ProgramDetailView data={data.programData} />
</div>
