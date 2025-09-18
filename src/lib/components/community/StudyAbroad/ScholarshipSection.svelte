<script>

    import {Button} from '$lib/components/ui/button';
    import {Badge} from '$lib/components/ui/badge';
    import * as Card from '$lib/components/ui/card'
    import { Calendar, Clock, DollarSign, ExternalLink, Globe, MapPin, Star, Users } from 'lucide-svelte';


    const categories = [
        { id: 'all', name: 'All' },
        { id: 'merit', name: 'Merit' },
        { id: 'need', name: 'Need' },
        { id: 'research', name: 'Research' },
        { id: 'cultural', name: 'Cultural' }
    ];

    const scholarships = [
        {
        id: 1,
        title: 'Fulbright Student scholarship',
        provider: 'U.S. Department of State',
        amount: '$25,000 - $50,000',
        deadline: '2024-03-15',
        category: 'cultural',
        location: 'Italy',
        description: 'Funding for one academic year of study or research in Italy.',
        qualifications: ['U.S. citizenship', 'Bachelor\'s degree', 'Language proficiency'],
        status: 'open',
        featured: true
        },
        {
        id: 2,
        title: 'Erasmus+ Scholarship',
        provider: 'European Commission',
        amount: '€300 - €600/month',
        deadline: '2024-04-01',
        category: 'cultural',
        location: 'European Union',
        description: 'Support for students studying in EU countries.',
        qualifications: ['EU citizenship or enrolled in EU institution', 'Good academic standing'],
        status: 'open',
        featured: false
        },
        {
        id: 3,
        title: 'Benjamin A. Gilman Scholarship',
        provider: 'U.S. Department of State',
        amount: 'Up to $5,000',
        deadline: '2024-03-01',
        category: 'need',
        location: 'Worldwide',
        description: 'Awards for U.S. undergraduate students with limited financial means.',
        qualifications: ['Pell Grant recipient', 'U.S. citizenship', 'Undergraduate status'],
        status: 'closing-soon',
        featured: true
        }
    ];


    const getStatusColor = (status) => {
        switch (status) {
        case 'open': return 'bg-green-100 text-green-700';
        case 'closing-soon': return 'bg-yellow-100 text-yellow-700';
        case 'closed': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
        }
    };

    let { limit=3, cardClass } = $props()

    let selectedCategory = $state('');

    const filteredScholarships = scholarships;

</script>

<Card.Root class={`h-fit ${cardClass} gap-2`}>
    <Card.Header class="flex items-center justify-between mb-0">
        <div class="flex items-center space-x-2">
            <Globe class="text-amber-400 w-5 h-5" />
            <h2 class="text-sm sm:text-lg font-bold text-foreground">
                Scholarships
            </h2>
        </div>
        <Button class="bg-transparent text-primary shadow-none hover:bg-transparent hover:text-accent-foreground">
            <span class="text-xs font-medium flex items-center space-x-1">View All</span>
            <ExternalLink class="h-3 w-3"/>
        </Button>
    </Card.Header>
    
    <Card.Content>
        <!-- region filter -->
         <div class="flex flex-wrap gap-1 mb-4">
            {#each categories as category}
                <Button
                    key={category.id}
                    variant="outline"
                    class={`h-7 px-2 text-xs lg:text-sm ${selectedCategory === category.id ? 'bg-amber-500 hover:bg-amber-500 hover:text-primary-foreground text-primary-foreground' : 'hover:text-foreground hover:bg-muted-foreground/20'}`}
                    onclick = {() => selectedCategory = category.id}
                >
                    {category.name}
                </Button>
            {/each}
         </div>

         <!-- scholarships -->
        <div class="space-y-3">
            {#each filteredScholarships.slice(0, limit) as scholarship}
                <div class={"p-4 rounded-(--radius) hover:shadow-sm border-1 " +
                             (scholarship.featured ? 'border-amber-300 bg-amber-50': 'border-border bg-white')}>
                    <div class="flex flex-col items-start justify-between mb-2">
                        <div class="flex w-full justify-between items-center">
                            <div class="flex items-center space-x-1">
                                <h3 class="font-semibold text-foreground text-[0.85rem] sm:text-sm text-wrap w-fit">{scholarship.title}</h3>
                            </div>
                            <div class="flex flex-row flex-wrap justify-end gap-0.5 items-end">
                                {#if scholarship.featured}
                                    <Badge 
                                        class="px-1.5 py-0 bg-primary/15 text-accent-foreground/80 text-[0.65rem] sm:text-xs font-medium">
                                        Featured
                                    </Badge>
                                {/if}
                                <Badge 
                                    class={"px-1.5 py-0 text-[0.65rem] sm:text-xs font-medium " + (getStatusColor(scholarship.status))}>
                                    {scholarship.status.replace('-', ' ').toUpperCase()}
                                </Badge>
                            </div>
                            
                        </div>
                        
                        <div>
                            <p class="text-[0.65rem] sm:text-xs text-secondary-foreground mb-1">
                                {scholarship.provider}
                            </p>
                            <p class="text-[0.65rem] sm:text-xs text-muted-foreground mb-2">
                                {scholarship.description}
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-xs text-secondary-foreground mb-5">
                        <div class="flex items-center space-x-1">
                            <DollarSign class="h-3 w-3"/>
                            <span class="text-[0.65rem] sm:text-xs">{scholarship.amount}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <MapPin class="h-3 w-3"/>
                            <span class="text-[0.65rem] sm:text-xs">{scholarship.location}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <Calendar class="h-3 w-3"/>
                            <span class="font-medium text-[0.65rem] sm:text-xs">{new Date(scholarship.deadline).toLocaleDateString()}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <Clock class="h-3 w-3"/>
                            <span class="text-[0.65rem] sm:text-xs">{scholarship.deadline}</span> <!-- implement logic to display days left or Deadline Missed-->
                        </div>
                    </div>

                    

                    <div class="flex items-center justify-between gap-6">
                        <div class="flex flex-wrap items-center gap-1 mb-1">
                            {#each scholarship.qualifications as qualification}
                                <span key={qualification}
                                        class="px-1.5 py-0.5 bg-muted border-[1px] text-[0.60rem] sm:text-[0.65rem] md:text-xs rounded-(--radius)">
                                    {qualification}
                                </span>
                            {/each}
                        </div>
                        <Button
                            class="h-6 sm:h-7 text-[0.70rem] sm:text-xs">
                            Learn More
                        </Button>
                    </div>
                </div>
            {/each}
        </div>
    </Card.Content>
    <div class="mt-3 text-center">
        <Button>
            Explore All Scholarships
        </Button>
    </div>
</Card.Root>