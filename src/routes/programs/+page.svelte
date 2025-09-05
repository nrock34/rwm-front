<script>
    import ProgramsViewAll from "$lib/components/programs-page/ProgramsVIewAll.svelte";

    let { data } = $props();
    
    const getMoreResults = async (next) => {
        const response = await fetch(`/programs/getNext?cursor=${next}`);
        if (!response.ok) {
            console.log('error fetching more programs')
            return
        } else {
            return await response.json()
        }
    }

    let { next, results } = $derived(data)

    console.log(data)
</script>


<div class="max-w-[105rem] px-4 sm:px-6 md:px-10 lg:px-16 justify-self-center">
    <ProgramsViewAll {next} {getMoreResults} {results} />
</div>

