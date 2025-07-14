<script>
    import { Item } from "../ui/breadcrumb";


    import FilterSearch from "./FilterSearch.svelte";
    import NewsPagination from "./NewsPagination.svelte";
    import NewsGrid from "./NewsGrid.svelte"

    let selectedCategory = $state('all');
    let selectedSort = $state('date');
    let searchQuery = $state('');
    let currentPage = $state(1);

    const newsItems = [
        {
        id: 1,
        title: "New Housing Options Available for Spring 2024",
        excerpt: "We've partnered with additional housing providers in Trastevere and Testaccio neighborhoods to offer more accommodation choices for students.",
        content: "Full article content here...",
        category: "housing",
        date: "2024-01-15T10:30:00Z",
        image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
        urgent: false,
        views: 1247,
        comments: 23,
        shares: 15
        },
        {
        id: 2,
        title: "Visa Processing Updates - Action Required",
        excerpt: "New documentation requirements effective immediately. All students must submit additional forms by January 25th to avoid processing delays.",
        content: "Full article content here...",
        category: "visa",
        date: "2024-01-12T14:15:00Z",
        image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
        urgent: true,
        views: 2156,
        comments: 45,
        shares: 67
        },
        {
        id: 3,
        title: "Cultural Immersion Workshop Series Begins",
        excerpt: "Monthly workshops designed to help students understand Italian culture, customs, and social etiquette. Registration is now open.",
        content: "Full article content here...",
        category: "cultural",
        date: "2024-01-10T09:00:00Z",
        image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
        urgent: false,
        views: 892,
        comments: 18,
        shares: 12
        },
        {
        id: 4,
        title: "Emergency Contact System Update",
        excerpt: "New 24/7 emergency hotline is now active. All students must update their emergency contacts by January 20th.",
        content: "Full article content here...",
        category: "safety",
        date: "2024-01-08T16:45:00Z",
        image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
        urgent: true,
        views: 1834,
        comments: 31,
        shares: 28
        },
        {
        id: 5,
        title: "New Scholarship Opportunities for 2024",
        excerpt: "Several new scholarship programs have been announced for the upcoming academic year, including merit-based and need-based options.",
        content: "Full article content here...",
        category: "scholarship",
        date: "2024-01-05T11:20:00Z",
        image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
        urgent: false,
        views: 1567,
        comments: 42,
        shares: 89
        },
        {
        id: 6,
        title: "Academic Calendar Updates",
        excerpt: "Important changes to the academic calendar including new exam dates and holiday schedules for the spring semester.",
        content: "Full article content here...",
        category: "academic",
        date: "2024-01-03T08:15:00Z",
        image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
        urgent: false,
        views: 1123,
        comments: 19,
        shares: 8
        }
    ];


    const categories = [
        { id: 'all', name: 'All Categories' },
        { id: 'visa', name: 'Visa & Immigration' },
        { id: 'housing', name: 'Housing' },
        { id: 'cultural', name: 'Cultural Programs' },
        { id: 'safety', name: 'Safety & Security' },
        { id: 'scholarship', name: 'Scholarships' },
        { id: 'academic', name: 'Academic' }
    ];
    
    let filteredNews = $state();
    let paginatedNews = $state('hello');
    let itemsPerPage = 3

</script>


<div class="flex flex-col mx-auto max-w-6xl gap-1 p-8 pb-2">
    
    <div class="mb-8">
        <h1 class="text-3xl font-bold">
            news & updates
        </h1>
        <p>
            get informed with latest information
        </p>
    </div>

    <FilterSearch
        bind:selectedCategory={selectedCategory}
        bind:selectedSort={selectedSort}
        bind:searchQuery={searchQuery}
        bind:currentPage
        bind:paginatedNews
        {filteredNews}
        {categories}
        />
    
    <div class="mt-12">
        <NewsGrid
            {categories}
            bind:paginatedNews 
            />
    </div>
    
    <div class="mt-12">
        <NewsPagination
            bind:searchQuery
            bind:currentPage
            bind:filteredNews
            bind:paginatedNews={paginatedNews}
            bind:selectedSort
            bind:selectedCategory
            {newsItems}
            {itemsPerPage}
            passedClass="mt-4"
            />
    </div>
    
    

</div>