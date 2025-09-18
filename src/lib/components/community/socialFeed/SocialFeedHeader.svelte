<script>

    import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import { Filter, Plus, Search, Users, BookOpen, Calendar, Award } from 'lucide-svelte';
    import { Input } from '$lib/components/ui/input';

    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    
    let {searchQuery = $bindable(), activeFilter = $bindable(''),
        activeContentType = $bindable(), filters, contentTypes } = $props();


    

</script>


<div class = "space-y-6">
    <Card.Root>
        <Card.Header>
            <div class="flex items-center justify-between gap-x-6">
                <div>
                    <h1 class="md:text-xl lg:text-2xl font-bold text-primary">
                        Social Feed
                    </h1>
                    <p class="text-muted-foreground md:text-sm lg:text-[0.95rem]">
                        Connect, share, and discover with fellow students/alumni.
                    </p>
                </div>
                <Button class="flex items-center text-xs lg:text-sm h-fit has-[>svg]:px-8 space-x-2  ">
                    <Plus size='h-4 w-4'/>
                    <span>
                        Create Post
                    </span>
                </Button>
            </div>
        </Card.Header>
        <Card.Content>
            <div class="relative mb-6">
                <div class="absolute inset-y-0 left-0 pb-[2px] pl-3 flex items-center">
                    <Search class="h-5 w-5 text-muted-foreground"/>
                </div>
                <Input
                    value={searchQuery}
                    onchange={(e) => {searchQuery = e.target.value}}
                    type="text"
                    placeholder="Search posts, topics, or tags..."
                    class = "block w-full pl-10 pr-3"
                />
            </div>

            <div class="flex flex-wrap gap-2 mb-2">
                <div class="flex items-center space-x-2">
                    <Filter class="w-4 h-4 text-secondary-foreground"/>
                    <span class="text-xs lg:text-sm text-secondary-foreground font-[500]">
                        Topic:
                    </span>
                </div>
                {#each filters as filter}
                    <Button onclick={() => {activeFilter = filter.id}}
                            variant={activeFilter === filter.id ? 'secondary' : 'primary'}
                            class={`text-xs h-fit md:py-1.5 lg:py-2 ${activeFilter === filter.id ? 'border border-ring text-foreground/90' : 'bg-gray-300 text-foreground hover:text-primary/80'}`}
                            >
                        <filter.icon />
                        <span>{filter.name}</span>
                    </Button>
                {/each}
            </div>
            <div class="flex items-center gap-2">
                <div class="flex items-center space-x-2">
                    <span class="text-xs lg:text-sm text-secondary-foreground font-[500]">
                        Type:
                    </span>
                </div>
                {#each contentTypes as contentType}
                    <Button
                            key={contentType.id}
                            onclick={() => {activeContentType = contentType.id}}
                            variant={activeContentType === contentType.id ? 'secondary' : 'primary'}
                            class={`text-xs h-fit md:py-1.5 lg:py-2 ${activeContentType === contentType.id ? 'border border-ring text-foreground/90' : 'bg-gray-300 text-foreground hover:text-primary/80'}`}
                            >
                        {contentType.name}
                    </Button>
                {/each}
            </div>
        </Card.Content>
    </Card.Root>
</div>