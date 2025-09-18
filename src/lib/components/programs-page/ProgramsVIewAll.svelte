
<script>

    import { SvelteSet } from "svelte/reactivity";
    import * as Card from "../ui/card";
    import { Globe, Grid, List, Map, Search } from "lucide-svelte";
    import {Input} from "../ui/input";
    import * as Select from "../ui/select";
    import Button from "../ui/button/button.svelte";
    import * as ToggleGroup from "../ui/toggle-group";
    import {Toggle} from "../ui/toggle";
    import { programs } from "./test";
    import GridView from "./views-types/GridView.svelte";
    import ListView from "./views-types/ListView.svelte";
    import MapView from "./views-types/MapView.svelte";
    import { capitalize } from "$lib/helper-funcs/funcs";
    import { onMount } from "svelte";

    import Spinner from '$lib/assets/load-spinner.svg'
    
    let { results, next, getMoreResults, programCountries, durations,
        sortBy = $bindable(), searchQuery = $bindable(), region = $bindable(), duration = $bindable()
     } = $props();

    const countries = [
        { id: 'all', name: 'All Countries' },
        ...programCountries
    ];


    let savedPrograms = new SvelteSet();
    let compareList = new SvelteSet();

    let resultsLoading = $state(false)

    let filters = $state(
        {
            country: 'all',
            duration: 'all',
            cost: 'all',
            field: 'all',
            language: 'all'
        }
    )
    let viewMode = $state('grid');
    //let sortBy = $state('rating');
    // let searchQuery = $state('');

    let selectedRegionContent = $derived(countries.find((country) => country.id === region || country.name === region)?.name || 'uh oh')
    let selectedDurationContent = $derived(durations.find((d) => d.id === duration)?.name || 'uh oh')
    let sortByTriggerContent = $derived(capitalize(sortBy))

    onMount(() => {
        const intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && next) {
                console.log("Element is in view:", entry.target);

                console.log(next)
                resultsLoading = true
                

                setTimeout(() => {
                    getMoreResults(next).then(
                        (data) => {
                            next = data.next
                            results = [...results, ...data.results]
                        }
                    )
                    resultsLoading = false
                }
                , 2000)
                }
            });
        }, {
            threshold: 0.1
        })

        const items = document.querySelectorAll('#bottomOfResults')
        items.forEach(item => intersectionObserver.observe(item))
        
    })
</script>


<div class="w-full">

    <!-- header -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">Study Abroad Programs</h1>
        <p class="text-muted-foreground">Discover study abroad opportunities that fit your preferences</p>
    </div>

    <!-- filters -->
    <Card.Root class="p-6 gap-1 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div class="mt-2">
                <label class="block text-sm font-medium text-foregorund mb-1.25">
                    Search
                </label>
                <div class="relative">
                    <Search class="absolute left-3 top-3/10 h-4 w-4 text-muted-foreground"/>
                    <Input 
                        type='text'
                        placeholder='Search for programs...'
                        value={searchQuery}
                        oninput={(e) => searchQuery = e.target.value}
                        class="pl-10 h-12 w-full">
                    </Input>
                </div>
            </div>

            <!--  country/region filter  -->
            <div>
                <!-- <label class="block text-sm font-medium text-foreground mb-2">Region</label> -->
                <Select.Root type='single' bind:value={region}>
                    <Select.Label class="text-sm font-medium text-foreground">
                        Region
                    </Select.Label>
                    <Select.Trigger class="min-h-12 w-full">
                        {selectedRegionContent}
                    </Select.Trigger>
                    <Select.Content class="!max-h-70 px-1.5 py-1 gap-y-2">
                        {#each countries as country, idx}
                            <Select.Item class="flex justify-between" label={country.name} value={country.id === 'all' ? country.id : country.name}>
                                <span>{country.name}</span>
                                <span class="text-xs pr-2 font-light text-secondary-foreground">{country?.count}</span>
                            </Select.Item>
                        {/each}
                    </Select.Content>
                    
                </Select.Root>
            </div>

            <!-- duration filter -->
            <div>
                <Select.Root class="w-full" type='single' bind:value={duration}>
                    <Select.Label class="text-sm font-medium text-foreground">
                        Duration
                    </Select.Label>
                    <Select.Trigger class="min-h-12 w-full">
                        {selectedDurationContent}
                    </Select.Trigger>
                    <Select.Content>
                        {#each durations as duration, idx}
                            <Select.Item value={duration.id} label={duration.name}>
                                {duration.name}
                            </Select.Item>
                        {/each}
                    </Select.Content>
                    
                </Select.Root>
            </div>
        </div>


        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <!-- sort by -->
            <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                    <Select.Root type="single" bind:value={sortBy}>
                        <Select.Label class="text-sm font-medium text-foreground">
                            Sort By:
                        </Select.Label>
                        <Select.Trigger>
                            {sortByTriggerContent}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item label={"Rating"} value={'rating'}/>
                            <Select.Item label={"Cost"} value={'cost'}/>
                            <Select.Item label={"Participants"} value={'participants'}/>
                            <Select.Item label={"A-z"} value={'alphabetical'}/>
                        </Select.Content>
                        
                    </Select.Root>
                </div>

                <div class="text-sm text-muted-foreground">
                    {results?.length ?? 0} programs found
                </div>
            </div>

            <!-- view select -->
            <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-foreground">View:</span>
                <div class="flex">
                    <ToggleGroup.Root variant="outline" type="single" bind:value={viewMode}>
                        <ToggleGroup.Item
                            class={`${viewMode === 'grid' ? 
                            'bg-primary text-primary-foreground' : 
                            'bg-backround text-foreground hover:bg-muted-foreground/30'}`}
                            value="grid"
                        >
                            <Grid class="h-4 w-4"/>
                        </ToggleGroup.Item>
                        <ToggleGroup.Item
                            class={`${viewMode === 'list' ? 
                            'bg-primary text-primary-foreground' : 
                            'bg-backround text-foreground hover:bg-muted-foreground/30'}`}
                            value="list"
                        >
                            <List class="h-4 w-4"/>
                        </ToggleGroup.Item>
                        <ToggleGroup.Item class={`${viewMode === 'map' ? 
                            'bg-primary text-primary-foreground' : 
                            'bg-backround text-foreground hover:bg-muted-foreground/30'}`} 
                            value="map"
                        >
                            <Map class="h-4 w-4"/>
                        </ToggleGroup.Item>
                    </ToggleGroup.Root>
                </div>
            </div>
        </div>
    </Card.Root>

    <!-- compare bar -->
    {#if compareList.length > 0}
        <Card.Root class="p-4 mb-6 bg-primary/5 border-primary/20">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <span class="font-medium text-foreground">
                        Comparing {compareList.length} programs
                    </span>
                    <div class="flex space-x-2">
                        {#each compareList as id}
                            {@const program = programs.find(p => p.id === id)}
                            <span class="text-xs">
                                {program?.title}
                            </span>
                        {/each}
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <Button disabled class="text-sm">
                        Compare Programs
                    </Button>
                    <Button
                        onclick={() => compareList.clear()}
                        class="text-sm"
                        variant="secondary"
                    >
                        Clear All
                    </Button>
                </div>
            </div>
        </Card.Root>
    {/if}


    <!-- Display programs -->
    <div class="flex-1 min-w-0 w-full ">
        {#if viewMode === 'grid'}
            <GridView 
                bind:savedPrograms = {savedPrograms} 
                bind:compareList = {compareList}
                {durations}
                sortedPrograms={results}/>
        {:else if viewMode === 'list'}
            <ListView
                {durations}
                bind:savedPrograms = {savedPrograms} 
                bind:compareList = {compareList}
                sortedPrograms={results}/>
        {:else if viewMode === 'map'}
            <MapView />
        {/if}
    </div>

    {#if results?.length === 0}

        <div class="text-center py-12">
            <Globe class="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
            <h3 class="text-lg font-medium text-foreground mb-2">No Programs Found</h3>
            <p class="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
        
    {/if}

    <div class="py-10 mx-auto justify-self-center" id="bottomOfResults">
        {#if resultsLoading}
            <img src={Spinner} />
        {/if}
    </div>


</div>