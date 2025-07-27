<script>
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



    const getCardHeights = (numOfItems, numOfCols) => {
  
        let rndDiff = () => Math.round(Math.random() * 30) + 10
        let heights = []

        let totalHeight = numOfItems * 460 + (numOfCols === 1 ? 100 : 0)
        
        for (let i = numOfItems; i > 0; i--) {
            let newHeight
            if (numOfItems > 1) {
                if (Math.round(Math.random() * 2)){
                    newHeight = Math.trunc(
                        (totalHeight / numOfItems) + rndDiff() )
                } else {
                    newHeight = Math.trunc(
                        (totalHeight / numOfItems) - rndDiff() )
                }
            } else {
                newHeight = totalHeight
            }
            heights.push(newHeight)
            totalHeight = totalHeight - newHeight
            numOfItems--;
        }
        
        return heights   
    }

    const numOfCols = $derived.by(() => {

        // console.log(innerWidth.current)

        if (innerWidth.current > 1350) {
            return 3
        } else if (innerWidth.current > 900) {
            return 2
        } else {
            return 1
        }

    })

    const postcardsToCols = (postcards, numOfColumns) => {

        let itemsPerColumn = postcards.length / numOfColumns
        let columns = []

        for (let i = 0; i < numOfColumns; i++ ){

            let itemsInCol = [...postcards.slice(0, itemsPerColumn)]
            if (postcards) {
                postcards = postcards.slice(itemsPerColumn)
            }

            columns.push(itemsInCol)

        }

        return columns
    }

    let postcards = [
        {
            id: '1',
            author: {
                name: 'Sofia Martin',
                avatar: '',
                title: 'Culinary Expert',
            },
            topic: 'Social',
            title: 'Finding the Perfect Apartment in Trastevere',
            description: 'After months of searching, I finally found my dream apartment in Rome\'s most charming neighborhood. Here\'s what I learned!',
            likes: 10,
            image: '',
            featured: true,

        },
        {
            id: '2',
            author: {
            name: 'Luca Conti',
            avatar: '',
            title: 'Architect',
            },
            topic: 'Travel',
            title: 'A Day Sailing Around the Roman Coast',
            description: 'I chartered a small boat from Ostia and spent the day exploring hidden coves and seaside villages—here’s how to plan your own coastal adventure.',
            likes: 25,
            image: '',
            featured: false,
        },
        {
            id: '3',
            author: {
            name: 'Elena Russo',
            avatar: '',
            title: 'Language Tutor',
            },
            topic: 'Education',
            title: 'Mastering Italian in the Heart of Rome',
            description: 'Immersing myself in daily conversation transformed my Italian skills. These apps, meetups, and tips made all the difference.',
            likes: 18,
            image: '',
            featured: true,
        },
        {
            id: '4',
            author: {
            name: 'Matteo Ferrari',
            avatar: '',
            title: 'Food Blogger',
            },
            topic: 'Food',
            title: 'The Best Trattorias You’ve Never Heard Of',
            description: 'Ventured off the beaten path to discover family‑run trattorias with authentic Roman dishes—here are my top 5 hidden gems.',
            likes: 32,
            image: '',
            featured: false,
        },
        {
            id: '5',
            author: {
            name: 'Giulia Bianchi',
            avatar: '',
            title: 'Art Historian',
            },
            topic: 'Culture',
            title: 'Exploring Street Art in Testaccio',
            description: 'From bold murals to tiny stencils, Testaccio’s street art scene tells a vibrant story—come along on my walking tour.',
            likes: 14,
            image: '',
            featured: true,
        },
        {
            id: '6',
            author: {
            name: 'Marco Ricci',
            avatar: '',
            title: 'Nightlife DJ',
            },
            topic: 'Nightlife',
            title: 'Top Rooftop Bars for Summer Cocktails',
            description: 'Sip spritzes with a view: my roundup of Rome’s hottest rooftop spots to catch sunset and dance under the stars.',
            likes: 47,
            image: '',
            featured: false,
        },
        {
            id: '7',
            author: {
            name: 'Chiara Greco',
            avatar: '',
            title: 'Historian',
            },
            topic: 'History',
            title: 'Unearthing Ancient Baths Beneath Rome',
            description: 'Descended into the forgotten ruins of thermal baths that pre‑date the Colosseum—what I saw will amaze you.',
            likes: 28,
            image: '',
            featured: true,
        },
        {
            id: '8',
            author: {
            name: 'Alessandro Romano',
            avatar: '',
            title: 'Photographer',
            },
            topic: 'Photography',
            title: 'Capturing Rome at Dawn',
            description: 'Woke up before sunrise to frame empty piazzas and glowing monuments—my tips for shooting the Eternal City in the golden hour.',
            likes: 22,
            image: '',
            featured: false,
        },
        {
            id: '9',
            author: {
            name: 'Valentina Esposito',
            avatar: '',
            title: 'Museum Curator',
            },
            topic: 'Art',
            title: 'Hidden Masterpieces in Small Galleries',
            description: 'Beyond the Vatican, small galleries hide astonishing works. Here’s where to find them and why they matter.',
            likes: 19,
            image: '',
            featured: false,
        },
        {
            id: '10',
            author: {
            name: 'Francesco De Luca',
            avatar: '',
            title: 'Event Planner',
            },
            topic: 'Events',
            title: 'Summer Festivals You Can’t Miss',
            description: 'From open‑air concerts to pop‑up film screenings, Rome’s summer calendar is packed—here are the dates and must‑see acts.',
            likes: 36,
            image: '',
            featured: true,
        },
        {
            id: '11',
            author: {
            name: 'Martina Fontana',
            avatar: '',
            title: 'Wellness Coach',
            },
            topic: 'Lifestyle',
            title: 'Morning Yoga Spots Overlooking the City',
            description: 'Stretch at dawn with views of the rooftops—my guide to the best parks and terraces for a mindful start to your day.',
            likes: 13,
            image: '',
            featured: false,
        },
        {
            id: '12',
            author: {
            name: 'Martina Fontana',
            avatar: '',
            title: 'Wellness Coach',
            },
            topic: 'Lifestyle',
            title: 'Morning Yoga Spots Overlooking the City',
            description: 'Stretch at dawn with views of the rooftops—my guide to the best parks and terraces for a mindful start to your day.',
            likes: 13,
            image: '',
            featured: false,
        },
    ]

    let searchQuery = $state('');
    let selectedRegion = $state('');

    const regions = [
        {id: 'europe', label: 'Europe'},
        {id: 'lAmerica', label: 'Latin America'},
        {id: 'africa', label: 'Africa'},
        {id: 'asia', label: 'Asia'},
        {id: 'sAmerica', label: 'South America'}
    ]

    const alignedPostcards = $derived(postcardsToCols(postcards, numOfCols))
    console.log(alignedPostcards)

</script>


<div class="grid grid-cols-50 max-w-[100vw] overflow-hidden">

    <div class="bg-secondary/20 col-span-11 sm:col-span-50 lg:col-span-10 flex flex-col w-full border-accent-foreground/30">

        <div class="border-border rounded-lg bg-secondary/40 mx-5 mt-6 mb-1 text-left space-y-1.5 p-4 flex flex-col items-start">
            <h1 class=" text-3xl font-bold trailing-tight">
                postcards
            </h1>
            <p class="ml-0.75 font-medium text-sm trailing-tight">
                have look through some of the memories/stories/trips shared by others {'<3'}
            </p>
        </div>

        <div class="p-4 px-8 space-y-6 w-full lg:block sm:flex space-x-4">

            <!-- serach section -->
            <div class="space-y-3 lg:w-full sm:w-[35%]">
                <h2 class="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                    <Search class="h-5 w-5" />
                    <span>Search</span>
                </h2>
                <div class="relative">
                    <Input 
                        type='text'
                        placeholder='look for relevant postcards'
                        value={searchQuery}
                        oninput={(e) => {searchQuery = e.target.value}}
                        class="w-full pr-4 py-2 border border-border/40 rounded-lg focus:ring-2 focus:ring-ring/70
                                focus:border-transparent transition-all"
                    />

                </div>
            </div>

            <!-- country category -->

            <div class="space-y-3">
                <h2 class="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                    <Filter class="h-5 w-5"/>
                    <span>Regions</span>
                </h2>
                <div class="space-y-1.5 space-x-1.5 flex lg:flex-col sm:flex-row">
                    <Button
                        onclick={() => {selectedRegion = 'all'}}
                        class={`lg:w-full px-3 py-5 transition-colors
                            ${selectedRegion === 'all' ? 
                            'bg-primary/90 hover:bg-primary/90 text-primary-foreground' :
                            'bg-transparent hover:bg-primary/25 shadow-none text-foreground/80'}`}>
                        <span class="w-full text-left">All Regions</span>
                    </Button>
                    {#each regions as region }
                        <Button
                            key={region.id}
                            class={`lg:w-full px-3 py-5 transition-colors
                                ${selectedRegion === region.id ? 
                                'bg-primary/90 hover:bg-primary/90 text-primary-foreground' :
                                'bg-transparent hover:bg-primary/25 shadow-none text-foreground/80'}`}
                            onclick={() => {selectedRegion = region.id}}
                        >
                            <span class="w-full text-left">{region.label}</span>
                        </Button>
                    {/each}
                </div>
            </div>

        </div>
    </div>

    <div class=" lg:col-span-40 sm:col-span-50 flex flex-col w-full bg-gradient-to-b from-accent-foreground/40 to-accent/30">

        

        <Separator class="bg-foreground"/>

        <div class="grid grid-cols-{numOfCols} gap-2 h-full px-10
                    ">
            
            {#each alignedPostcards as col, idx1}
                {console.log(col[0].author)}
                {@const cardHeights = getCardHeights(col.length, alignedPostcards.length)}
                {console.log(cardHeights)}
                <div class="grid gap-8 p-6">
                    {#each col as item, idx2}
                        <div class="m-0 transition transform duration-250"
                            class:hover:-rotate-1={(idx1 * idx2) / 3 % 2 === 0}
                            class:hover:rotate-1={(idx1 * idx2) /3 % 2 !== 0}>
                            {console.log(cardHeights[idx2])}
                            <!-- style="height: {cardHeights[idx]}px" -->

                            <Card.Root
                                
                                style="height: {cardHeights[idx2]}px" 
                                class={`p-0 gap-0 overflow-hidden group transform 
                                     hover:border-[2.75px] border-ring/40 transition-all duration-150`}>
                                <div class="relative overflow-hidden min-h-55 max-h-65">
                                    
                                    <img
                                        class={`w-full h-full object-cover`}
                                        src={'https://images.pexels.com/photos/417239/pexels-photo-417239.jpeg'} 
                                    />

                                    <div class="absolute inset-0 bg-gradient-to-t from-ring/95 via-ring/40 to-transparent opacity-0
                                                group-hover:opacity-100 transition-all duration-200 flex items-end justify-center">

                                        <Button
                                            href="#"
                                            variant="ghost"
                                            class="bg-white/35 backdrop-blur-md text-md text-accent/90 px-5 py-5.5 font-semibold
                                                    transform -translate-y-6"
                                        >
                                            read more
                                        </Button>

                                    </div>
                                    {#if item.featured}
                                        <Badge class="opacity-90 absolute top-4 right-3.5">
                                            Featured
                                        </Badge>
                                    {/if}

                                </div>
                                <div class="flex flex-col justify-between h-full">
                                    <div class="flex px-6 space-x-2 items-start mt-6 mb-6 h-full">
                                        <div class="space-y-2 h-full">
                                            <h1 class="font-bold text-lg trailing-tight leading-tight">
                                                    {item.title}
                                            </h1>
                                            <p class="font-normal text-sm leading-normal line-clamp-5">
                                                    {item.description}
                                            </p>
                                        </div>
                                        
                                        <div class="flex flex-col justify-between h-full ml-6">

                                            <div class="flex flex-col items-end space-y-0 ">
                                                    
                                                <div class="flex items-center space-x-2">
                                                    <Avatar.Root>
                                                        <Avatar.Fallback class="text-sm bg-rose-200">
                                                            AB
                                                        </Avatar.Fallback>
                                                        <Avatar.Image>

                                                        </Avatar.Image>
                                                    </Avatar.Root>
                                                    <div class="flex">
                                                        <span class="text-sm text-nowrap">{item.author.name}</span>
                                                    </div>
                                                </div>

                                                <span class="text-right text-xs text-secondary-foreground/90 leading-none text-nowrap">{item.author.title}</span>
                                            </div>
                                            

                                            <div class="flex items-center justify-end items-end w-full space-x-4 text-secondary-foreground h-full">
                                                <div class="flex flex-col items-center">
                                                    <Heart class="h-5 w-5" />
                                                    <span class="text-xs">{item.likes}</span>
                                                </div>
                                                <div class="flex flex-col items-center">
                                                    <Eye class="h-5 w-5" />
                                                    <span class="text-xs">{item.likes}</span>
                                                </div>
                                            </div>

                                        </div>
                                        
                                    </div>

                                    <div hidden class="flex items-center justify-end w-full space-x-4 text-secondary-foreground">
                                        <div class="flex flex-col items-center">
                                            <Heart class="h-5 w-5" />
                                            <span class="text-xs">{item.likes}</span>
                                        </div>
                                        <div class="flex flex-col items-center">
                                            <Eye class="h-5 w-5" />
                                            <span class="text-xs">{item.likes}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card.Root>

                        </div>
        
                    {/each}
                </div>

            {/each}

        </div>
    </div>

</div>