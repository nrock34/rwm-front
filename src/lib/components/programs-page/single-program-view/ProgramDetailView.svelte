<script>

    import * as Card from "$lib/components/ui/card";
    import {
        ArrowLeft,
        Bookmark,
        Clock,
        DollarSign,
        Globe2,
        GraduationCap,
        Share2
    } from "lucide-svelte";
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
    import * as ScrollArea from "$lib/components/ui/scroll-area";
    import PhotoGalleryCard from "./cards/PhotoGalleryCard.svelte";
    import QuickActionsCard from "./cards/QuickActionsCard.svelte";
    import ContactInformationCard from "./cards/ContactInformationCard.svelte";
    import ResilientImage from "$lib/components/shared/ResilientImage.svelte";

    let { data } = $props();

    const tabs = [
        { id: "overview", name: "Overview", component: Overview },
        { id: "academics", name: "Academics", component: Academics },
        { id: "housing", name: "Housing", component: Housing },
        { id: "costs", name: "Costs", component: Costs },
        { id: "application", name: "Application", component: Application },
        { id: "reviews", name: "Reviews", component: Reviews }
    ];

    const durationLabels = [
        { id: "sem", label: "Semester" },
        { id: "yr", label: "Year" },
        { id: "sum", label: "Summer" },
        { id: "brk", label: "Break" },
        { id: "twowks", label: "1-2 Weeks" },
        { id: "sxwks", label: "4-6 Weeks" }
    ];

    const program = data;
    const durationLabel = $derived(
        durationLabels.find((item) => item.id === program?.duration)?.label ?? program?.duration ?? "Unknown"
    );
    const locationLabel = $derived(
        [program?.location?.city, program?.location?.country].filter(Boolean).join(", ") || "Location TBD"
    );
    const providerName = $derived(program?.provider?.name || "Program Provider");
    const totalProgramCost = $derived(
        (program?.cost?.program_fee ?? 0) +
            (program?.cost?.accommodation_fee ?? 0) +
            (program?.cost?.extra_fee ?? 0)
    );
    const creditsNeeded = $derived(program?.requirements?.active_credits_needed || "TBD");
    const languageRequirement = $derived(program?.requirements?.language || "TBD");
    const applyHref = $derived(program?.applicationLink ?? undefined);
    const infoHref = $derived(program?.infoLink ?? program?.applicationLink ?? undefined);

    const pillClass =
        "!font-light tracking-wide rounded-full sm:!text-xs lg:text-sm bg-primary-foreground/20 sm:px-3 py-0.5 sm:py-1 border-primary-foreground/25 shadow-sm backdrop-blur h-fit";

    let isSaved = $state(false);

</script>


<div class="min-w-full bg-ring/5 space-y-8 pb-20">

    <section class="relative overflow-hidden">
        <ResilientImage 
            src={program.image}
            fallbackSrc="https://images.pexels.com/photos/28838309/pexels-photo-28838309.jpeg"
            alt={program.title}
            class="w-full h-80 sm:h-100 lg:h-120 object-cover blur-[4px] saturate-125 brightness-90"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

        <div class="page-detail-shell absolute inset-x-0 top-4 mx-auto space-x-1 p-6 sm:inset-x-2 lg:inset-x-4">
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
            <div class="page-detail-shell mx-auto space-y-4 p-6">
                <div class="flex items-start justify-between">
                    <div class="flex-1 flex-col flex gap-y-2 lg:gap-y-3 text-primary-foreground">
                        <span class="text-[0.6rem] sm:text-xs uppercase font-light tracking-widest">Study Abroad · {locationLabel}</span>
                        <div class={`flex sm:flex-row flex-col space-y-1.5 sm:items-center`}>
                            {#if program.featured}
                                <Badge class={`!text-[0.600rem] px-1.5 !py-0.25 sm:!py-2 lg:!py-2.5 !rounded-lg !border-ring/60 !bg-primary/30 !shadow-lg !shadow-white ${pillClass}`}>
                                    Featured
                                </Badge>
                            {/if}
                            <div class="flex flex-col gap-y-0.75 justify-center items-start sm:ml-3.5">
                                <p class="text-xs tracking-normal sm:tracking-normal sm:text-sm lg:text-base leading-none">{providerName}</p>
                                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-none">{program.title}</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <ScrollArea.ScrollArea class='pb-2' orientation='horizontal'>
                    
                    <div class="flex gap-x-1 sm:gap-x-3">
                        <Badge class={`text-meta-xs sm:!text-xs ${pillClass}`}>
                            <Clock class="inline h-3.5 w-3.5 mr-1"/>
                            <p class="capitalize">{durationLabel}</p>
                        </Badge>
                        <Badge class={`text-meta-xs sm:!text-xs ${pillClass}`}>
                            <DollarSign class="inline h-3.5 w-3.5"/>
                            <p class="capitalize">{`${totalProgramCost}`}</p>
                        </Badge>

                        <Badge class={`text-meta-xs sm:!text-xs ${pillClass}`}>
                            <GraduationCap class="inline h-3.5 w-3.5 mr-1"/>
                            <p class="capitalize">{creditsNeeded}</p>
                        </Badge>

                        <Badge class={`text-meta-xs sm:!text-xs ${pillClass}`}>
                            <Globe2 class="inline h-3.5 w-3.5 mr-1"/>
                            <p class="capitalize">{languageRequirement}</p>
                        </Badge>
                    </div>
                    <ScrollArea.ScrollAreaScrollbar class='h-1 bg-red-100'/>
                </ScrollArea.ScrollArea>
                
                <div class="flex gap-x-2 sm:gap-x-4 !text-xs pt-1 sm:pt-2">
                    <Button href={applyHref} class="text-meta-xs tracking-wide sm:!text-xs lg:text-sm bg-accent-foreground cursor-pointer border-accent-foreground border rounded-xl sm:py-6">
                        Apply Now
                    </Button>
                    <Button href={infoHref} variant="outline" class="text-meta-xs tracking-wide sm:!text-xs lg:text-sm rounded-xl text-primary-foreground backdrop-blur cursor-pointer
                                                    border-primary-foreground/60 bg-primary-foreground/20 sm:py-6">
                        Request Info
                    </Button>
                </div>
            </div>
        </div>
        
        
    </section>


    <div id="main-grid" class="page-detail-shell grid w-full justify-self-center gap-6 px-6 lg:grid-cols-3 lg:gap-8 xl:gap-10">
    
        <div class="lg:col-span-2 flex flex-col gap-y-8">
            <PhotoGalleryCard gallery={program.gallery} />


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
                <QuickActionsCard {program} />
                <ContactInformationCard {program} />
            </div>
        </aside>
    </div>
</div>
