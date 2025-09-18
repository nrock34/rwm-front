<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import ProgramsViewAll from "$lib/components/programs-page/ProgramsVIewAll.svelte";

    let { data } = $props();

    let { programCountries } = data
    
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
    let region = $state(programCountries.find(
        (country) => {
            return country.name === urlparams.get('country')
        }
    )?.name ?? 'all')

    const durations = [
        {id: 'all', name: 'Any Duration' },
        {id: 'sem', name: 'Semester Program'},
        {id: 'yr', name: 'Full Academic Year Program'},
        {id: 'sum', name:'Summer Program'},
        {id: 'brk', name: 'Winter/Spring Break Program'},
        {id: 'twowks', name: 'Weeklong Program - (1-2 Weeks) '},
        {id: 'sxwks', name: 'Short-Term Program - (4-6 Weeks)'},
    ];

    let duration = $state(durations.find((d) => {
        return d.id === urlparams.get('duration')
    })?.id ?? 'all')

    $inspect(results)
    
    $effect(() => {
        if (sortBy) urlparams.set('sort_by', sortBy)
        if (searchQuery) urlparams.set('q', searchQuery)
        if (!searchQuery) urlparams.delete('q')
        if (region !== 'all') urlparams.set('country', region)
        if (region === 'all') urlparams.delete('country')
        if (duration !== 'all') urlparams.set('duration', duration)
        if (duration === 'all') urlparams.delete('duration')

        goto(`?${urlparams.toString()}`, {keepFocus: true, replaceState: false})

        console.log('after hydration ', results)
    })

    //console.log(data)

    
</script>

<div class="bg-muted">
    <div class="max-w-[95rem] pt-12 py-8 w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 justify-self-center">
        <ProgramsViewAll bind:duration bind:sortBy bind:searchQuery bind:region 
        {programCountries} {next} {getMoreResults} {results} {durations}/>
    </div>
</div>
