<script>
    import { Badge } from "$lib/components/ui/badge";
    import * as Card from "$lib/components/ui/card";
    import { Progress } from "$lib/components/ui/progress";
    import { getActivityIcon } from "../helper-funcs";
    import {  recentActivity, savedItems } from "../test";


    let { applicationsData, activityData } = $props()

</script>


<div class="space-y-6">

    <!-- quick stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card.Root class="gap-0 p-3">
            <div class="text-2xl font-bold text-primary">{savedItems.length}</div>
            <div class="text-sm text-muted-foreground">Saved Items</div>
        </Card.Root>
        <Card.Root class="gap-0 p-3">
            <div class="text-2xl font-bold text-primary">{applicationsData.length}</div>
            <div class="text-sm text-muted-foreground">Applications</div>
        </Card.Root>
        <Card.Root class="gap-0 p-3">
            <div class="text-2xl font-bold text-primary">N/A</div>
            <div class="text-sm text-muted-foreground">Posts</div>
        </Card.Root>
        <Card.Root class="gap-0 p-3">
            <div class="text-2xl font-bold text-primary">N/A</div>
            <div class="text-sm text-muted-foreground">Member Since</div>
        </Card.Root>
    </div>

    <!-- app status -->
    <Card.Root class="p-6 gap-2">
        <h3 class="text-lg font-semibold text-foreground mb-4">
            Application Tracker
        </h3>
        <div class="space-y-4">
            {#each applicationsData.slice(0, 4) as app, idx}
                <div key={idx} class="border border-border rounded p-4">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="font-medium text-md text-foreground">{app.title}</h4>
                        <Badge class={`text-xs py-0.5`}>
                            {app.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                    </div>
                    <div class="flex items-center justify-between text-sm text-secondary-foreground mb-2">
                        <span>Deadline: {new Date(app.deadline).toLocaleDateString()}</span>
                        {#if app.submitted}
                            <span>Submitted: {new Date(app.submitted).toLocaleDateString()}</span>
                        {/if}
                        
                    </div>
                    <Progress class="mb-1.5" value={app.progress} />
                </div>
            {/each}
        </div>
    </Card.Root>

    <!-- activity -->

    <Card.Root class="gap-1 p-8">
        <h3 class="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div class="space-y-4">
            {#each activityData.slice(0, 5) as activity, idx}
                {@const ActivityIcon = getActivityIcon(activity.type)}
                <div key={idx} class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <ActivityIcon class="h-4 w-4 text-primary"/>
                        </div>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-foreground">
                            You {activity.action.replace('-', ' ')} <span class="font-medium">"{activity.target}"</span>
                            {#if activity.user}
                                <span> by {activity.user}</span>
                            {/if}
                        </p>
                        <p class="text-xs text-secondary-foreground">{activity.timestamp}</p>
                    </div>
                </div>
            {/each}
        </div>
    </Card.Root>
</div>