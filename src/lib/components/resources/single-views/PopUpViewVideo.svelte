<script>

    import * as Dialog from '$lib/components/ui/dialog';
    import { buttonVariants } from "$lib/components/ui/button";
    import {Badge} from "$lib/components/ui/badge"
    import {Button} from "$lib/components/ui/button"
    import { ArrowDownToLine } from "lucide-svelte";

    let {resource} = $props();

</script>


<Dialog.Root class="w-6xl">
    <Dialog.Trigger class={buttonVariants({variant: "secondary"})}>
        Open
    </Dialog.Trigger>
    <Dialog.Content class="max-w-7xl min-w-3xl h-[500px] gap-0">
        <div class="flex flex-col h-full">
            <div class="mt-2 mx-5 gap-0">
                <div class="flex items-center space-x-3 m-0">
                    <span class="font-semibold">{resource.title}</span>
                    {#if resource.featured}
                        <Badge class="">
                            Featured
                        </Badge>
                    {/if}
                </div>
                <span class="text-xs m-0">{resource.description}</span>
            </div>
            
            <div class="h-full m-5">
                <video class="mx-auto" width="200" controls height="400" src="https://media.geeksforgeeks.org/wp-content/uploads/20190616234019/Canvas.move_.mp4"/>
            </div>

            <div class="text-center">
                <Button>
                    <ArrowDownToLine class="w-4 h-4" />
                    Download
                </Button>
            </div>
        </div>
        
    </Dialog.Content>
</Dialog.Root>