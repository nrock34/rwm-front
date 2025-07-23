<script>

    import * as Card from "$lib/components/ui/card";
    import { ArrowLeft, Book, Bookmark, Calendar, Camera, DollarSign, ExternalLink, Globe, GraduationCap, Link, MapPin, Share2, Star, Users } from "lucide-svelte";
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


    const tabs = [
        { id: 'overview', name: 'Overview', component: Overview },
        { id: 'academics', name: 'Academics', component: Academics },
        { id: 'housing', name: 'Housing', component: Housing },
        { id: 'costs', name: 'Costs', component: Costs },
        { id: 'application', name: 'Application', component: Application },
        { id: 'reviews', name: 'Reviews', component: Reviews }
    ]

    const relatedPrograms = test.relatedPrograms
    const program = test.program
    let isSaved = $state('');


</script>


<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- back navigation -->
    <div class="mb-6">
        <a
            href="/programs"
            class="inline-flex items-center text-secondary-foreground hover:foreground transition-colors"
        >
            <ArrowLeft class="h-4 w-4 mr-2"/>
            Back To Programs
        </a>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
    
        <div class="lg:col-span-2 space-y-8">

            <Card.Root class="py-0 gap-0 overflow-hidden">
                <div class="relative">
                    <img 
                        src={program.image}
                        alt={program.title}
                        class="w-full h-64 object-cover"
                    />
                    {#if program.featured}
                        <div class="absolute top-4 left-4">
                            <Badge>
                                Featured
                            </Badge>
                        </div>
                    {/if}
                    <div class="absolute top-4 right-4 flex space-x-2">
                        <Toggle
                            variant="outline"
                            bind:pressed={isSaved}
                            class={`border-none rounded-full bg-white/60 hover:bg-white data-[state=on]:bg-primary data-[state=on]:text-foreground `}
                            >
                            <Bookmark class={`h-4 w-4 ${isSaved ? 'fill-current': ''}`} />
                        </Toggle>
                        <Button
                            class="bg-white/60 rounded-full hover:bg-white transition-colors"
                            href="#"    
                        >
                            <Share2 class="text-foreground h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <h1 class="text-2xl font-bold text-foreground">{program.title}</h1>
                            <p class="text-secondary-foreground mb-2.5">{program.provider}</p>
                            <div class="flex items-center space-x-4 text-sm text-secondary-foreground">
                                <div class="flex items-center space-x-1">
                                    <MapPin class="h-3 w-3"/>
                                    <span>{program.location}</span>
                                </div>
                                <div class="flex items-center space-x-1">
                                    <Star class="h-3 w-3 text-yellow-500 fill-current"/>
                                    <span class="font-medium">{program.location}</span>
                                </div>
                                <div class="flex items-center space-x-1">
                                    <Users class="h-3 w-3"/>
                                    <span>{program.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div class="flex items-center space-x-2">
                            <Calendar class="h-4 w-4 text-muted-foreground"/>
                            <div>
                                <p class="text-sm font-medium capitalize">{program.duration}</p>
                                <p class="text-xs text-secondary-foreground">Duration</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <DollarSign class="h-4 w-4 text-muted-foreground"/>
                            <div>
                                <p class="text-sm font-medium capitalize">{program.cost}</p>
                                <p class="text-xs text-secondary-foreground">Total Cost</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <GraduationCap class="h-4 w-4 text-secondary-foreground"/>
                            <div>
                                <p class="text-sm font-medium capitalize">{program.requirements.credits}</p>
                                <p class="text-xs text-secondary-foreground">Credits</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <Globe class="h-4 w-4 text-secondary-foreground"/>
                            <div>
                                <p class="text-sm font-medium capitalize">{program.requirements.language}</p>
                                <p class="text-xs text-muted-foreground">Language</p>
                            </div>
                        </div>
                    </div>

                    <p class="text-muted-foreground">{program.description}</p>
                </div>
            </Card.Root>


            <!-- Photo gallery -->
            <Card.Root class="gap-1 p-6">
                <h2 class="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Camera class="h-5 w-5 mr-2"/>
                    Photo Gallery
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {#each program.gallery as image, idx}
                        <img
                            key={idx}
                            src={image}
                            alt={`Gallery img ${idx + 1}`}
                            class="w-full h-32 object-cover rounded hover:scale-105 transition-transform cursor-pointer"
                        />
                    {/each}
                </div>
            </Card.Root>


            <Card.Root class="py-6 overflow-hidden">
                <Tabs.Root value="overview" class="gap-0 w-full">
                    <Tabs.List class="bg-accent-foreground/20 space-x-4 py-2 px-2 mx-8">
                        {#each tabs as tab}
                            <Tabs.Trigger class="py-3" value={tab.id}>{tab.name}</Tabs.Trigger>
                        {/each}
                    </Tabs.List>
                    <!-- <Separator class="mt-4"/> -->
                    {#each tabs as tab}
                        {@const TabComponent = tab.component}
                        <Tabs.Content class="w-full p-8" value={tab.id}>
                            <div class="bg-accent-foreground/5 p-8 rounded-(--radius)">
                               <TabComponent {program}/> 
                            </div> 
                        </Tabs.Content>
                    {/each}
                </Tabs.Root>

            </Card.Root>
        </div>

        <!-- sidebar -->
        <div class="space-y-6">

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
                        <p class="text-secondary-foreground text-xs">{program.contact.address}</p>
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
    </div>
</div>