<script>
    import { Badge } from "$lib/components/ui/badge";
    import * as Card from "$lib/components/ui/card";
    import { Progress } from "$lib/components/ui/progress";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import { ExternalLink, Share } from "lucide-svelte";
    import { getActivityIcon } from "../helper-funcs";
    import {  recentActivity, savedItems } from "../test";


    let { applicationsData, activityData } = $props()
    const profileStats = [
        {stat: 'Saved Items', value: savedItems.length},
        {stat: 'Applications', value: applicationsData.length},
        {stat: 'Posts', value: 0},
        {stat: 'Member Since', value: 0}
    ]

</script>


<div class="space-y-6">

    <!-- quick stats -->
    <Card.Root class="gap-2 py-3">
        <h1 class="px-6 text-foreground text-md font-semibold">Profile Stats</h1>
        <Separator class="mb-2"/>
        <div class=" px-6 grid grid-cols-2 md:grid-cols-4 gap-4 pb-2">
            {#each profileStats as stat, idx}
                <Card.Root class={`${stat.value ? 'bg-secondary/40' : 'bg-muted-foreground/15'} border-none shadow-none p-2.5`}>
                    <div class={`flex flex-col justify-center items-center ${stat.value ? 'text-accent-foreground' : 'text-foreground/70'}`}>
                        <span class="font-bold text-xl">{stat.value ?? 'N/A'}</span>
                        <span class={`text-xs font-medium`}>{stat.stat}</span>
                    </div>
                </Card.Root>
            {/each}
        </div>
    </Card.Root>
    

    <!-- app status -->
    <Card.Root class="p-0 gap-3 ">
        <div class="flex justify-between items-center pt-3 px-6">
            <h3 class="text-md font-semibold text-foreground">
                Application Tracker
            </h3>
            <a 
                data-sveltekit-preload-data
                href="/profile/applications"
                class="flex justify-center items-center space-x-1"
            >
                <ExternalLink class="w-4" />
                <span class="text-xs text-secondary-foregorund">View All</span>
            </a>
        </div>
        
        <Separator class="m-0 p-0" />
        <div class="divide-y">
            {#each applicationsData.slice(0, 4) as app, idx}
                <div key={idx} class="px-6 pt-1 py-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center justify-center space-x-3">
                            <Badge class={`tracking-tight text-[0.625rem] py-[0.075rem] bg-secondary text-accent-foreground rounded-xl`}>
                                {app.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <div>
                                <h4 class="font-medium text-[0.95rem] text-foreground">{app.title}</h4>
                                <p class="text-xs text-secondary-foreground">{app.provider}</p>
                            </div>
                        </div>

                        <div class="flex">
                            <p class="text-xs text-muted-foreground">
                                {#if app.submitted && app.progress === 100}
                                    Submitted: {new Date(app.submitted).toLocaleDateString()}
                                {:else}
                                    Due: {new Date(app.deadline).toLocaleDateString()}
                                {/if}
                            </p>
                        </div>
                    </div>

                    <div class="flex justify-center items-center space-x-2 pl-6">
                        <Progress class="" value={app.progress} />
                        <span class="text-[0.725rem] text-secondary-foreground w-10 text-right">{app.progress}%</span>
                    </div>

                </div>
                {#if !(idx + 1 === applicationsData.length)}
                    <Separator />
                {/if}
            {/each}
        </div>
    </Card.Root>

    <!-- activity -->

    <Card.Root class="gap-1 p-0 py-4">
        <h3 class="text-md font-semibold text-foreground mb-2 px-6">Recent Activity</h3>
        <Separator />
        <div class="space-y-4 divide-y mt-2 px-6">
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
                        <p class="text-xs text-secondary-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            {/each}
        </div>
    </Card.Root>
</div>