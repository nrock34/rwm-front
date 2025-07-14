<script>

    import * as Card from '$lib/components/ui/card';
    import { Users } from 'lucide-svelte';


    const stats = [
        {name: 'Active Students', value: 1247},
        {name: 'Total Students', value: 47331},
        {name: 'Online Now', value: 34},
        {name: 'Posts Today', value: 7}
    ]


</script>

<Card.Root>
    <Card.Header class="flex items-center space-x-2">
        <Users class="text-primary w-8 h-8"/>
        <h3 class="text-lg font-semibold">
            Community Stats
        </h3>
    </Card.Header>

    <Card.Content>
        <div class="grid grid-cols-2 gap-4 text-center">
            {#each stats as stat}
                <div>
                    <p class="text-xl font-[900] text-primary">{stat.value}</p>
                    <p class="text-xs text-secondary-foreground">{stat.name}</p>
                </div>
            {/each}  
        </div>
        
    </Card.Content>
</Card.Root>