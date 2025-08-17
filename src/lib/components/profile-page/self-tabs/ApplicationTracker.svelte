<script>
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import * as Card  from "$lib/components/ui/card";
    import { Progress } from "$lib/components/ui/progress";
    import { applications } from "../test";


    let { applicationsData } = $props()
</script>


<div class="space-y-4">
    <h3 class="text-lg font-semibold text-foreground">
        My Tracked Applications
    </h3>
    {#each applicationsData as app}
        <Card.Root key={app.id} class="gap-2 p-5">
            <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-foreground">{app.title}</h4>
                <Badge class="text-xs">
                    {app.status.replace('-', ' ').toUpperCase()}
                </Badge>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm text-secondary-foreground mb-3">
                <div>
                    <span class="font-medium">Type:</span>
                    <span class="ml-2 capitalize">{app.type}</span>
                </div>
                <div>
                    <span class="font-medium">Deadline:</span>
                    <span class="ml-2 capitalize">{new Date(app.deadline).toLocaleDateString()}</span>
                </div>
                {#if app.submitted}
                    <div>
                        <span class="font-medium">Submitted:</span>
                        <span class="ml-2 capitalize">{new Date(app.submitted).toLocaleDateString()}</span>
                    </div>
                {/if}
                <!-- <div>
                    <span class="font-medium">Progress:</span>
                    <span class="ml-2 capitalize">{app.progress}</span>
                </div> -->
            </div>
            <Progress class="w-full mb-3" value={app.progress}/>
            <div class="flex space-x-2">
                <Button variant='secondary' class="text-sm">
                    View Details
                </Button>
                {#if app.status === 'in-progress'}
                    <Button href="#" variant='primary' class="text-sm">
                        Update Status
                    </Button>
                {/if}
            </div>
        </Card.Root>
    {/each}
</div>