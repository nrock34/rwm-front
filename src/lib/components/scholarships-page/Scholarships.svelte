<script>
    import { Item } from "../ui/breadcrumb";


    import FilterSearch from "./FilterSearch.svelte";
    import NewsPagination from "./ScholarshipPagination.svelte";
    import NewsGrid from "./ScholarshipsView.svelte"
    import Page from "../../../routes/+page.svelte";
    import ScholarshipsView from "./ScholarshipsView.svelte";
    import ScholarshipPagination from "./ScholarshipPagination.svelte";

    let selectedSort = $state('date');
    let searchQuery = $state('');
    let currentPage = $state(1);

    let filters = $state({
        category: 'all',
        country: 'all',
        amount: 'all',
        deadline: 'all',
        educationLevel: 'all',
        field: 'all'
    })


    const scholarshipItems = [
        {
        id: 1,
        title: 'Fulbright Student Program',
        provider: 'U.S. Department of State',
        amount: '$25,000 - $50,000',
        deadline: '2024-03-15',
        category: 'cultural',
        country: 'italy',
        level: 'graduate',
        field: 'any',
        location: 'Italy',
        description: 'Funding for one academic year of study or research in Italy. Includes tuition, living expenses, and travel costs.',
        eligibility: ['U.S. citizenship', 'Bachelor\'s degree', 'Language proficiency', 'Research proposal'],
        status: 'open',
        featured: true,
        rating: 4.8,
        applicants: 1250,
        awarded: 45
        },
        {
        id: 2,
        title: 'Erasmus+ Scholarship',
        provider: 'European Commission',
        amount: '€300 - €600/month',
        deadline: '2024-04-01',
        category: 'cultural',
        country: 'italy',
        level: 'undergraduate',
        field: 'any',
        location: 'European Union',
        description: 'Support for students studying in EU countries with focus on cultural exchange and academic excellence.',
        eligibility: ['EU citizenship or enrolled in EU institution', 'Good academic standing', 'Language requirements'],
        status: 'open',
        featured: false,
        rating: 4.6,
        applicants: 890,
        awarded: 120
        },
        {
        id: 3,
        title: 'Benjamin A. Gilman Scholarship',
        provider: 'U.S. Department of State',
        amount: 'Up to $5,000',
        deadline: '2024-03-01',
        category: 'need',
        country: 'worldwide',
        level: 'undergraduate',
        field: 'any',
        location: 'Worldwide',
        description: 'Awards for U.S. undergraduate students with limited financial means to study abroad.',
        eligibility: ['Pell Grant recipient', 'U.S. citizenship', 'Undergraduate status', 'Financial need'],
        status: 'closing-soon',
        featured: true,
        rating: 4.7,
        applicants: 2100,
        awarded: 300
        },
        {
        id: 4,
        title: 'DAAD Study Scholarship',
        provider: 'German Academic Exchange Service',
        amount: '€850/month',
        deadline: '2024-05-15',
        category: 'merit',
        country: 'germany',
        level: 'graduate',
        field: 'engineering',
        location: 'Germany',
        description: 'Scholarships for highly qualified graduates to pursue master\'s or doctoral studies in Germany.',
        eligibility: ['Bachelor\'s degree', 'Academic excellence', 'German language skills', 'Research proposal'],
        status: 'open',
        featured: false,
        rating: 4.9,
        applicants: 750,
        awarded: 80
        }
    ];


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
    ]

    const regions = [
        { id: 'all', name: 'All' },
        { id: 'americas', name: 'Americas' },
        { id: 'europe', name: 'Europe' },
        { id: 'asia', name: 'Asia' },
        { id: 'africa', name: 'Africa' },
        { id: 'australia', name: 'Australia' },
        { id: 'worldwide', name: 'Worldwide' }
    ]
    
    const amountRanges = [
        { id: 'all', name: 'Any Amount' },
        { id: 'under-5k', name: 'Under $5,000' },
        { id: '5k-15k', name: '$5,000 - $15,000' },
        { id: '15k-30k', name: '$15,000 - $30,000' },
        { id: 'over-30k', name: 'Over $30,000' }
    ]

    let filteredScholarships = $state();
    let paginatedScholarships = $state([]);
    let itemsPerPage = 3

    let userSavedScholarships = $state(
        new Set()
    )

</script>


<div class="flex flex-col mx-auto max-w-7xl gap-1 p-8 pb-2 bg-accent/50">
    
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
        bind:currentPage
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