<script>

    import * as Card from "$lib/components/ui/card";
    import { ArrowLeft, Book, Bookmark, Calendar, Camera, Clock, DollarSign, ExternalLink, Globe, Globe2, GraduationCap, Link, MapPin, Share2, Star, Users } from "lucide-svelte";
    import * as test from "./test";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import { Toggle } from "$lib/components/ui/toggle";
    import * as Tabs from "$lib/components/ui/tabs";
    import Overview from "./tabs/Overview.svelte";
    import Academics from "./tabs/Academics.svelte";
    import Housing from "./tabs/Housing.svelte";
    import Costs from "./tabs/Costs.svelte";
    import Application from "./tabs/Application.svelte";
    import Reviews from "./tabs/Reviews.svelte";
    import { Separator } from "$lib/components/ui/separator";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import * as ScrollArea  from "$lib/components/ui/scroll-area";
    import * as Dialog from "$lib/components/ui/dialog";
    // import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
    
    let { data } = $props()

    const tabs = [
        { id: 'overview', name: 'Overview', component: Overview },
        { id: 'academics', name: 'Academics', component: Academics },
        { id: 'housing', name: 'Housing', component: Housing },
        { id: 'costs', name: 'Costs', component: Costs },
        { id: 'application', name: 'Application', component: Application },
        { id: 'reviews', name: 'Reviews', component: Reviews }
    ]

    const durationLabels = [
        {id: 'sem', label: 'Semester'},
        {id: 'yr', label: 'Year'},
        {id: 'sum', label: 'Summer'},
        {id: 'brk', label: 'Break'},
        {id: 'twowks', label: '1-2 Weeks'},
        {id: 'sxwks', label: '4-6 Weeks'},
    ]

    const relatedPrograms = test.relatedPrograms
    const program = data

    let galleryImageDialogOpen = $state(false)
    let galleryImageData = $state({
        image: null,
        id: null
    })

    let pillClass = "!font-light tracking-wide rounded-full sm:!text-xs lg:text-sm bg-primary-foreground/20 sm:px-3 py-0.5 sm:py-1 border-primary-foreground/25 shadow-sm backdrop-blur h-fit"

    let isSaved = $state('');


</script>


<div class="min-w-full space-y-4 bg-ring/5 space-y-8 pb-20">

    <section class="relative overflow-hidden">
        <img 
            src={program.image}
            alt={program.title}
            class="w-full h-80 sm:h-100 lg:h-120 object-cover blur-[4px] saturate-125 brightness-90"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

        <div class="absolute inset-x-0  lg:inset-x-4 sm:inset-x-2 top-4 p-6 max-w-[80rem] mx-auto space-x-1">
            <div class="flex justify-between">
                <a
                    href="/programs"
                    class="inline-flex items-center tracking-normal font-medium text-primary-foreground hover:text-muted-foreground/80 transition-colors"
                >
                    <ArrowLeft class="h-4 w-4 mr-2"/>
                    Back To Programs
                </a>
                <div class="space-x-1">
                    <Toggle
                        variant="outline"
                        bind:pressed={isSaved}
                        class={`border-none rounded-full bg-white/60 hover:bg-white data-[state=on]:bg-primary data-[state=on]:text-foreground h-fit !p-2.5 lg:!p-3`}
                        >
                        <Bookmark class={`h-4 w-4 ${isSaved ? 'fill-current': ''}`} />
                    </Toggle>
                    <Button
                        class="bg-white/60 rounded-full hover:bg-white transition-colors !w-fit !h-fit !p-2.5 lg:!p-3"
                        href="#"    
                    >
                        <Share2 class="text-foreground h-4 w-4" />
                    </Button>
                </div>
                
            </div>
            
        </div>

        <div class="absolute inset-x-0 lg:inset-x-4 sm:inset-x-2 bottom-1 lg:bottom-2">
            <div class="max-w-[80rem] mx-auto p-6 space-y-4">
                <div class="flex items-start justify-between">
                    <div class="flex-1 flex-col flex gap-y-2 lg:gap-y-3 text-primary-foreground">
                        <span class="text-[0.6rem] sm:text-xs uppercase font-light tracking-widest">Study Abroad · {program.location.city + ', ' + program.location.country}</span>
                        <div class={`flex sm:flex-row flex-col space-y-1.5 sm:items-center`}>
                            {#if program.featured}
                                <Badge class={`!text-[0.600rem] px-1.5 !py-0.25 sm:!py-2 lg:!py-2.5 !rounded-lg !border-ring/60 !bg-primary/30 !shadow-lg !shadow-white ${pillClass}`}>
                                    Featured
                                </Badge>
                            {/if}
                            <div class="flex flex-col gap-y-0.75 justify-center items-start sm:ml-3.5">
                                <p class="text-xs tracking-normal sm:tracking-normal sm:text-sm lg:text-base leading-none">{program.provider.name}</p>
                                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-none">{program.title}</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <ScrollArea.ScrollArea class='pb-2' orientation='horizontal'>
                    
                    <div class="flex gap-x-1 sm:gap-x-3">
                        <Badge class={`!text-[0.65rem] sm:!text-xs ${pillClass}`}>
                            <Clock class="inline h-3.5 w-3.5 mr-1"/>
                            <p class="capitalize">{durationLabels.find((d) => d.id = program.duration).label}</p>
                        </Badge>
                        <Badge class={`!text-[0.65rem] sm:!text-xs ${pillClass}`}>
                            <DollarSign class="inline h-3.5 w-3.5"/>
                            <p class="capitalize">{`${program.cost.program_fee} - ${program.cost.program_fee + program.cost.accommodation_fee + program.cost.extra_fee}`}</p>
                        </Badge>

                        <Badge class={`!text-[0.65rem] sm:!text-xs ${pillClass}`}>
                            <GraduationCap class="inline h-3.5 w-3.5 mr-1"/>
                            <p class="capitalize">{program.requirements.active_credits_needed}</p>
                        </Badge>

                        <Badge class={`!text-[0.65rem] sm:!text-xs ${pillClass}`}>
                            <Globe2 class="inline h-3.5 w-3.5 mr-1"/>
                            <p class="capitalize">{program.requirements.language}</p>
                        </Badge>
                    </div>
                    <ScrollArea.ScrollAreaScrollbar class='h-1 bg-red-100'/>
                </ScrollArea.ScrollArea>
                
                <div class="flex gap-x-2 sm:gap-x-4 !text-xs pt-1 sm:pt-2">
                    <Button class="tracking-wide !text-[0.65rem] sm:!text-xs lg:text-sm bg-accent-foreground cursor-pointer border-accent-foreground border rounded-xl sm:py-6">
                        Apply Now
                    </Button>
                    <Button variant="outline" class="tracking-wide !text-[0.65rem] sm:!text-xs lg:text-sm rounded-xl text-primary-foreground backdrop-blur cursor-pointer
                                                    border-primary-foreground/60 bg-primary-foreground/20 sm:py-6">
                        Request Info
                    </Button>
                </div>
            </div>
        </div>
        
        
    </section>


    <div id="main-grid" class="w-full max-w-[80rem] grid lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 px-6 justify-self-center">
    
        <div class="lg:col-span-2 flex flex-col gap-y-8">
            <!-- Photo gallery -->
            <Card.Root class="gap-1 p-6">
                <h2 class="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Camera class="h-5 w-5 mr-2"/>
                    Photo Gallery
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Dialog.Root
                        bind:open={galleryImageDialogOpen}>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Image</Dialog.Title>
                            </Dialog.Header>
                            <img
                                src={galleryImageData.image}
                                alt={`Gallery img ${galleryImageData.id + 1}`}
                                class="w-full h-full object-cover rounded cursor-pointer"
                            />
                        </Dialog.Content>
                    </Dialog.Root>
                    {#each program.gallery as image, idx}    
                        <button
                            onclick={() => {
                                galleryImageDialogOpen = true
                                galleryImageData.id = idx
                                galleryImageData.image = image
                            }}>
                            {@render child(image, idx)}
                        </button>
                        {#snippet child(image, idx)}
                            <img
                                key={idx}
                                src={image}
                                alt={`Gallery img ${idx + 1}`}
                                class="w-full h-32 lg:h-42 object-cover rounded hover:scale-102 transition-transform cursor-pointer"
                            />
                        {/snippet}
                    {/each}
                </div>
            </Card.Root>


            <Card.Root class="py-6 md:overflow-hidden w-full order-first sm:order-none">
                <Tabs.Root value="overview" class="!min-w-0 gap-4 px-8 py-4 w-full">

                    <div class="max-w-full min-w-0">
                        <Tabs.List class="w-full items-center whitespace-nowrap h-fit gap-2 sm:gap-4 mx-0 p-1.5">
                            <div class="inline-flex flex-wrap w-full justify-start items-start gap-x-2 gap-y-1.25">
                                {#each tabs as tab}
                                    <Tabs.Trigger class="text-xs sm:text-sm h-full py-1 bg-muted-foreground/15 hover:bg-muted-foreground/60 cursor-pointer " value={tab.id}>{tab.name}</Tabs.Trigger>
                                {/each}
                            </div>
                                    
                        </Tabs.List>
                    </div> 
                    <!-- <Separator class="mt-4"/> -->
                    {#each tabs as tab}
                        {@const TabComponent = tab.component}
                        <Tabs.Content class="w-full" value={tab.id}>
                            <div class="bg-muted-foreground/10 p-8 rounded-(--radius)">
                               <TabComponent program={program}/> 
                            </div> 
                        </Tabs.Content>
                    {/each}
                </Tabs.Root>

            </Card.Root>
        </div>

        <!-- sidebar -->
        <aside class="lg:col-span-1">
            <div class="lg:sticky lg:top-25 space-y-4">
                <!-- quick actions -->
                <Card.Root class="gap-2 p-6">
                    <h3 class="font-semibold text-foreground mb-4">Quick Actions</h3>
                    <div class="space-y-3">
                        <Button class="w-full">
                            Apply Now
                        </Button>
                        <Button varirant="secondary" class="w-full">
                            More Information
                        </Button>
                    </div>
                </Card.Root>


                <!-- contact info -->
                <Card.Root class="gap-2 p-6">
                    <h3 class="font-semibold text-foreground mb-4">Contact Information</h3>
                    <div class="space-y-3 text-sm">
                        <div>
                            <p class="font-medium text-foreground">Email</p>
                            <p class="text-secondary-foreground">{program.contact.email}</p>
                        </div>
                        <div>
                            <p class="font-medium text-foreground">Phone</p>
                            <p class="text-secondary-foreground">{program.contact.phone}</p>
                        </div>
                        <div>
                            <p class="font-medium text-foreground">Website</p>
                            <a 
                                href={program.contact.website}
                                class="text-primary hover:text-primary/80 flex items-center"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Visit Website
                                <ExternalLink class="h-3 w-3" />
                            </a>
                        </div>
                        <div>
                            <p class="font-medium text-foreground">Address</p>
                            <p class="text-secondary-foreground text-xs">{program.contact.address.state}</p>
                        </div>
                    </div>
                </Card.Root>

                <!-- related programs -->
                <Card.Root class="p-6 gap-0">
                    
                    <h3 class="font-semibold text-foreground mb-4">Related Programs</h3>
                    <div class="space-y-4">
                        {#each relatedPrograms as related}
                            <div key={related.id} class="border border-border rounded p-3">
                                <div class="flex items-center justify-between">
                                    <a 
                                        href={`/programs/${related.id}`}
                                        class="font-medium text-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {related.title}
                                    </a>
                                    <a
                                        href="#"
                                        class="inline-flex items-center text-xs text-secondary p-1.5 rounded bg-primary">
                                        
                                        <ChevronRight class="h-4 w-4" />
                                    </a>  
                                </div>
                                
                                <p class="text-xs text-secondary-foreground mb-1">{related.provider}</p>
                                <div class="flex items-center justify-between text-xs">
                                    <span class="text-muted-foreground">{related.cost}</span>
                                    <div class="flex items-center space-x-1">
                                        <Star class="h-3 w-3 text-yellow-500 fill-current"/>
                                        <span>{related.rating}</span>
                                    </div>
                                </div> 
                            </div>
                        {/each}
                    </div>
                </Card.Root>
            </div>
        </aside>
    </div>
</div>