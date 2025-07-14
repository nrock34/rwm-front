<script>
    import { Badge } from "$lib/components/ui/badge";
    import * as Card from "$lib/components/ui/card";
    import { getTimeAgo } from "$lib/helper-funcs/funcs";
    import { Calendar, Clock, Eye } from "lucide-svelte";
    import {Button} from "../ui/button/";
    


    let { paginatedNews, categories, totalPage } = $props();

</script>


<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {#each paginatedNews as newsItem}
        <Card.Root class="py-0 gap-6">
            <div class="relative mb-0">
                <img
                    src={newsItem.image}
                    alt={newsItem.title}
                    class="w-full h-48 object-cover rounded-t-(--radius)"
                />
                {#if newsItem.urgent}
                    <Badge variant='destructive' class="absolute top-3 right-3">
                        URGENT
                    </Badge>
                {/if}
                <Badge class="text-xs absolute top-3 left-3">
                    {categories.find((c) => c.id === newsItem.category)?.name}
                </Badge>
            </div>
            <div class="pt-0 p-5 flex flex-col justify-between h-full">
                <div>
                    <div class="flex items-center text-xs text-muted-foreground mb-3">
                        <Clock class="h-3 w-3 mr-1"/>
                        {getTimeAgo(newsItem.date)}
                        <span class="mx-2">•</span>
                        <Calendar class="h-3 w-3 mr-1"/>
                        {new Date(newsItem.date).toLocaleDateString()}
                    </div>

                    <h3 class="font-semibold mb-2">
                        {newsItem.title}
                    </h3>
                    <p class="mb-4 text-secondary-foreground text-sm">
                        {newsItem.excerpt}
                    </p>
                </div>

                <div class="flex items-center justify-between ">
                    <div class="flex items-center text-xs text-muted-foreground">
                       <Eye class="h-4 w-4 mr-1"/>
                       {newsItem.views}
                    </div>
                    <Button size='sm' class='text-xs'>
                        Read More
                    </Button>
                </div>
            </div>

            
        </Card.Root>
    {/each}
</div>

