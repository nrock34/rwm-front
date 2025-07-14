<script>
    import * as Card from "$lib/components/ui/card";
    import { ExternalLink } from "lucide-svelte";

    const quickLinks = [
        { name: 'Academic Calendar', url: '#', external: true },
        { name: 'Student Portal', url: '#', external: true },
        { name: 'Library Resources', url: '#', external: false },
        { name: 'Campus Map', url: '#', external: false },
        { name: 'Emergency Contacts', url: '#', external: false }
    ];

</script>


<Card.Root>
    <Card.Header>
        <h3 class="text-lg font-semibold text-foreground">
            Quick Links
        </h3>
        <nav class="space-y-1">
            {#each quickLinks as link}
                <a
                    key={link.name}
                    href={link.url}
                    class="flex items-center text-muted-foreground justify-between hover:text-accent-foreground"
                >
                    <span>
                        {link.name}
                    </span>
                    {#if link.external}
                        <ExternalLink class="h-3 w-3"/>
                    {/if}
                </a>
            {/each}
        </nav>
    </Card.Header>
</Card.Root>