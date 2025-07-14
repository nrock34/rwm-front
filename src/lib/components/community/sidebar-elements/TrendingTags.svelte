
<script>
    import * as Card from '$lib/components/ui/card';
    import { TrendingUp } from 'lucide-svelte';

    const trendingTag = [
        { tag: 'study-abroad-tips', posts: 45 },
        { tag: 'rome-photography', posts: 38 },
        { tag: 'italian-language', posts: 32 },
        { tag: 'weekend-trips', posts: 28 },
        { tag: 'scholarship-help', posts: 24 }
    ];

</script>


<Card.Root>
    <Card.Header class="flex items-center">
        <TrendingUp class="text-primary/80 w-8 h-8"/>
        <h3 class="text-lg font-semibold text-foreground">
            Trending Topics
        </h3>
    </Card.Header>
    <Card.Content class="space-y-3">
        {#each trendingTag as tag}
            <div class="flex items-center justify-between hover:bg-border/15 rounded-(--radius) px-2 py-2"> <!-- add cursor pointer -->
                <span class="text-sm font-medium text-accent-foreground">
                    #{tag.tag}
                </span>
                <span class="text-xs text-muted-foreground">{tag.posts} posts</span>
            </div>
        {/each}
    </Card.Content>
</Card.Root>