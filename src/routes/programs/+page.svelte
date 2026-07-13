<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import ProgramsViewAll from "$lib/components/programs-page/ProgramsViewAll.svelte";
    import { Button } from "$lib/components/ui/button";
    import ResilientImage from "$lib/components/shared/ResilientImage.svelte";
    import { getContext } from "svelte";

    let { data } = $props();

    let { programCountries } = data
    
    const getMoreResults = async (next) => {
        const params = new URLSearchParams(page.url.searchParams);
        params.set('cursor', next);
        const response = await fetch(`/programs/getNext?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Unable to load more programs');
        }
        return await response.json()
    }

    let next = $derived(data.next)
    let results = $derived(data.results)
    let search = data.search
    let sort = data.sort

    let sortBy = $state(sort || 'rating');
    let searchQuery = $state(search ?? '');
    let region = $state(programCountries.find(
        (country) => {
            return country.name === page.url.searchParams.get('country')
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
        return d.id === page.url.searchParams.get('duration')
    })?.id ?? 'all')
    
    $effect(() => {
        const urlparams = new URLSearchParams(page.url.searchParams);
        if (sortBy) urlparams.set('sort_by', sortBy)
        if (searchQuery) urlparams.set('q', searchQuery)
        if (!searchQuery) urlparams.delete('q')
        if (region !== 'all') urlparams.set('country', region)
        if (region === 'all') urlparams.delete('country')
        if (duration !== 'all') urlparams.set('duration', duration)
        if (duration === 'all') urlparams.delete('duration')

        const nextQuery = urlparams.toString();
        if (nextQuery === page.url.searchParams.toString()) return;
        const timer = window.setTimeout(() => {
            void goto(`?${nextQuery}`, {keepFocus: true, noScroll: true, replaceState: true});
        }, 250);
        return () => window.clearTimeout(timer);
    })

    const config = getContext('config')


</script>

<svelte:head>
    <title>Browse Programs - RomeWithMe</title>
	<meta name="description" content="Compare study abroad programs by destination, duration, cost, and academic focus." />
</svelte:head>

<div class="bg-background">
    <div class="relative">
        <ResilientImage
            class="object-cover h-70 sm:h-80 md:h-90 lg:h-100 w-full"
            src={config?.programHeroIMG ?? 'https://images.pexels.com/photos/28838309/pexels-photo-28838309.jpeg'}
            fallbackSrc="https://images.pexels.com/photos/28838309/pexels-photo-28838309.jpeg"
            alt="Programs hero"
        />
        <div class="absolute inset-x-0 top-0 backdrop-blur-[3px] w-full h-full"></div>
        <div class="absolute inset-x-0 top-0 h-full w-full bg-gradient-to-t from-background/85 via-background/72 to-background/58"></div>
        <div class="absolute top-0 flex flex-col items-center justify-center min-w-full my-auto h-full gap-y-8 p-8 sm:p-14 lg:p-20">
            <div class="mx-auto text-center max-w-3xl">
                <h3 class="text-md md:text-lg tracking-wider font-bold uppercase">Go Global</h3>
                <h1 class="text-3xl md:text-5xl tracking-tight font-extrabold text-accent-foreground uppercase">Find Your Perfect Program</h1>
                <p class="text-xs sm:text-sm md:text-base tracking-wide leading-none">Compare programs across world-class universities and vibrant neighborhoods. Get a feel for academics, campus life, excursions, and term dates—then save and rank options that match your pace and priorities.</p>
            </div>
            <div class="flex w-full justify-center gap-x-12">
                <Button href="#programs" class="font-light tracking-wide" size="lg">Find Programs</Button>
                <Button href="#footer-contactinfo" size="lg" variant="ghost" class="font-light tracking-wide bg-accent">Need Help?</Button>
            </div>
        </div>
    </div>
    <div id="programs" class="scroll-mt-20 max-w-[95rem] pt-12 py-8 w-full px-6 sm:px-8 md:px-12 lg:px-18 xl:px-24 mx-auto">
        <ProgramsViewAll bind:duration bind:sortBy bind:searchQuery bind:region 
                        {programCountries} {next} {getMoreResults} {results} 
                        {durations}
        />
    </div>
</div>
