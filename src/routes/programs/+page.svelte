<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import ProgramsViewAll from "$lib/components/programs-page/ProgramsVIewAll.svelte";

    let { data } = $props();
    
    const urlparams = page.url.searchParams

    const getMoreResults = async (next) => {
        const response = await fetch(`/programs/getNext?cursor=${next}&${urlparams.toString()}`);
        if (!response.ok) {
            console.log('error fetching more programs')
            return
        } else {
            return await response.json()
        }
    }

    let { next, results, search, sort } = $derived(data)

    let sortBy = $state(sort ?? 'rating');
    let searchQuery = $state(search ?? '');
    
    $effect(() => {
        if (sortBy) urlparams.set('sort_by', sortBy)
        if (searchQuery) urlparams.set('q', searchQuery)

        goto(`?${urlparams.toString()}`, {keepFocus: true})
    })

    console.log(data)
</script>

<div class="bg-muted">
    <div class="max-w-[95rem] py-8 w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 justify-self-center">
        <ProgramsViewAll bind:sortBy bind:searchQuery {next} {getMoreResults} {results} />
    </div>
</div>


