<script>

    import * as Card from "$lib/components/ui/card";
    import { Search } from "lucide-svelte";
    import { Input } from "$lib/components/ui/input";
    import * as Select from "$lib/components/ui/select";

    const sortOptions = [
        { id: 'date', name: 'Latest First' },
        { id: 'relevance', name: 'Most Relevant' },
        { id: 'popularity', name: 'Most Popular' }
    ];


    let { selectedSort = $bindable(), filters = $bindable(),
         searchQuery = $bindable(), paginatedScholarships, filteredScholarships, categories, countries} = $props();
    
    let selectedCountry = $state(filters.country);


    const selectedSortContent = $derived(
        sortOptions.find((sort) => sort.id === selectedSort)?.name
    )

    const selectedCategoryContent = $derived(
        categories.find((category) => category.id === filters.category)?.name
    )

    const selectedCountryContent = $derived(
        countries.find((country) => country.id === selectedCountry)?.name
    )

    

    $effect(() => {
        filters.country = selectedCountry
        console.log(selectedCountry)
        console.log(paginatedScholarships)
    })



</script>



<Card.Root class="p-8 gap-1">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
        <div class="flex-1 relative">
            <!-- search -->
            <p class="block text-sm">Search</p>
            <div class="relative">
                <div class="absolute inset-y-0 left-3 flex items-center">
                    <Search class='w-5 h-5 text-muted-foreground'/>
                </div>
                <Input
                    type="text"
                    placeholder="Search scholarships..." 
                    class="h-10 pl-10"
                    value={searchQuery}
                    oninput={(e) => {searchQuery = e.target.value}}
                />
            </div>
        </div>
            <!-- category filter -->
        <div class="flex-1 relative">
            <p class="block text-sm font-medium">Category</p>
            <Select.Root
                type="single"
                bind:value={filters.category}
                >
                <Select.Trigger class="w-full">
                    {selectedCategoryContent}
                </Select.Trigger>
                <Select.Content>
                    {#each categories as category}
                        <Select.Item value={category.id} label={category.name}/>
                    {/each}
                </Select.Content>
            </Select.Root>  
        </div>

        <!-- country -->
        <div>
            <p class="block text-sm font-medium">Country</p>
            <Select.Root
                type="single"
                bind:value={selectedCountry}
            >
                <Select.Trigger class="w-full">
                    {selectedCountryContent}
                </Select.Trigger>
                <Select.Content>
                    {#each countries as country}
                        <Select.Item value={country.id} label={country.name}/>
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>


        <!-- sort -->

        <div>
            <p class="block text-sm font-medium">Sort By</p>
            <Select.Root
                type="single"
                bind:value={selectedSort}
            >
                <Select.Trigger class="w-full">
                    {selectedSortContent}
                </Select.Trigger>
                <Select.Content>
                    {#each sortOptions as sort}
                        <Select.Item value={sort.id} label={sort.name}/>
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>
    </div>

    <div>
        <p class="prose-sm prose">
            Showing {paginatedScholarships?.length || 0} of {filteredScholarships?.length || 0} articles
        </p>
    </div>
</Card.Root>