
<script>
    import { Check, Clock, Plus, Search, Users, User,
             BookOpen, Share2, Calendar, Award, Filter,
             Heart, MessageSquareReply, Pin } from "lucide-svelte";
    import Button from "../ui/button/button.svelte";
    import * as Card from "../ui/card";
    import {Input} from "../ui/input";
    import * as Select from "../ui/select";
    import SelectContent from "../ui/select/select-content.svelte";
    import { posts } from './test.js'
    import * as Avatar from '$lib/components/ui/avatar'
    import Badge from "../ui/badge/badge.svelte";
    import Separator from "../ui/separator/separator.svelte";

    const filters = [
        { id: 'all', name: 'All Posts', icon: Users },
        { id: 'academics', name: 'Academics', icon: BookOpen },
        { id: 'events', name: 'Events', icon: Calendar },
        { id: 'opportunities', name: 'Opportunities', icon: Award }
    ];

    const contentTypes = [
        { id: 'all', name: 'All' },
        { id: 'photo', name: 'Photos' },
        { id: 'discussion', name: 'Discussions' },
        { id: 'announcement', name: 'Announcements' },
        { id: 'question', name: 'Questions'}
    ];

    const sortOptions = [
        { id: 'recent', name: 'Most Recent' },
        { id: 'popular', name: 'Most Popular' },
        { id: 'engaged', name: 'Most Engaged' },
        { id: 'trending', name: 'Trending' }
    ];

    let numOfPosts = $state(1)
    let searchQuery = $state('')
    let selectedSort = $state('recent')
    let activeFilter = $state('all')
    let activeContentType = $state('all')

    const sortByTriggerContent = $derived(sortOptions.find(sort => {
        return sort.id === selectedSort
    })?.name || 'n/a')

    const filteredPosts = $derived(posts.filter((post) => {
        const matchesFilter = activeFilter === 'all' || activeFilter === post.category;
        const matchesType = activeContentType === 'all' ||  activeContentType === post.type;
        const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) 
            || post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            || post.author.name.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesFilter && matchesSearch && matchesType

    }));

    const sortedPosts = $derived([...filteredPosts].sort((a,b) => {
        switch (selectedSort) {
            case 'recent':
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            case 'popular':
                return b.likes - a.likes
            case 'engaged':
                return (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares)
            case 'trending':
                return b.shares - a.shares
            default:
                return 0
        }
    }))

    const paginatedPosts = $derived(
        sortedPosts.slice(0 , numOfPosts)
    )


</script>


        <div class="mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-foreground mb-2">community feed</h1>
                    <p class="text-muted-foreground">
                        discover, share, and connect with fellow students
                    </p>
                </div>
                <Button>
                    <Plus class="h-4 w-4"/>
                    <span>create post</span>
                </Button>
            </div>
        </div>

        <!-- filters and search -->
        <Card.Root class="gap-2 p-12 mb-10">
            <div class="relative mb-6">
                <div class="absolute inset-y-0 left-0 pb-[2px] pl-3 flex items-center">
                    <Search class="h-5 w-5 text-muted-foreground"/>
                </div>
                <Input
                    type="text"
                    placeholder="Search posts, topics, users, or tags..."
                    class = "block w-full pl-10 pr-3"
                    value = {searchQuery}
                    oninput = {(e) => {searchQuery = e.target.value}}
                />
            </div>

            <div class="flex flex-wrap gap-2 mb-4 space-x-2">
                <div class="flex items-center space-x-2 mr-4">
                    <Filter class="h-4 w-4 text-muted-foreground" />
                    <span class="text-sm font-medium text-foreground">Topic:</span>
                </div>
                {#each filters as filter}
                    <Button onclick={() => {activeFilter = filter.id}}
                            variant={activeFilter === filter.id ? 'secondary' : 'primary'}
                            class="{activeFilter === filter.id ? 'border border-ring' : 'bg-gray-300 text-foreground hover:text-secondary'}"
                            >
                        <filter.icon />
                        <span>{filter.name}</span>
                    </Button>
                {/each}
            </div>

            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex flex-wrap gap-2 items-center">
                    <span class="text-sm font-medium text-foreground mr-2">Type: </span>
                    {#each contentTypes as contentType}
                        <Button
                                key={contentType.id}
                                onclick={() => {activeContentType = contentType.id}}
                                variant={activeContentType === contentType.id ? 'secondary' : 'primary'}
                                class={activeContentType === contentType.id 
                                    ? 'border border-ring' 
                                    : 'bg-gray-300 text-foreground hover:text-secondary'}
                                >
                            {contentType.name}
                        </Button>
                    {/each}
                </div>

                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium text-foreground text-nowrap">Sort By: </span>
                        <Select.Root
                            type='single'
                            bind:value={selectedSort}>
                            <Select.Trigger>
                                {sortByTriggerContent}
                            </Select.Trigger>
                            <Select.Content>
                                {#each sortOptions as sort}
                                    <Select.Item value={sort.id} label={sort.name}/>
                                {/each}
                            </Select.Content>
                        </Select.Root>
                    </div>

                </div>
            </div>
            


        </Card.Root>

        <div class="space-y-6">
            {#each paginatedPosts as post}
                <Card.Root key={post.id} class="p-6 hover:shadow-lg transition-shadow gap-2">
                    <Card.Header>
                        <div class="flex items-start justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="relative">
                                    <Avatar.Root class="w-12 h-12">
                                        <Avatar.Image src={post.author.avatar}/>
                                        <Avatar.Fallback>{post.author.name}</Avatar.Fallback>
                                    </Avatar.Root>
                                    {#if post.author.admin}
                                        <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-ring/90 rounded-full flex items-center justify-center">
                                            <User class="h-3 w-3 text-foreground"/>
                                        </div>
                                    {:else if post.author.verified}
                                        <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                                            <Check strokeWidth='4' class="h-4 w-3 text-foreground"/>
                                        </div>
                                    {/if}
                                </div>
                                
                                <div class="">
                                    <div class="flex items-center space-x-3">
                                        <h3 class="font-semibold">{post.author.name}</h3>
                                        <Badge variant="outline"
                                                class="bg-yellow-500/15 h-4 text-[0.625rem]">
                                            {post.author.badge}
                                        </Badge>
                                        {#if post.pinned}
                                            <Badge class="h-5 w-8">
                                                <Pin class="h-4"/>
                                            </Badge>
                                        {/if}
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <span class="text-sm">
                                            {contentTypes.find(a => a.id === post.type)?.name}
                                        </span>
                                        <span>•</span>
                                        <Clock class="h-3 w-3"/>
                                        <span class="text-sm">{post.timestamp}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Badge class="bg-purple-300/90 text-purple-700/90">
                                    {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                                </Badge>
                            </div>
                            <!-- <Button variant="ghost">
                                <Share2 class="h-3 w-3"/>
                            </Button> -->
                        </div>
                    </Card.Header>

                    <Card.Content>
                        <div class="mb-6">
                            <p class="mb-3">
                                {post.content}
                            </p>
                            {#if post.image}
                                <div class="overflow-hidden rounded-md">
                                    <img
                                        src={post.image}
                                        alt="post content"
                                        class="w-full h-64 object-cover"
                                    />
                                </div>
                            {/if}
                        </div>

                        {#if post.tags.length > 0}
                            <div class="flex items-center space-x-3">
                                {#each post.tags as tag}
                                    <Badge
                                        class="cursor-pointer text-accent-foreground bg-ring/20 hover:bg-ring/40 transition">
                                        #{tag}
                                    </Badge>
                                {/each}
                            </div>
                        {/if}
                        
                        <Separator class="mt-4" />
                        <div class="flex items-center justify-between pt-4">
                            <div class="flex items-center">
                                <Button class="flex items-center hover:bg-red-300/20 hover:text-foreground" 
                                        variant="ghost">
                                    <Heart class="hover:text-primary"
                                        size={28}/>
                                    <span>{post.likes}</span>
                                </Button>
                                <Button class="flex items-center " 
                                        variant="ghost">
                                    <MessageSquareReply/>
                                    <span>{post.comments}</span>
                                </Button>
                                <Button hidden=true>
                                    <!-- implement new share button here at some point -->
                                </Button>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
            {/each}
        </div>

        <div class="mt-5 text-center">
            <Button
                size='lg'
                onclick={() => {numOfPosts+=5}}>
                See more posts
            </Button>
        </div>