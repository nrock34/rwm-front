<script>

    import {Button} from '$lib/components/ui/button';
    import {Badge} from '$lib/components/ui/badge';
    import * as Card from '$lib/components/ui/card'
    import { Calendar, Clock, ExternalLink, Globe, MapPin, Star, Users } from 'lucide-svelte';


    let selectedRegion = $state('')

    const regions = [
        { id: 'all', name: 'All' },
        { id: 'europe', name: 'Europe' },
        { id: 'asia', name: 'Asia' },
        { id: 'americas', name: 'Americas' },
        { id: 'oceania', name: 'Oceania' }
    ];

    const programs = [
    {
      id: 1,
      title: 'Semester in Florence',
      provider: 'Florence University of the Arts',
      location: 'Florence, Italy',
      region: 'europe',
      duration: '1 Semester',
      cost: '$18,000',
      deadline: '2024-04-15',
      rating: 4.8,
      participants: 45,
      description: 'Immerse yourself in Renaissance art and Italian culture.',
      highlights: ['Art History Focus', 'Italian Language', 'Cultural Immersion', 'Museum Access'],
      featured: true
    },
    {
      id: 2,
      title: 'Tokyo Business Program',
      provider: 'Waseda University',
      location: 'Tokyo, Japan',
      region: 'asia',
      duration: '1 Year',
      cost: '$22,000',
      deadline: '2024-03-30',
      rating: 4.9,
      participants: 32,
      description: 'Study international business and Japanese culture.',
      highlights: ['Business Focus', 'Japanese Language', 'Internship Opportunities', 'Tech Industry'],
      featured: true
    },
    {
      id: 3,
      title: 'Barcelona Architecture',
      provider: 'Universitat Politècnica de Catalunya',
      location: 'Barcelona, Spain',
      region: 'europe',
      duration: '1 Semester',
      cost: '$16,500',
      deadline: '2024-05-01',
      rating: 4.7,
      participants: 28,
      description: 'Explore modernist architecture and urban planning.',
      highlights: ['Architecture Focus', 'Urban Planning', 'Spanish Language', 'Design Studios'],
      featured: false
    }
  ];

  const filteredPrograms = programs

</script>

<Card.Root>
    <Card.Header class="flex items-center justify-between mb-0">
        <div class="flex items-center space-x-2">
            <Globe class="text-primary" />
            <h2 class="text-lg font-bold text-foreground">
                Study Abroad Programs
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
            {#each regions as region}
                <Button
                    key={region.id}
                    variant="outline"
                    class={selectedRegion === region.id ? 'bg-primary/80 hover:bg-primary/80 hover:text-primary-foreground text-primary-foreground' : 'hover:text-foreground hover:bg-muted-foreground/20'}
                    onclick = {() => selectedRegion = region.id}
                    >
                    {region.name}
                </Button>
            {/each}
         </div>

         <!-- Programs -->
        <div class="space-y-3">
            {#each filteredPrograms as program}
                <div class={"p-4 rounded-(--radius) hover:shadow-sm border-1 " +
                             (program.featured ? 'border-ring/40 bg-ring/5': 'border-border bg-white')}>
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex-1 ">
                            <div class="flex items-center space-x-1 mb-1">
                                <h3 class="font-semibold text-foreground text-sm">{program.title}</h3>
                                {#if program.featured}
                                    <Badge 
                                        class="px-1.5 py-0 bg-primary/15 text-accent-foreground/80 text-xs font-medium">
                                        Featured
                                    </Badge>
                                {/if}
                            </div>
                            <p class="text-xs text-secondary-foreground mb-1">
                                {program.provider}
                            </p>
                            <div class="flex items-center space-x-1 mb-1">
                                <MapPin class="h-3 w-3 text-muted-foreground"/>
                                <span class="text-xs text-muted-foreground">
                                    {program.location}
                                </span>
                            </div>
                            <p class="text-xs text-muted-foreground mb-2">
                                {program.description}
                            </p>
                        </div>
                        <div class="flex items-center space-x-1">
                            <Star class="h-3 w-3 text-yellow-500 fill-current"/>
                            <span>
                                {program.rating}
                            </span>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-xs text-secondary-foreground mb-2">
                        <div class="flex items-center space-x-1">
                            <Clock class="h-3 w-3"/>
                            <span>{program.duration}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <Users class="h-3 w-3"/>
                            <span>{program.participants}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <span class="font-medium">{program.cost}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <Calendar class="h-3 w-3"/>
                            <span>{program.deadline}</span> <!-- implement logic to display days left or Deadline Missed-->
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-1 mb-4">
                        {#each program.highlights as highlight}
                            <span key={highlight}
                                    class="px-1.5 py-0.5 bg-muted border-[1px] text-xs rounded-(--radius)">
                                {highlight}
                            </span>
                        {/each}
                    </div>

                    <div class="flex items-center justify-between">
                        <span class="text-xs text-muted-foreground">
                            Deadline: {new Date(program.deadline).toLocaleDateString()}
                        </span>
                        <Button>
                            Learn More
                        </Button>
                    </div>
                </div>
            {/each}
        </div>
    </Card.Content>
    <div class="mt-3 text-center">
        <Button>
            Explore All Programs
        </Button>
    </div>
</Card.Root>