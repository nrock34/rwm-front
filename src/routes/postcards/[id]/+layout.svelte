<script>
    import * as Card from '$lib/components/ui/card';
    import * as Breadcrumb from '$lib/components/ui/breadcrumb';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';
    import * as Avatar from '$lib/components/ui/avatar';
    import { Calendar, User } from 'lucide-svelte';
    import { MessageSquare, MessageSquareReply, Share, Share2 } from '@lucide/svelte';
    import { Separator } from '$lib/components/ui/separator';
    import { render } from 'svelte/server';
    import Stamp from '$lib/assets/stamp.svelte';

    import FullStamp from '$lib/assets/FullStamp2.png?enhanced'
    import { Skeleton } from '$lib/components/ui/skeleton';


    /** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */

    const testImages = [
        "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg",
        "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg",
        "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg",
        "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg",
        "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg",
        "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg",
    ]

    let { data, children } = $props();

    let postcard = data.postcardData;
</script>

<div class="bg-muted w-full">

    <div class="grid grid-rows-9 relative z-1 ">
        <div class="w-full h-fit col-start-1 row-start-1 row-end-10 -z-10">
            <img
                class="rounded-b-xl w-full -z-5 h-[45vh] sm:h-[50vh] lg:h-[60vh] object-cover"
                src={postcard.banner ?? "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg"}/>

            <div 
                class="absolute top-0 w-full h-[45vh] sm:h-[50vh] lg:h-[60vh]  inset-x-0 bg-black/40"
            />

            <div 
                class="absolute inset-x-0 z-0 bottom-0 lg:bottom-0 sm:bottom-0 h-40 
                bg-gradient-to-b from-transparent via-muted/30 to-muted 
                pointer-events-none"
            >
            </div>

            <div class="absolute top-10 -right-6">
                <!-- <img src={FullStamp} class="rounded-[60px] opacity-60 w-40 h-37.5" /> -->
                
            </div>
        </div>

        <div class="px-6 sm:px-12 md:px-16 lg:px-24 xl:px-26 mx-auto w-full max-w-7xl col-start-1 row-start-1 row-end-9 flex flex-col justify-between items-start">
            <!-- breadcrumb section -->
            <div class="p-3 mt-8 flex w-full justify-between">
                <Breadcrumb.Root>
                    <Breadcrumb.List class="text-muted/70">
                        <Breadcrumb.Item>
                            <Breadcrumb.Link class="text-lg font-semibold">Home</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator/>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link class="text-lg font-semibold" href="/postcards">Postcards</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator/>
                        <Breadcrumb.Item>
                            <Breadcrumb.Page class="text-white text-lg font-semibold">{postcard.title}</Breadcrumb.Page>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
                <div class="p-3 px-5">
                    <Stamp class="w-24 h-24 -rotate-165 fill-ring/65"/>
                </div>
            </div>

            <div>
            <h1 class="p-3 text-accent text-4xl sm:text-6xl bg-white/1 rounded-xl font-bold mb-0 max-w-240">
                {postcard.title}
            </h1>
            <div class="px-3 flex items-center space-x-4 mt-2">
                {#each postcard.tags as tag, idx}
                    <span class="cursor-pointer bg-secondary/70 border border-ring/80 px-1.75 py-0.5 text-foreground/90 text-xs font-medium rounded-md">
                        #{tag.name.replace(' ', '-')}
                    </span>
                {/each}
            </div>
            </div>
        </div>
    </div>
    

    <div class="mx-auto items-start px-6 sm:px-12 md:px-16 lg:px-24 xl:px-26 max-w-[80rem] h-full mt-5">
        <svelte:boundary>
            
            {@render children()}

            {#snippet pending()}
                <div class="grid grid-cols-3 gap-8 pt-2 pb-24">
                    <div class="col-span-3 md:col-span-2 flex flex-col w-full h-full gap-y-4">
                        <Card.Root class="w-full h-10 p-0 shadow-none border-0">
                            <Skeleton class="w-full h-full bg-muted-foreground/60"></Skeleton>
                        </Card.Root>
                        <Card.Root class="w-full h-80 p-0 shadow-none border-0">
                            <Skeleton class="w-full h-full bg-muted-foreground/60"></Skeleton>
                        </Card.Root>
                    
                    </div>
                    <div class="col-span-3 md:col-span-1">
                        <Card.Root class="w-full h-80 p-0 shadow-none border-0">
                            <Skeleton class="rounded-xl w-full h-full bg-muted-foreground/60"></Skeleton>
                        </Card.Root>
                    </div>
                </div>
            {/snippet}
        </svelte:boundary>
        
    </div>

    
    
</div>

