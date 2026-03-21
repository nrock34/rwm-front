<script>
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { getActivityIcon } from "../helper-funcs";
    import { Compass, MessageSquareMore } from "lucide-svelte";

    let { activityData = [] } = $props()
</script>


<div class="space-y-4">
    <h3 class="text-lg font-semibold text-foreground">Your Activity History</h3>
    {#if activityData.length === 0}
        <Card.Root class="gap-4 border-dashed p-8 text-center">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <MessageSquareMore class="h-6 w-6 text-primary" />
            </div>
            <div class="space-y-2">
                <h4 class="text-base font-semibold text-foreground">No activity yet</h4>
                <p class="mx-auto max-w-md text-sm text-secondary-foreground">
                    Join the community to start posting, replying, and building your activity history here.
                </p>
            </div>
            <div class="flex justify-center">
                <Button href="/community" class="gap-2">
                    <Compass class="h-4 w-4" />
                    Go to Community
                </Button>
            </div>
        </Card.Root>
    {:else}
        {#each activityData as activity}
            {@const ActivityIcon = getActivityIcon(activity.type)}
            <Card.Root class="gap-0 p-4">
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <ActivityIcon class="h-4 w-4 text-primary"/>
                        </div>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-foreground">
                            You {activity.action} <span class="font-medium">"{activity.target}"</span>
                            {#if activity.user}
                                <span> by {activity.user}</span>
                            {/if}
                        </p>
                        <p class="text-xs text-secondary-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            </Card.Root>
        {/each}
    {/if}
</div>
