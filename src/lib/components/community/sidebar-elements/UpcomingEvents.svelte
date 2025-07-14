<script>
    import * as Card from "$lib/components/ui/card";
    import { Calendar } from "lucide-svelte";
    import Page from "../../../../routes/+page.svelte";
    import { Button } from "$lib/components/ui/button";

    const upcomingEvents = [
        {
        title: 'Study Group: Italian Language',
        date: '2024-01-20',
        time: '15:00',
        location: 'Library Study Room 3'
        },
        {
        title: 'Cultural Workshop: Roman History',
        date: '2024-01-22',
        time: '18:00',
        location: 'Campus Center'
        },
        {
        title: 'Weekend Trip: Florence',
        date: '2024-01-27',
        time: '08:00',
        location: 'Departure from Campus'
        }
    ]

</script>


<Card.Root>

    <Card.Header class="flex items-center space-x-3">
        <Calendar class='w-6 h-6 text-primary'/>
        <h3 class="text-foreground font-semibold">Upcoming Events</h3>
    </Card.Header>

    <Card.Content class="space-y-4">
        {#each upcomingEvents as event}
            <div class="border-l-3 border-secondary/100 pl-3">
                <h4 class="text-sm font-medium"> {event.title} </h4>
                <p class="text-xs text-muted-foreground"> 
                    {event.date} at {event.time}
                </p>
                <p class="text-xs text-muted-foreground">
                    {event.location}
                </p>
            </div>
        {/each}
        <div class="text-center">
            <Button variant="ghost" class="text-primary/90">
                View All Events
            </Button>
        </div>
    </Card.Content>
</Card.Root>