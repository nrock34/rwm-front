<script>
    import { Award, Calendar, MapPin, MessageSquare, User } from "lucide-svelte";
    import * as Card from "../ui/card";
    import { userProfile } from "./test";
    import { Badge } from "../ui/badge";
    import Button from "../ui/button";

    let isFollowing = $state(false);

</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <div class="grid lg:grid-cols-3 gap-8">

        <!-- profile info -->
        <div class="lg:col-span-1">
            <Card.Root class="p-6 mb-6">
                <div class="text-center mb-6">
                    <div class="relative inline-block">
                        <img
                            src={userProfile.avatar}
                            alt={userProfile.name}
                            class="w-24 h-24 rounded-full object-cover mx-auto"
                        />
                        {#if userProfile.isVerified}
                            <div class="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex item-center justify-center">
                                <User class="h-3 w-3 text-primary-foreground"/>
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
                        <MapPin class="h-4 w-4 text-muted-foreground"/>
                        <span class="text-muted-foreground">{userProfile.location}</span>
                    </div>
                    {#if userProfile.currentProgram}
                    <div class="flex items-center space-x-2 text-sm">
                        <Award class="h-4 w-4 text-secondary-foreground"/>
                        <span class="text-secondary-foreground">{userProfile.currentProgram}</span>
                    </div>
                    {/if}
                    <div class="flex items-center space-x-2 text-sm">
                        <Calendar class="h-4 w-4 text-secondary-foreground"/>
                        <span class="text-muted-foreground">
                            Joined {new Date(userProfile.joinDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <p class="text-sm text-secondary-foreground mb-6">
                    {userProfile.bio}
                </p>

                <!-- profile statistics -->
                <div class="grid grid-cols-4 gap-2 mb-6">
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
                        class={`w-full`}
                        variant={`${isFollowing ? 'secondary' : 'primary'}`}
                        >
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button
                        class={`w-full items-center flex`}>
                        <MessageSquare class="h-4 w-4 mr-2" />
                        Message
                    </Button>
                </div>
            </Card.Root>


        </div>
    </div>
</div>