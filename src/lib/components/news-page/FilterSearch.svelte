<script>
    import * as Card from "$lib/components/ui/card";
    import OptionSelect from "$lib/components/shared/OptionSelect.svelte";
    import SearchInput from "$lib/components/shared/SearchInput.svelte";

    const sortOptions = [
        { id: "date", name: "Latest First" },
        { id: "relevance", name: "Most Relevant" },
        { id: "popularity", name: "Most Popular" }
    ];

    let {
        selectedSort = $bindable(),
        selectedCategory = $bindable(),
        searchQuery = $bindable(),
        paginatedNews,
        filteredNews,
        categories
    } = $props();
</script>

<Card.Root class="p-8 gap-1">
    <div class="flex flex-col lg:flex-row gap-4 mb-6 items-center">
        <SearchInput
            containerClass="flex-1 relative"
            placeholder="Search news & updates..."
            bind:value={searchQuery}
        />
        <OptionSelect bind:value={selectedCategory} options={categories} />
        <OptionSelect bind:value={selectedSort} options={sortOptions} />
    </div>

    <div>
        <p>
            Showing {paginatedNews?.length || "N/A"} of {filteredNews?.length || "N/A"} articles
        </p>
    </div>
</Card.Root>
