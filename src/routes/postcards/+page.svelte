<script>
    import * as Card from '$lib/components/ui/card';
    import {Button} from '$lib/components/ui/button';
    import {Input} from '$lib/components/ui/input';
    import * as Select from "$lib/components/ui/select/index.js";
    import SelectGroup from '$lib/components/ui/select/select-group.svelte';
    import SelectContent from '$lib/components/ui/select/select-content.svelte';
    import { Label } from '$lib/components/ui/label/';
    import {Toggle} from '$lib/components/ui/toggle';
    import { User, Calendar1, Clock, Binoculars, Heart, Bookmark} from 'lucide-svelte';
    
    /** @type {{ data: import('./$types').PageData }} */

    let { data } = $props();

    const regionOptions = [
        { value: "europe", label: "Europe" },
        { value: "africa", label: "Africa" },
        { value: "asia", label: "Asia"},
    ]

    const sortByOptions = [
        { value: "latest", label: "Latest" },
        { value: "most-popular", label: "Most Popular" },
        { value: "most-liked", label: "Most Liked" },
        { value: "featured", label: "Featured" }
    ]

    const articles = [
        {
            "title": "Waking Up with the Sun in Santorini",
            "author": "Olivia Hart",
            "timeToRead": 6,
            "datePublished": "2025-06-28",
            "summary": "Santorini is more than just white-washed houses and blue domes. In this postcard, I take you through a sunrise walk along the caldera, a surprise breakfast in a cliffside café, and the unexpected kindness of a Greek grandmother who gifted me figs from her garden. It's a slow morning in paradise that reminded me why travel is really about connection.",
            "tags": ["Greece", "Mediterranean", "slow travel"],
            "views": 1348,
            "likes": 223,
            img: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg"
        },
        {
            "title": "Rainy Streets and Sweet Tea in Kyoto",
            "author": "Marcus Lane",
            "timeToRead": 7,
            "datePublished": "2025-06-26",
            "summary": "Kyoto in the rain has a poetry all its own. I wandered Gion's empty alleys beneath a paper umbrella, the scent of wet wood and jasmine in the air. A stranger invited me into his tea shop for shelter and conversation. We didn’t speak the same language, but tea, like travel, transcends words. This postcard is about quiet, grace, and fleeting moments.",
            "tags": ["Japan", "cultural travel", "rainy days"],
            "views": 987,
            "likes": 174,
            img: "https://images.pexels.com/photos/1310788/pexels-photo-1310788.jpeg",
        },
        {
            "title": "Desert Silence in Wadi Rum",
            "author": "Sasha Noor",
            "timeToRead": 5,
            "datePublished": "2025-06-22",
            "summary": "In Jordan's Wadi Rum, silence speaks. I spent a night in a Bedouin camp, watching stars rise like ancient stories above the red sand. This postcard captures a moment of stillness, a sunrise camel ride, and the magic of landscapes untouched by time. It’s about letting go of noise and listening to what the desert whispers.",
            "tags": ["Jordan", "desert travel", "camping"],
            "views": 1102,
            "likes": 192,
            img: "https://images.pexels.com/photos/106606/pexels-photo-106606.jpeg"
        },
        {
            "title": "Venice After the Tourists Leave",
            "author": "Leo Marquez",
            "timeToRead": 6,
            "datePublished": "2025-06-21",
            "summary": "There’s a side of Venice you only see when the last gondola glides home. I wandered empty piazzas lit by golden streetlamps, found a hidden bakery still warm with morning croissants, and listened to local musicians playing for no one but themselves. This postcard is a love letter to the quieter hours in a famously crowded city.",
            "tags": ["Italy", "hidden gems", "urban exploration"],
            "views": 1432,
            "likes": 251,
            img: "https://images.pexels.com/photos/847366/pexels-photo-847366.jpeg"
        },
        {
            "title": "Chasing Northern Lights in Tromsø",
            "author": "Naomi Ellis",
            "timeToRead": 7,
            "datePublished": "2025-06-18",
            "summary": "This postcard is from a night beneath Norway’s stars. In Tromsø, I waited in the cold for a sky that might never dance—until it did. Green and violet ribbons swirled overhead, reflected in frozen lakes and wide, awestruck eyes. More than just light, it was a moment that lit something inside me, too.",
            "tags": ["Norway", "winter travel", "northern lights"],
            "views": 1689,
            "likes": 312
        },
        {
            "title": "A Train Through the Andes",
            "author": "Diego Rivera",
            "timeToRead": 6,
            "datePublished": "2025-06-16",
            "summary": "From Cusco to Machu Picchu, the train snakes through green mountains and misty valleys. This postcard isn’t just about the destination—it's about the journey: markets glimpsed through open doors, children waving by the tracks, and a stranger who shared roasted corn and laughter without a word. Peru surprised me with its colors and its kindness.",
            "tags": ["Peru", "rail travel", "South America"],
            "views": 1195,
            "likes": 198
        }



    ]
    

    let regionValue = $state("")
    let sortByValue = $state("")

    const regionTriggerContent = $derived.by(() => {
        console.log(regionValue)
        return regionOptions.find((f) => f.value === regionValue)?.label || "Select a region"
    }
    );
    // const regionTriggerContent = $derived(regionOptions.find((f) => f.value === regionValue)?.label ?? "Select a region")

    const sortByTriggerContent = $derived(
        sortByOptions.find((f) => f.value === sortByValue)?.label || "Sort by..."
    );

</script>


<div class="max-w-screen overflow-hidden">

    <section class="hero-section flex h-screen items-center justify-center relative overflow-hidden">
        <div class="hero-img absolute inset-0">
            <img class="object-cover w-full h-full" src="https://images.pexels.com/photos/417239/pexels-photo-417239.jpeg" />
        </div>
        <div class="hero-overlay max-w-[650px]">
            <Card.Root class="hero-card text-slate-50 px-[3rem] py-[2.8rem]">
                <Card.Header class="">
                    <div class="feature-tags mt-[0.425rem] mb-[1.525rem]">
                        <span>Featured</span> <span>Adventure</span>
                    </div>

                    <div>
                        <h1 class="text-[2.425rem] leading-tight font-sans font-bold">
                            Exploring Sardina: A Fishy Tale
                        </h1>
                    </div>
                </Card.Header>
                <Card.Content class="">
                    <p class="tracking-normal leading-[1.7rem]">
                        Discover the hidden underground wonders of Sardinia’s most spectacular cave systems. From ancient limestone formations to crystal-clear underground lakes, these caves offer a journey through millions of years of geological history.
                    </p>
                    <div class="feature-article-meta ">
                        <span class="author">Maria Rossi</span>
                        <span class="date">Jan, 25, 2025</span>
                        <span class="other">ELI JENNINF</span>
                    </div>
                    <Button class="font-bold tracking-tight text-zinc-800" variant="secondary">Read Postcard</Button>
                </Card.Content>
            </Card.Root>
        </div> 
    </section>

    <section class="search-filter-bar bg-accent py-[20px]">

        <div class="flex flex-col lg:flex-row justify-center items-center gap-2">
            
            <div class="flex-1 max-w-md relative">

                <Input class="flex flex-row items-center gap-2 max-w-md"
                    type="search"
                    placeholder={
                        "search postcards..."
                    }
                />

            </div>

            <div class="flex items-center space-x-2">
                <Select.Root class="bg-muted-foregorund" type="single" bind:value={regionValue}>
                    <Select.Trigger>
                        {regionTriggerContent}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Region: </Select.Label>
                            {#each regionOptions as region (region.value)}
                                <Select.Item
                                    value={region.value}
                                    label={region.label}
                                    disabled={region.value === 'africa'}
                                >
                                    {region.label}
                                </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>

                <Select.Root type="single" bind:value={sortByValue}>
                    <Select.Trigger>
                        {sortByTriggerContent}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Sort By: </Select.Label>
                            {#each sortByOptions as sortBy (sortBy.value)}
                            <Select.Item
                                value={sortBy.value}
                                label={sortBy.label}
                                disabled={sortBy.value === 'africa'}
                            >
                                {sortBy.label}
                            </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            </div>

        </div>
        <div class="flex w-full mt-[1rem]">
            <Label class="mx-auto text-secondary-foreground">_ postcards found.</Label>
        </div>

    </section>

    <section class="max-w-[1100px] w-full mx-[auto] px-[4rem]">
        <div class="">
            {#each articles as article}
                <div class="flex lg:flex-row-reverse justify-center items-center flex-col gap-x-18 my-10">
                    <div class="relative lg:w-1/2 my-auto">
                        <div class="aspect-[4/3] relative flex py-auto">
                            <img class={"w-full h-full object-cover my-5"} src={article.img}/>
                        </div>
                    </div>
                    
                    <div class="flex flex-col lg:w-1/2">
                        <div class="flex flex-row gap-3">
                            {#each article.tags as tag}
                                <span class="text-sm px-1.5 py-0.5 bg-muted rounded-(--radius)">
                                    #{tag}
                                </span>
                            {/each}
                        </div>
                        <div>
                            <h1 class="text-3xl font-semibold text-primary mt-[1.25rem]">
                                {article.title}
                            </h1>
                            <p class="text-md text-foreground font-light mt-[1rem]">
                                {article.summary}
                            </p>
                        </div>
                        <div class="flex lg:flex-col flex-row lg:space-y-[0.2rem] text-sm text-secondary-foreground mt-[2rem]">
                            <p class="lg:w-full w-1/2 flex flex-row space-x-6">
                                <span class="flex flex-row space-x-2 items-center">
                                    <User size='22'/>
                                    <span class="text-nowrap">{article.author}</span>
                                </span>
                                <span class="flex flex-row space-x-2 items-center">
                                    <Calendar1 size='20'/>
                                    <span class="text-nowrap">{article.datePublished}</span>
                                </span>
                                <span class="flex flex-row space-x-2 items-center">
                                    <Clock size='20'/>
                                    <span class="text-nowrap">{article.timeToRead} min.</span>
                                </span>
                            </p>
                            <p class="lg:w-full w-1/2 flex flex-row space-x-3 lg:justify-start justify-end">
                                <span class="flex flex-row space-x-1.5 items-center">
                                    <Binoculars size='20'/>
                                    <span>{article.views}</span>
                                </span>
                                <span class="flex flex-row jusitfy-center items-center">
                                    <Toggle>
                                        <Heart size='28'/>
                                        <span>{article.likes}</span>
                                    </Toggle>
                                    
                                </span>
                                <span class="flex flex-row items-center">
                                    <Toggle class="font-normal" aria-label="Toggle">
                                        <Bookmark />
                                        Bookmark 
                                    </Toggle>
                                </span>
                            </p>
                        </div>
                        
                    </div>
                </div>
            {/each}
        </div>
    </section>

</div>