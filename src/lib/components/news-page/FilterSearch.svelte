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


    let { selectedSort = $bindable(), selectedCategory = $bindable(),
         searchQuery = $bindable(), paginatedNews, filteredNews, categories} = $props();
    

    const selectedSortContent = $derived(
        sortOptions.find((sort) => sort.id === selectedSort)?.name
    )

    const selectedCategoryContent = $derived(
        categories.find((category) => category.id === selectedCategory)?.name
    )

</script>



<Card.Root class="p-8 gap-1">
    <div class="flex flex-col lg:flex-row gap-4 mb-6 items-center">
        <div class="flex-1 relative">
            <!-- search -->
            <div class="absolute inset-y-0 left-3 flex items-center">
                <Search class='w-5 h-5 text-muted-foreground'/>
            </div>
            <Input
                type="text"
                placeholder="Search news & updates..." 
                class="h-10 pl-10"
                value={searchQuery}
                oninput={(e) => {searchQuery = e.target.value}}
            />
        </div>
            <!-- category filter -->
        <div class="">
            <Select.Root
                type="single"
                bind:value={selectedCategory}
                >
                <Select.Trigger>
                    {selectedCategoryContent}
                </Select.Trigger>
                <Select.Content>
                    {#each categories as category}
                        <Select.Item value={category.id} label={category.name}/>
                    {/each}
                </Select.Content>
            </Select.Root>  
        </div>


        <!-- sort -->

        <div>
            <Select.Root
                type="single"
                bind:value={selectedSort}
            >
                <Select.Trigger>
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
        <p>
            Showing {paginatedNews?.length || 'N/A'} of {filteredNews?.length || 'N/A'} articles
        </p>
    </div>
</Card.Root>