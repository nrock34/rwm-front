<script>
    import { Item } from "../ui/breadcrumb";

    import FilterSearch from "./FilterSearch.svelte";
    import NewsPagination from "./ScholarshipPagination.svelte";
    import NewsGrid from "./ScholarshipsView.svelte";
    import Page from "../../../routes/+page.svelte";
    import ScholarshipsView from "./ScholarshipsView.svelte";
    import ScholarshipPagination from "./ScholarshipPagination.svelte";

    let selectedSort = $state('date');
    let searchQuery = $state('');
    let currentPage = $state(1);

    let { scholarshipItems = [] } = $props();

    let filters = $state({
        category: 'all',
        country: 'all',
        amount: 'all',
        deadline: 'all',
        educationLevel: 'all',
        field: 'all'
    });

    const categories = [
        { id: 'all', name: 'All Categories' },
        { id: 'merit', name: 'Merit-Based' },
        { id: 'need', name: 'Need-Based' },
        { id: 'research', name: 'Cultural Programs' },
        { id: 'cultural', name: 'Safety & Security' },
        { id: 'athletic', name: 'Scholarships' },
    ];

    const countries = [
        { id: 'all', name: 'All Countries' },
        { id: 'italy', name: 'Italy' },
        { id: 'usa', name: 'United States' },
        { id: 'uk', name: 'United Kingdom' },
        { id: 'germany', name: 'Germany' },
        { id: 'france', name: 'France' },
        { id: 'worldwide', name: 'Worldwide' }
    ];

    const regions = [
        { id: 'all', name: 'All' },
        { id: 'americas', name: 'Americas' },
        { id: 'europe', name: 'Europe' },
        { id: 'asia', name: 'Asia' },
        { id: 'africa', name: 'Africa' },
        { id: 'australia', name: 'Australia' },
        { id: 'worldwide', name: 'Worldwide' }
    ];

    const amountRanges = [
        { id: 'all', name: 'Any Amount' },
        { id: 'under-5k', name: 'Under $5,000' },
        { id: '5k-15k', name: '$5,000 - $15,000' },
        { id: '15k-30k', name: '$15,000 - $30,000' },
        { id: 'over-30k', name: 'Over $30,000' }
    ];

    let filteredScholarships = $state();
    let paginatedScholarships = $state([]);
    let itemsPerPage = 3;

    let userSavedScholarships = $state(
        new Set()
    );
</script>

<div class="flex flex-col w-full gap-1">
    <div class="mb-8">
        <h1 class="text-4xl font-bold">
            scholarships
        </h1>
        <p class="text-secondary-foreground">
            discover funding opportunities to kickstart your study abroad journey
        </p>
    </div>

    <FilterSearch
        bind:filters={filters}
        bind:selectedSort={selectedSort}
        bind:searchQuery={searchQuery}
        bind:paginatedScholarships
        {filteredScholarships}
        {categories}
        {countries}
    />

    <div class="mt-12">
        <ScholarshipsView
            {categories}
            bind:userSavedScholarships
            bind:paginatedScholarships
        />
    </div>

    <div class="mt-12">
        <ScholarshipPagination
            bind:searchQuery
            bind:currentPage
            bind:filteredScholarships
            bind:paginatedScholarships
            bind:selectedSort
            bind:filters
            {scholarshipItems}
            {itemsPerPage}
            passedClass="mt-4"
        />
    </div>
</div>
