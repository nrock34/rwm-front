<script>
    import { Check } from "lucide-svelte";
    import * as Card from "../ui/card";
    import { Toggle } from "../ui/toggle";
    import { SvelteSet } from 'svelte/reactivity';
    let { scholarship } = $props();

    let completedAppReqs = $state(new SvelteSet());
    const updateCompletedAppReq = (id) => {
        if (!completedAppReqs.delete(id)) completedAppReqs.add(id);
    };

    const requirements = $derived(Array.isArray(scholarship.requirements) ? scholarship.requirements : []);
</script>

 <Card.Root class="p-5 px-6 gap-0 border-primary/20 bg-primary/5">
    <div class="mb-4">
        <h2 class="text-lg font-semibold text-foreground">Application Requirements</h2>
        <p class="mt-1 text-[0.85rem] text-muted-foreground">Check off items as you prepare your application.</p>
    </div>
    <div class="space-y-2">
        {#each requirements as requirement, idx}
            {@const isSelected = completedAppReqs.has(requirement.id)}
            <div class="flex items-center space-x-2">
                <Toggle
                    size='sm'
                    pressed={completedAppReqs.has(requirement.id)} 
                    onPressedChange={() => updateCompletedAppReq(requirement.id)}
                    variant="outline">

                    <Check class={completedAppReqs.has(requirement.id) ? '' : 'hidden'}/>
                </Toggle>
                <span class="text-[0.92rem] text-muted-foreground"> {requirement.req} </span>
            </div>
        {/each}
    </div>
</Card.Root>
