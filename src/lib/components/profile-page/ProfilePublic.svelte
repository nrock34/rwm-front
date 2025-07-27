<script>
    import { Award, Calendar, Eye, MapPin, MessageSquare, Star, User } from "lucide-svelte";
    import * as Card from "../ui/card";
    import { userProfile } from "./test";
    import { Badge } from "../ui/badge";
    import {Button} from "../ui/button";

    let isFollowing = $state(false);

</script>

<div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <div class="grid lg:grid-cols-3 gap-8">

        <!-- profile info -->
        <div class="lg:col-span-1">
            <Card.Root class="p-8 gap-2 mb-6">
                <div class="text-center mb-6">
                    <div class="relative inline-block">
                        <img
                            src={userProfile.avatar}
                            alt={userProfile.name}
                            class="w-24 h-24 rounded-full object-cover mx-auto shadow-md"
                        />
                        {#if userProfile.isVerified}
                            <div class="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <User class="right-1 absolute h-3.5 w-3.5 text-primary-foreground"/>
                            </div>
                        {/if}
                    </div>
                    <h1 class="text-xl font-semibold text-foreground mt-3">{userProfile.name}</h1>
                    <!-- change to college -->
                    <Badge class='text-xs mt-1'>
                        {userProfile.badge}
                    </Badge>
                    {#if userProfile.staff}
                    <Badge class='text-xs mb-1'>
                        Team Member
                    </Badge>
                    {/if}
                </div>

                <div class="space-y-3 mb-6">
                    <div class="flex items-center space-x-2 text-sm">
                        <MapPin class="h-4 w-4 text-secondary-foreground"/>
                        <span class="text-secondary-foreground">{userProfile.location}</span>
                    </div>
                    {#if userProfile.currentProgram}
                    <div class="flex items-center space-x-2 text-sm">
                        <Award class="h-4 w-4 text-secondary-foreground"/>
                        <span class="text-secondary-foreground">{userProfile.currentProgram}</span>
                    </div>
                    {/if}
                    <div class="flex items-center space-x-2 text-sm">
                        <Calendar class="h-4 w-4 text-secondary-foreground"/>
                        <span class="text-secondary-foreground">
                            Joined {new Date(userProfile.joinDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <p class="text-sm text-secondary-foreground mb-6">
                    {userProfile.bio}
                </p>

                <!-- profile statistics -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="text-center">
                        <div class="text-lg font-bold text-foreground">{userProfile.stats.posts}</div>
                        <div class="text-xs text-muted-foreground">Posts</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-foreground">{userProfile.stats.likes}</div>
                        <div class="text-xs text-muted-foreground">Likes</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-foreground">{userProfile.year}</div>
                        <div class="text-xs text-muted-foreground">Year</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-foreground">{userProfile.wentAbroad ? 'Yes' : 'No'}</div>
                        <div class="text-xs text-muted-foreground">Went Abroad?</div>
                    </div>
                </div>

                <!-- actions -->
                <div class="space-y-3">
                    <Button
                        onclick={() => {isFollowing = !isFollowing}}
                        class={`w-full border-ring/30 text-foreground/80`}
                        variant={`${isFollowing ? 'secondary' : 'outline'}`}
                        >
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button disabled
                        class={`w-full items-center flex`}>
                        <MessageSquare class="h-4 w-4 mr-2" />
                        Message
                    </Button>
                </div>
            </Card.Root>


            <!-- badges -->
            <Card.Root class="p-6 gap-0">

                <h3 class="font-semibold text-foreground mb-4">Achievments</h3>
                <div class="space-y-2">
                    {#each userProfile.badges as badge, idx}
                        <Badge class={`${badge.color} w-full justify-center`}>
                            {badge.name}
                        </Badge>
                    {/each}
                </div>
            </Card.Root>


            <!-- community reviews -->



        </div>

        <!-- main content -->
        <div class="lg: col-span-2 space-y-8">
            <Card.Root class="p-6 gap-1">
                <h2 class="text-xl font-semibold text-foreground mb-4">
                    Contributions
                </h2>
                <div class="grid md:grid-cols-2 gap-4">
                    {#each userProfile.contributions as contrib, idx}
                        <div key={idx} class="border-1 border-border/40 rounded p-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="badge-outline text-xs capitalize">{contrib.type}</span>
                                <div class="flex items-center space-x-1">
                                    <Star class="h-3 w-3 text-yellow-500 fill-current"/>
                                    <span class="text-xs font-medium">{contrib.rating}</span>
                                </div>
                            </div>
                            <h3 class="font-medium text-foreground mb-1">{contrib.title}</h3>
                            <p class="text-sm text-muted-foreground mb-2">{contrib.description}</p>
                            <div class="flex items-center space-x-4 text-xs text-muted-foreground">
                                <div class="flex items-center space-x-1">
                                    <Eye class="h-3 w-3"/>
                                    <span>{contrib.views}</span>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </Card.Root>

            <!-- recent posts -->
            <Card.Root class="gap-2 p-8">
                <h2 class="text-xl font-semibold text-foreground mb-4">Recent Posts</h2>
                <div class="space-y-6">
                    {#each userProfile.recentPosts as post}
                        <article key={post.id} class="border-b border-border pb-6 last:border-b-0">
                            <div class="flex items-start space-x-3">
                                <img
                                    src={userProfile.avatar}
                                    alt={userProfile.name}
                                    class="w-10 h-10 border-1 border-foreground/80 rounded-full object-cover"
                                />

                                <div class="flex-1">
                                    <div class="flex items-center space-x-2 mb-2">
                                        <span class="font-medium text-foreground">{userProfile.name}</span>
                                        <Badge class={``}>
                                            {userProfile.badge}
                                        </Badge>
                                        <span class="text-sm text-muted-foreground">•</span>
                                        <span class="text-sm text-muted-foreground">{post.timestamp}</span>
                                    </div>

                                    <p class="text-foreground mb-3">{post.content}</p>

                                    {#if post.image}
                                        <div class="rounded overflow-hidden mb-3">
                                            <img 
                                                src={post.image}
                                                alt="Post Image"
                                                class="w-full h-48 object-cover"
                                            />
                                        </div>
                                    {/if}

                                    <div class="flex items-center space-x-6 text-sm text-secondary-foreground/80">
                                        <span>
                                            <a 
                                                href="#"
                                                class="hover:underline"
                                            >
                                                See more
                                            </a>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    {/each}
                </div>
            </Card.Root>
        </div>
    </div>
</div>