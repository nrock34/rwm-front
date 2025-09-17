<script>
  import PostcardsViewAll from './PostcardsViewAll.svelte';

    import { get } from "svelte/store";
    import * as Card from "$lib/components/ui/card";
    import * as Avatar from "$lib/components/ui/avatar";
    import AvatarImage from "$lib/components/ui/avatar/avatar-image.svelte";
    import { Eye, Filter, Heart, Search } from "lucide-svelte";
    import { innerWidth, innerHeight } from 'svelte/reactivity/window';
    import { Badge } from "$lib/components/ui/badge";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import * as Pagination from "$lib/components/ui/pagination/index.js";
    import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-svelte';
    import { goto } from '$app/navigation';

    import Stamp from '$lib/assets/stamp.svelte'

    import { page } from '$app/state';
    import { range } from '$lib/utils';
    import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
    import { getContext } from 'svelte';
 
    
    let { data } = $props()

    const perPage = 12
    let { pageCount, pageNum = 1, results } = $derived(data)
    const urlparams = $derived(page.url.searchParams)
    let searchQuery = $state('')
    let selectedRegion = $state('');
    $inspect(pageNum)
    $effect(() => {
        if (searchQuery) {
            goto(`?q=${searchQuery}`, { keepFocus: true})
        } else {
            goto(`?`, { keepFocus: true})
        }
    })

    const config = getContext('config')
    console.log(config)

    let postcardsResults = $state('')

    const regions = [
        {id: 'europe', label: 'Europe'},
        {id: 'lAmerica', label: 'Latin America'},
        {id: 'africa', label: 'Africa'},
        {id: 'asia', label: 'Asia'},
        {id: 'sAmerica', label: 'South America'}
    ]

    const featPostcard = $derived(results?.pop())
</script>

<div class="bg-muted/80">
    <section class="relative overflow-hidden">
        <img
            class="w-full h-80 sm:h-90 md:h-110 object-cover"
            alt='Postcards Banner Image'
            src={`${config?.postcardsBannerIMG ?? 'https://c.pxhere.com/photos/25/57/fog_montes_sky_mountaineering_mountain_road_mountain_panoramic_slovenia-489210.jpg!d'}`}
        />
            {console.log(featPostcard)}
        <div class="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/40 to-foreground/20 backdrop-blur-[3px]"></div>
        <div class="absolute inset-0 mx-4 sm:mx-8 md:mx-14">
            
            <div class="flex flex-col h-full w-full justify-center py-1 text-primary-foreground max-w-[90rem] py-6 px-6 sm:px-8 md:px-6  justify-self-center">
                <h6 class="text-sm tracking-widest">COLLECTION</h6>
                <h2 class="text-3xl sm:text-4xl md:text-5xl font-semibold">Explore Postcards</h2>
                <p class="text-base md:text-lg pt-2 font-light">
                    Browse curated travel stories from our community. Filter by region or author and collect your favorites.
                </p>
                {#if featPostcard}
                <div hidden class="mt-12 bg-white/70 grid grid-cols-2 p-8 m-2 min-h-60 max-w-140 ring-ring/60 ring-2 rounded-sm">
                    <div class="flex flex-col text-foreground">
                        <span class="text-xs tracking-wide font-light">
                            TOP PICK
                        </span>
                        <div>
                            <h3 class="text-lg font-medium">{featPostcard.title}</h3>
                            <p class="text-sm">{featPostcard.description}</p>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="absolute right-0 w-full space-y-2">
                            <Stamp class="w-16 h-16 fill-foreground/90 object-cover justify-self-end"/>
                            <div class="flex flex-col pl-12">
                                {#each [1, 2, 3, 4] as item, idx}
                                    {#if (idx === 1)}
                                        <p class="w-full inline-flex justify-center font-script text-foreground font-[600]  ">{featPostcard.location}</p>
                                    {:else}
                                        <p class="texm-sm">‎</p>
                                    {/if}
                                    <div class="border border-foreground/70"></div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
                {/if}
            </div>
        </div>
    </section>

    <section class="w-full max-w-[90rem] py-6 px-6 sm:px-8 md:px-6 justify-self-center ">
        <div class="grid grid-cols-6 gap-0">
            <div class="col-span-6 px-6 sm:px-8 md:px-10 lg:px-6">
                <div class="sticky top-20 pb-4 w-full">
                    <div class="px-8 space-y-3 p-2 w-full justify-self-center block flex flex-col lg:flex-row space-x-4 bg-white rounded-lg border-border border-1 ">
                        <!-- search section -->
                        <div class="space-y-1.5 w-full">
                            <h2 class="text-base font-semibold text-foreground/90 flex items-center gap-1">
                                <Search class="h-5 w-5" />
                                <span>Search</span>
                            </h2>
                            <div class="relative">
                                <Input 
                                    type='text'
                                    placeholder='type here...'
                                    value={searchQuery}
                                    oninput={(e) => {searchQuery = e.target.value}}
                                    class="!text-sm !h-fit w-full pr-4 py-1.5 border border-border/40 rounded-lg focus:ring-2 focus:ring-ring/70
                                            focus:border-transparent transition-all"
                                />

                            </div>
                        </div>

                        <!-- country category -->

                        <div class="space-y-1.5">
                            <h2 class="text-base lg:text-sm font-semibold text-foreground/90 flex items-center gap-1">
                                <Filter class="h-5 w-5"/>
                                <span>Regions</span>
                            </h2>
                            <ScrollArea orientation='horizontal'>
                                <div class="space-y-1.5 space-x-1.5 flex sm:flex-row">
                                    <Button
                                        onclick={() => {selectedRegion = 'all'}}
                                        class={` px-3 py-3 transition-colors border-1
                                            ${selectedRegion === 'all' ? 
                                            'bg-primary/90 hover:bg-primary/90 text-primary-foreground' :
                                            'bg-transparent hover:bg-primary/25 shadow-none text-foreground/80'}`}>
                                        <span class="w-full text-left text-xs">All Regions</span>
                                    </Button>
                                    {#each regions as region }
                                        <Button
                                            key={region.id}
                                            class={` px-3 py-3 transition-colors border-2 cursor-pointer
                                                ${selectedRegion === region.id ? 
                                                'bg-primary/90 hover:bg-primary/90 text-primary-foreground' :
                                                'bg-transparent hover:bg-primary/25 shadow-none text-foreground/80'}`}
                                            onclick={() => {selectedRegion = region.id}}
                                        >
                                            <span class="w-full text-xs text-left">{region.label}</span>
                                        </Button>
                                    {/each}
                                </div>
                            </ScrollArea>
                            
                        </div>

                    </div>
                </div>
            </div>
            <div class="col-span-6 w-full">

                <svelte:boundary>
                    <div class="">
                        {#if results.length}
                            <PostcardsViewAll {results} {searchQuery} {selectedRegion} > </PostcardsViewAll>
                        {:else}
                            <div class="flex flex-col justify-center items-center w-full h-full py-40">
                                <h1 class="text-2xl text-secondary-foreground font-semibold">No Postcards Found</h1>
                                <p class="text-muted-foreground">Please adjust you filters or try again later.</p>
                            </div>
                        {/if}
                    </div>
                    

                    {#snippet pending()}
                        <div class="mx-auto my-auto">
                            <h1>Loading Postcards</h1>
                        </div>
                    {/snippet}

                </svelte:boundary>

                <Pagination.Root bind:page={pageNum} count={pageCount} perPage={perPage}
                    onPageChange={(pageNum) => {
                        const searchParams = page.url.searchParams
                        searchParams.set('page', pageNum)
                        goto(`?${searchParams.toString()}`, { replaceState: true, invalidateAll: true})
                        
                    }}>
                    {#snippet children({ pages, currentPage})}
                        <Pagination.Content>
                            <Pagination.Item>
                                <Pagination.PrevButton>
                                    <ChevronLeftIcon class="size-4" />
                                    <span class="hidden sm:block">Previous</span>
                                </Pagination.PrevButton>
                            </Pagination.Item>
                            {#each pages as page (page.key)}
                                {#if page.type === "ellipsis"}
                                <Pagination.Item>
                                    <Pagination.Ellipsis />
                                </Pagination.Item>
                                {:else}
                                <Pagination.Item>
                                    <Pagination.Link {page} isActive={currentPage === page.value}>
                                        {page.value}
                                    </Pagination.Link>
                                </Pagination.Item>
                                {/if}
                            {/each}
                            <Pagination.Item>
                                <Pagination.NextButton>
                                    <span class="hidden sm:block">Next</span>
                                    <ChevronRightIcon class="size-4" />
                                </Pagination.NextButton>
                            </Pagination.Item>
                        </Pagination.Content>
                    {/snippet}
                </Pagination.Root>

            </div>
        </div>
    </section>
</div>
