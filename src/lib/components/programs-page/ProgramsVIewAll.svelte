
<script>

    import { SvelteSet } from "svelte/reactivity";
    import * as Card from "../ui/card/card.svelte";
    import { Grid, List, Map, Search } from "lucide-svelte";
    import Input from "../ui/input/input.svelte";
    import * as Select from "../ui/select";
    import SelectLabel from "../ui/select/select-label.svelte";
    import SelectItem from "../ui/select/select-item.svelte";
    import Button from "../ui/button/button.svelte";
    import ToggleGroup from "../ui/toggle-group/toggle-group.svelte";
    import Toggle from "../ui/toggle/toggle.svelte";
    import ToggleGroupItem from "../ui/toggle-group/toggle-group-item.svelte";
    import { programs } from "./test";
    import GridView from "./views-types/GridView.svelte";
    import ListView from "./views-types/ListView.svelte";
    import MapView from "./views-types/MapView.svelte";

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
        }

    }))


</script>


<div class="max-w-7xl mx-auto px-4 sm:px-6 lg-px-8 py-8">

    <!-- header -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">Study Abroad Programs</h1>
        <p class="text-muted-foreground">Discover study abroad opportunities that fit your preferences</p>
    </div>

    <!-- filters -->
    <Card.Root>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
                <label class="block text-sm font-medium text-foregorund mb-2">
                    Search
                </label>
                <div class="relative">
                    <Search class="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input 
                        type='text'
                        placeholder='Search for programs...'
                        value={searchQuery}
                        oninput={(e) => searchQuery = e.target.value}
                        class="pl-10 w-full">
                    </Input>
                </div>
            </div>

            <!--  country/region filter  -->
            <div>
                <!-- <label class="block text-sm font-medium text-foreground mb-2">Region</label> -->
                <Select.Root class="w-full" bind:value={filters.country}>
                    <Select.Label class="text-sm font-medium text-foreground mb-2">
                        Region
                    </Select.Label>
                    <Select.Content>
                        {selectedRegionContent}
                    </Select.Content>
                    {#each countries as country}
                        <Select.Item key={country.id} value={country.id}>
                            {country.name}
                        </Select.Item>
                    {/each}
                </Select.Root>
            </div>


            <div>
                <Select.Root class="w-full" bind:value={filters.duration}>
                    <Select.Label class="text-sm font-medium text-foreground mb-2">
                        Duration
                    </Select.Label>
                    <Select.Content>
                        {selectedDurationContent}
                    </Select.Content>
                    {#each durations as duration}
                        <Select.Item value={duration.id} key={duration.id}>
                            {duration.name}
                        </Select.Item>
                    {/each}
                </Select.Root>
            </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                    <Select.Root>
                        <Select.Label class="text-sm font-medium text-foreground">
                            Sort By:
                        </Select.Label>
                        <Select.Content>
                        </Select.Content>
                        <Select.Item value={'rating'}>
                            Rating
                        </Select.Item>
                        <Select.Item value={'cost'}>
                            Cost
                        </Select.Item>
                        <Select.Item value={'participants'}>
                            Popularity
                        </Select.Item>
                        <Select.Item value={'alphabetical'}>
                            A-Z
                        </Select.Item>
                    </Select.Root>
                </div>

                <div class="text-sm text-muted-foreground">
                    {sortedPrograms.length} programs found
                </div>
            </div>

            <!-- view select -->
            <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-foreground">View:</span>
                <div class="flex rounded border border-border">
                    <ToggleGroup type="single" bind:value={viewMode}>
                        <ToggleGroup.Item
                            class={`${viewMode === 'grid' ? 
                            'bg-primary text-primary-foreground' : 
                            'bg-backround text-foreground hover:bg-muted-foreground'}`}
                            value="grid"
                        >
                            <Grid class="h-4 w-4"/>
                        </ToggleGroup.Item>
                        <ToggleGroup.Item
                            class={`${viewMode === 'list' ? 
                            'bg-primary text-primary-foreground' : 
                            'bg-backround text-foreground hover:bg-muted-foreground'}`}
                            value="list"
                        >
                            <List class="h-4 w-4"/>
                        </ToggleGroup.Item>
                        <ToggleGroup.Item class={`${viewMode === 'map' ? 
                            'bg-primary text-primary-foreground' : 
                            'bg-backround text-foreground hover:bg-muted-foreground'}`} 
                            value="map"
                        >
                            <Map class="h-4 w-4"/>
                        </ToggleGroup.Item>
                    </ToggleGroup>
                </div>
            </div>
        </div>
    </Card.Root>

    <!-- compare -->
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
            bind:savedPrograms 
            bind:compareList />
    {:else if viewMode === 'list'}
        <ListView 
            bind:savedPrograms 
            bind:compareList />
    {:else if viewMode === 'map'}
        <MapView />
    {/if}


</div>