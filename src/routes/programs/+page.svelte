<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import ProgramsViewAll from "$lib/components/programs-page/ProgramsVIewAll.svelte";

    let { data } = $props();
    
    //console.log(data)
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

    let next = $derived(data.next)
    let results = $derived(data.results)
    let search = data.search
    let sort = data.sort

    let sortBy = $state(sort ?? 'rating');
    let searchQuery = $state(search ?? '');

    $inspect(results)
    
    $effect(() => {
        if (sortBy) urlparams.set('sort_by', sortBy)
        if (searchQuery) urlparams.set('q', searchQuery)

        goto(`?${urlparams.toString()}`, {keepFocus: true, replaceState: false})

        console.log('after hydration ', results)
    })

    //console.log(data)

    
</script>

<div class="bg-muted">
    <div class="max-w-[95rem] py-8 w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 justify-self-center">
        <ProgramsViewAll bind:sortBy bind:searchQuery {next} {getMoreResults} {results} />
    </div>
</div>
