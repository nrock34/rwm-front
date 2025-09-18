<script>
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import * as Card  from "$lib/components/ui/card";
    import { Progress } from "$lib/components/ui/progress";
    import { applications } from "../test";
    import Separator from "$lib/components/ui/separator/separator.svelte";


    let { applicationsData } = $props()
</script>


 <Card.Root class="p-0 gap-3 ">
    <div class="flex justify-between items-center pt-3 px-6">
        <h3 class="text-md font-semibold text-foreground">
            Application Tracker
        </h3>
        <div class="bg-primary/90 flex w-6 rounded-lg justify-center items-center ">
            <span class="text-secondary font-semibold text-sm">
                {applicationsData.length}
            </span>
        </div>
    </div>
    <Separator class="m-0 p-0" />
    <div class="divide-y">
        {#each applicationsData.slice(0, 4) as app, idx}
            <div key={idx} class="flex justify-center items-center space-x-6 px-6 pt-1 py-4">
                <div class="w-full">
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

                        <div class="flex flex-col items-end">
                            <p class="text-xs text-foreground/80 font-medium">
                                Type: <span class="capitalize">{app.type}</span>
                            </p>
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
                <div>
                    <Button class="shadow-none h-7 w-20 hover:bg-transparent font-normal hover:font-semibold hover:text-foreground cursor-pointer" variant='outline'>
                        <span class="mx-3 text-xs">Detail</span>
                    </Button>
                </div>
            </div>
            
            {#if !(idx + 1 === applicationsData.length)}
                <Separator />
            {/if}
            
        {/each}
    </div>
</Card.Root>


