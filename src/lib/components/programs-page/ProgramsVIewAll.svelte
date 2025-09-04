
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
    

    const countries = [
        { id: 'all', name: 'All Countries' },
        { id: 'italy', name: 'Italy' },
        { id: 'spain', name: 'Spain' },
        { id: 'france', name: 'France' },
        { id: 'germany', name: 'Germany' },
        { id: 'uk', name: 'United Kingdom' },
        { id: 'japan', name: 'Japan' },
        { id: 'australia', name: 'Australia' }
    ];

    const durations = [
        { id: 'all', name: 'Any Duration' },
        { id: 'summer', name: 'Summer (6-8 weeks)' },
        { id: 'semester', name: 'Semester (4-5 months)' },
        { id: 'year', name: 'Academic Year (9-10 months)' },
        { id: 'short', name: 'Short-term (2-4 weeks)' }
    ];

    let savedPrograms = new SvelteSet();
    let compareList = new SvelteSet();

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
    let sortBy = $state('rating');
    let searchQuery = $state('');

    let selectedRegionContent = $derived(countries.find((country) => country.id === filters.country)?.name || 'uh oh')
    let selectedDurationContent = $derived(durations.find((duration) => duration.id === filters.duration)?.name || 'uh oh')
    let sortByTriggerContent = $derived(capitalize(sortBy))

    const filteredPrograms = $derived(programs.filter(program => {
        const matchesCountry = filters.country === 'all' || program.country === filters.country;
        const matchesDuration = filters.duration === 'all' || program.duration === filters.duration;
        const matchesCost = filters.cost === 'all' || program.cost === filters.cost;
        const matchesField = filters.field === 'all' || program.field === filters.field;
        const matchesLang = filters.language === 'all' || program.language === filters.language;
        const matchesSearch = searchQuery === '' ||
            program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            program.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
            program.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            program.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCountry && matchesCost && matchesDuration && 
            matchesField && matchesLang && matchesSearch;
    }))

    const sortedPrograms = $derived([...filteredPrograms].sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return b.rating - a.rating
            case 'cost':
                return parseInt(a.cost.replace(/[^0-9]/g, '')) - parseInt(b.cost.replace(/[^0-9]/g, ''))
            case 'participants':
                return b.participants - a.participants
            case 'alphabetical':
                return a.title.localeCompare(b.title)
            default:
                return 0;
        }

    }))


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
                <Select.Root type='single' bind:value={filters.country}>
                    <Select.Label class="text-sm font-medium text-foreground">
                        Region
                    </Select.Label>
                    <Select.Trigger class="min-h-12 w-full">
                        {selectedRegionContent}
                    </Select.Trigger>
                    <Select.Content>
                        {#each countries as country, idx}
                            <Select.Item label={country.name} value={country.id}>
                                {country.name}
                            </Select.Item>
                        {/each}
                    </Select.Content>
                    
                </Select.Root>
            </div>

            <!-- duration filter -->
            <div>
                <Select.Root class="w-full" type='single' bind:value={filters.duration}>
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
                    {sortedPrograms.length} programs found
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
    {#if viewMode === 'grid'}
        <GridView 
            bind:savedPrograms = {savedPrograms} 
            bind:compareList = {compareList}
            {sortedPrograms}/>
    {:else if viewMode === 'list'}
        <ListView 
            bind:savedPrograms = {savedPrograms} 
            bind:compareList = {compareList}
            {sortedPrograms}/>
    {:else if viewMode === 'map'}
        <MapView />
    {/if}

    {#if sortedPrograms.length === 0}

        <div class="text-center py-12">
            <Globe class="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
            <h3 class="text-lg font-medium text-foreground mb-2">No Programs Found</h3>
            <p class="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
        
    {/if}


</div>