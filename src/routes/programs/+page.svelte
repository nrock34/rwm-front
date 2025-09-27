<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import ProgramsViewAll from "$lib/components/programs-page/ProgramsVIewAll.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { getContext } from "svelte";

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

    const config = getContext('config')

    //console.log(data)

</script>

<div class="bg-muted">
    <div class="relative">
        <img class="object-cover sm:h-70 md:h-80 lg:h-100 w-full" src={config.programHeroIMG ?? 'https://images.pexels.com/photos/28838309/pexels-photo-28838309.jpeg'}/>
        <div class="absolute inset-x-0 top-0 backdrop-blur-[3px] w-full h-full"></div>
        <div class="absolute inset-x-0 top-0 bg-gradient-to-t from-white/70 to-white/50 w-full h-full opacity-80"></div>
        <div class="absolute top-0 flex flex-col items-center justify-between min-w-full my-auto h-full p-20">
            <div class="mx-auto text-center max-w-3xl">
                <h3 class="text-lg tracking-wider font-bold uppercase">Go Global</h3>
                <h1 class="text-5xl tracking-tight font-extrabold text-accent-foreground uppercase">Find Your Perfect Program</h1>
                <p class="tracking-wide leading-none">Compare programs across world-class universities and vibrant neighborhoods. Get a feel for academics, campus life, excursions, and term dates—then save and rank options that match your pace and priorities.</p>
            </div>
            <div class="flex w-full justify-center gap-x-12">
                <Button href="#programs" class="font-light tracking-wide" size="lg">Find Programs</Button>
                <Button size="lg" variant="ghost" class="font-light tracking-wide bg-accent">Need Help?</Button>
            </div>
        </div>
    </div>
    <div id="programs" class="max-w-[95rem] pt-12 py-8 w-full px-6 sm:px-8 md:px-12 lg:px-18 xl:px-24 justify-self-center">
        <ProgramsViewAll bind:duration bind:sortBy bind:searchQuery bind:region 
        {programCountries} {next} {getMoreResults} {results} {durations}/>
    </div>
</div>
