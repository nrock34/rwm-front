<script>
    import * as Card from "$lib/components/ui/card";
    import { Badge } from '$lib/components/ui/badge'
    import { Car, Clock, Heart, MessageSquareReply, Pin, Share2 } from "lucide-svelte";
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator/index.js";

    let { activeFilter, activeContentType, searchQuery, contentTypes } = $props();

    console.log(activeFilter)
    console.log(activeContentType)
    console.log(searchQuery)

    const posts = [
    {
        id: 1,
        type: 'discussion',
        category: 'academics',
        author: {
            name: 'Sarah Johnson',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            badge: 'Community Leader'
        },
        timestamp: '2 hours ago',
        content: 'Has anyone taken Professor Rossi\'s Art History course? I\'m considering it for next semester and would love to hear your thoughts on the workload and teaching style.',
        image: null,
        likes: 24,
        comments: 12,
        shares: 3,
        tags: ['art-history', 'professors', 'course-advice']
        },
        {
        id: 2,
        type: 'photo',
        category: 'events',
        author: {
            name: 'Marco Benedetti',
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            badge: 'Local Expert'
        },
        timestamp: '4 hours ago',
        content: 'Amazing sunset from the Spanish Steps tonight! Rome never fails to take my breath away 🌅',
        image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        likes: 89,
        comments: 23,
        shares: 15,
        tags: ['photography', 'spanish-steps', 'sunset']
        },
        {
        id: 3,
        type: 'announcement',
        category: 'opportunities',
        author: {
            name: 'RomeWithMe Admin',
            avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            badge: 'Official'
        },
        timestamp: '6 hours ago',
        content: '🎓 New scholarship opportunity! The Fulbright Commission is now accepting applications for the 2024-2025 academic year. Deadline: March 15th. Full details in the scholarship section.',
        image: null,
        likes: 156,
        comments: 34,
        shares: 67,
        tags: ['scholarship', 'fulbright', 'deadline'],
        pinned: true
        },
        {
        id: 4,
        type: 'discussion',
        category: 'academics',
        author: {
            name: 'Emma Chen',
            avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            badge: 'Study Buddy'
        },
        timestamp: '8 hours ago',
        content: 'Looking for study partners for the upcoming Italian Language exam. Anyone interested in forming a study group? We could meet at the library or a café in Trastevere.',
        image: null,
        likes: 31,
        comments: 18,
        shares: 5,
        tags: ['study-group', 'italian-language', 'trastevere']
        },
        {
        id: 5,
        type: 'photo',
        category: 'events',
        author: {
            name: 'David Kim',
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            badge: 'Explorer'
        },
        timestamp: '1 day ago',
        content: 'Weekend trip to Florence was incredible! The Uffizi Gallery blew my mind. Already planning the next adventure. Who\'s in for a trip to Venice next month?',
        image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        likes: 67,
        comments: 29,
        shares: 12,
        tags: ['florence', 'uffizi', 'weekend-trip', 'venice']
        },
        {
        id: 6,
        type: 'discussion',
        category: 'opportunities',
        author: {
            name: 'Lisa Park',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            badge: 'Mentor'
        },
        timestamp: '1 day ago',
        content: 'Just got accepted for an internship at a local NGO! For anyone looking for internship opportunities, I highly recommend checking out the International Volunteer HQ. They have great programs here in Rome.',
        image: null,
        likes: 94,
        comments: 41,
        shares: 28,
        tags: ['internship', 'ngo', 'volunteer', 'career']
        }
    ];

    const filteredPosts = $derived(posts.filter((item) => {
        const matchesContentType = activeContentType === 'all' || activeContentType === item.type
        const matchesFilter = activeFilter === 'all' || activeFilter === item.category
        const matchesSearch = searchQuery === '' ||  
            item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesContentType && matchesFilter && matchesSearch
    }))

    

</script>



<div class="space-y-6">
    {#each filteredPosts as post}
        <Card.Root key={post.id} class="p-6 hover:shadow-lg transition-shadow gap-2">
            <Card.Header>
                <div class="flex items-start justify-between">
                    <div class="flex items-center space-x-3">
                        <Avatar.Root class="w-12 h-12">
                            <Avatar.Image src={post.author.avatar}/>
                            <Avatar.Fallback>{post.author.name}</Avatar.Fallback>
                        </Avatar.Root>
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
                                    {contentTypes.find((type) => type.id === post.type)?.name}
                                </span>
                                <span>•</span>
                                <Clock class="h-3 w-3"/>
                                <span class="text-sm">{post.timestamp}</span>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost">
                        <Share2 class="h-3 w-3"/>
                    </Button>
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

    <div class="text-center">
        <Button variant="secondary" class="h-13 px-8 text-md">
            See More Posts
        </Button>
    </div>

</div>