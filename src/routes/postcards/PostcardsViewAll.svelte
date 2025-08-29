<script>
    import { get } from "svelte/store";
    import * as Card from "$lib/components/ui/card";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Eye, Filter, Heart, MapPin, MapPinned, Pin, Search } from "lucide-svelte";
    import { innerWidth, innerHeight } from 'svelte/reactivity/window';
    import { Badge } from "$lib/components/ui/badge";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import { getPostcards } from "./data.remote";

    import { AspectRatio } from "$lib/components/ui/aspect-ratio"
    import Stamp from "$lib/assets/stamp.svelte";
    import stampSvg from "$lib/assets/stamp.svg?raw";

    

    let searchQuery = $state('');
    let selectedRegion = $state('');

    const regions = [
        {id: 'europe', label: 'Europe'},
        {id: 'lAmerica', label: 'Latin America'},
        {id: 'africa', label: 'Africa'},
        {id: 'asia', label: 'Asia'},
        {id: 'sAmerica', label: 'South America'}
    ]

    let { results } = $props()

    let pageNumber = $state(1)

</script>

<div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-12 w-full h-full px-6 sm:px-8 md:px-10 lg:px-6">
    {#each results as item, idx1}

        <!-- <AspectRatio ratio = {16/12}> -->
            <Card.Root class={` md:py-2 md:px-2 px-4 py-4 shadow-none rounded-xs h-full w-full bg-ring/10`}>
                <div class="div flex flex-col h-full bg-gray-300">
                    <div class="relative h-32 w-full">
                        <img class="object-cover h-full w-full" src={"https://images.pexels.com/photos/32802434/pexels-photo-32802434.jpeg"}/>
                        <div class="absolute left-0 top-0">
                            <div class={`flex p-3.25`}>
                                <span class="flex gap-x-1 items-center bg-muted/30 px-2 py-0.75 rounded-xl backdrop-blur">
                                    <p class="text-xs font-semibold tracking-normal">{item.region}</p>
                                    <Pin strokeWidth={1.25} class="w-4 h-4 text-foreground fill-red-400" />
                                </span>
                            </div>
                        </div>
                        <div class="absolute top-0 right-0 p-3">
                            <Stamp class="w-11 h-11 fill-red-400/70"/>
                        </div>
                    </div>
                    <!-- <div class="absolute inset-0 object-cover bg-muted/35 h-full w-full" src={item.image}/> -->
                    <div class={`grid grid-cols-3 md:gap-4 gap-8 h-full w-full px-8 py-7 md:px-4 md:py-4 ${item.featured ? 'md:pt-2 pt-5' : 'md:pt-4 pt-7'} backdrop-blur`}>
                        <div class={`flex flex-col justify-between h-full col-span-2`}>
                            <div class="h-max">
                                <span>
                                    {#if item.featured}
                                    <span class="text-xs tracking-wider">Featured</span>
                                    {/if}
                                    <h3 class="font-semibold tracking-normal leading-tight text-sm sm:text-base lg:text-lg 2xl:text-">{item.title}</h3>
                                </span>
                                <p class={`pt-0.5 max-h-max overflow-hidden line-clamp-4 leading-tight text-xs sm:text-sm `}>{item.description}</p>
                            </div>
                            <div class="py-1 pt-2">
                                <span class="flex items-center space-x-1.5 text-sm">
                                    <Avatar.Root class="w-6 h-6">
                                        <Avatar.Fallback>
                                            {item.author.name.slice(0, 1)}
                                        </Avatar.Fallback>
                                        <Avatar.Image class="" src={item.author.avatar}/>
                                    </Avatar.Root>
                                    <p class="text-xs md:text-xs sm:text-base">{item.author.name}</p>
                                </span>
                            </div>
                        </div>
                        <div class="h-full flex flex-col justify-between items-end">
                            <div class="divide-y-1 divide-secondary-foreground flex flex-col w-full pt-2 pl-1" >
                                {#each [1, 2, 3, 4] as line, idx}
                                    {#if idx === 0}
                                        <p class="inline-flex justify-center w-full text-sm capitalize font-medium tracking-wide font-script">{item.location.city}, </p>
                                    {:else if idx === 1}
                                        <p class="inline-flex justify-center w-full text-sm capitalize font-bold tracking-wide font-script">{item.location.country}</p>
                                    {:else }
                                        <p class="text-sm">‎</p>
                                    {/if}
                                {/each}
                            </div>

                            <div class="">
                                <Button
                                    class="text-xs !py-1.5 sm:!py-2.5 lg:!py-3 !h-fit"
                                    href={`/postcards/${item.id}`}
                                    >Read more</Button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </Card.Root>
        <!-- </AspectRatio> -->
    {/each}
</div>

