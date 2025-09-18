
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


<Card.Root class="px-4 sm:px-6 py-5 gap-2 sm:gap-3">
    <Card.Header class="flex items-center p-0">
        <TrendingUp class="text-primary/80 w-4 h-4 sm:w-6 sm:h-8"/>
        <h3 class="text-sm font-semibold text-foreground">
            Trending Topics
        </h3>
    </Card.Header>
    <Card.Content class="space-y-0.5 sm:space-y-1.5 p-0 ">
        {#each trendingTag as tag}
        <div class="flex items-center">
            <span class="text-[0.60rem] sm:text-xs pr-1.5 sm:pr-2">#</span>
            <div class="flex justify-between sm:flex-row w-full lg:items-center sm:justify-between hover:bg-border/15 rounded-(--radius)"> <!-- add cursor pointer -->
                <span class="text-[0.65rem] sm:text-xs sm:break-all md:text-[0.80rem] lg:text-sm font-medium text-accent-foreground pr-4">
                    {tag.tag}
                </span>
                <span class="text-[0.60rem] sm:text-[0.65rem] md:text-xs text-muted-foreground text-nowrap">{tag.posts} posts</span>
            </div>
        </div>
        {/each}
    </Card.Content>
</Card.Root>