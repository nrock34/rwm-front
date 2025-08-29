<script>
    import * as Card from "$lib/components/ui/card";
    import { getActivityIcon } from "../helper-funcs";
    import { recentActivity } from "../test";

    let { activityData } = $props()
</script>


<div class="space-y-4">
    <h3 class="text-lg font-semibold text-foreground">Your Activity History</h3>
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
</div>