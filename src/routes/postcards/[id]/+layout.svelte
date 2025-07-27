<script>
    import * as Card from '$lib/components/ui/card';
    import * as Breadcrumb from '$lib/components/ui/breadcrumb';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';
    import * as Avatar from '$lib/components/ui/avatar';
    import { Calendar, User } from 'lucide-svelte';
    import { MessageSquare, MessageSquareReply, Share, Share2 } from '@lucide/svelte';
    import { Separator } from '$lib/components/ui/separator';

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
</script>

<div class="bg-muted w-full">

    <div class="grid grid-rows-9 relative z-1 ">
        <div class="w-full h-fit col-start-1 row-start-1 row-end-10 -z-10">
            <img
                    class="rounded-b-xl w-full -z-5 sm:h-[50vh] lg:h-[60vh] object-cover"
                    src={"https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg"}/>

            <div 
                class="absolute top-0 w-full sm:h-[50vh] lg:h-[60vh]  inset-x-0 bg-black/40"
            />

            <div 
                class="absolute inset-x-0 z-0  lg:bottom-0 sm:bottom-0 h-40 
                bg-gradient-to-b from-transparent via-muted/30 to-muted 
                pointer-events-none"
            >
            </div>
        </div>

        <div class="px-18 mx-auto w-full max-w-7xl col-start-1 row-start-1 row-end-9 flex flex-col justify-between items-start mx-5 px-10">
            <!-- breadcrumb section -->
            <div class="p-3 mt-8">
                <Breadcrumb.Root>
                    <Breadcrumb.List class="text-muted/70">
                        <Breadcrumb.Item>
                            <Breadcrumb.Link class="text-lg font-semibold" href="#">Home</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator/>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link class="text-lg font-semibold" href="#">Postcards</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator/>
                        <Breadcrumb.Item>
                            <Breadcrumb.Page class="text-white text-lg font-semibold" >Article Title Placeholder</Breadcrumb.Page>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
            </div>

            <div>
            <h1 class="p-3 text-accent text-6xl bg-white/1 rounded-xl font-bold mb-0 max-w-240">
                    Exploring The Sardinian Caves
            </h1>
            <div class="px-3 flex items-center space-x-4 mt-2">
                <span class="cursor-pointer bg-secondary/70 border border-ring/80 px-1.75 py-0.5 text-foreground/90 text-xs font-medium rounded-md">#Rome</span>
                <span class="cursor-pointer bg-secondary/70 border border-ring/80 px-1.75 py-0.5 text-foreground/90 text-xs font-medium rounded-md">#StudyAbroad</span>
                <span class="cursor-pointer bg-secondary/70 border border-ring/80 px-1.75 py-0.5 text-foreground/90 text-xs font-medium rounded-md">#TravelTips</span>
            </div>
            </div>
        </div>
    </div>
    

    <div class="mx-auto items-start grid grid-cols-3 gap-6 px-18 max-w-7xl h-full mt-5">
        <div class="col-span-2 space-y-10">
            
            <div class="px-2">

                <div class="flex justify-between items-center mx-1">
                    <div class="grid space-y-0 my-4">
                        <div class="space-x-1.5 flex items-center text-foreground font-medium text-xl">
                            <User class="h-7 w-7 text-accent-foreground fill-current" /> 
                            <a  href="#"
                                class="ml-0.5">
                                Martin Wasbjlo
                            </a>
                        </div>
                        <div class="space-x-1.5 flex items-center text-secondary-foreground font-light text-sm">
                            <Calendar class="h-4 w-7 mb-0.75" /> 
                            <span
                                class="ml-0.5">
                                10/12/2025
                            </span>
                        </div>
                    </div>

                    <Button
                        href="/"
                        class="items-center flex space-x-2 mr-1 z-30
                                hover:bg-foreground"
                    >
                        <Share2 class="w-5 h-5"/>
                        <span>Share</span>
                    </Button>
                </div>
                <Card.Root class="gap-0 px-3">
                    <Card.Header>
                        <!-- Article Description -->
                        
                    </Card.Header>
                    <Card.Content>
                        <article>
                            <p>
                                Trastevere is more than just a neighborhood—it's a feeling. With its cobblestone streets, colorful buildings, and the scent of espresso wafting through alleyways, it captures the essence of Roman charm.
                            </p>
                            <p>
                                {"Start your walk at Piazza Santa Maria and let your senses guide you through centuries of history and culture. From local trattorias to artisan shops, every corner tells a story.".repeat(21)}
                            </p>
                            <blockquote class="article-quote">
                                "Rome wasn't built in a day, but Trastevere makes you feel like time stands still."
                            </blockquote>
                            <p>
                                Whether you're studying abroad or just visiting, this quarter offers a perfect mix of relaxation and cultural immersion. Don’t forget to stop by the Janiculum Hill for one of the best panoramic views in the city.
                            </p>
                        </article>

                        <div hidden class="article-tags">
                            <span>#Rome</span><span>#StudyAbroad</span><span>#TravelTips</span>
                        </div>
                    </Card.Content>
                </Card.Root>

                <Card.Root class="gap-2 p-8 px-1 comment-section-container">
                    <Card.Header>
                        <Card.Title class="text-lg">
                            Comments
                        </Card.Title>
                    </Card.Header>
                    <Card.Content class="px-8 mt-2">
                        <div class="comments space-y-2">
                            <div class="flex items-center justify-between">
                                <div class="flex space-x-3.5 items-center">
                                    <Avatar.Root class='w-8 h-8'>
                                        <Avatar.Fallback class="text-xs tracking-tight font-semibold bg-indigo-200">
                                            MR
                                        </Avatar.Fallback>
                                    </Avatar.Root>
                                    
                                    <span class="font-medium">Maria Rossi</span>
                                </div>

                                <span class="text-sm text-secondary-foreground">3d ago</span>
                            </div>
                            
                            <div class="text-foreground/90">
                                <p class="text-sm">Such a beautiful description of Trastevere—makes me want to visit again!</p>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
                <!-- {@render children()}  -->
            </div>
        </div>

        <aside class="sidebar-container space-y-8">


            <Card.Root class="gap-0 p-8 py-6">
                <h2 class="font-semibold text-lg mb-0 py-0">
                    Gallery
                </h2>
                <Separator class="my-4 mt-2"/>
                <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 mb-4">
                    {#each testImages as image, idx}
                    <div class="flex items-center justify-center rounded-xl">
                        <img
                            class="h-28 w-full object-cover rounded-md hover:scale-102 transition-transform"
                            src={image}
                            alt={idx} 
                            />
                    </div>
                    {/each}
                </div>
            </Card.Root>

            <Card.Root class="gap-0 p-6 ring-ring/50 ring-2 bg-secondary">
                <Card.Header class="gap-0 px-0">
                    <Card.Title class="text-lg font-bold text-primary/85">
                        Subscribe To Our Newsletter
                    </Card.Title>
                    <span class="leading-tight text-xs text-foreground/85">
                        Stay updated on the latest resources, programs, scholarships and postcards.
                    </span>
                    
                </Card.Header>
                <Card.Content class="px-0 mt-2">
                    <div class="flex flex-col gap-4 mt-[0.35rem]">
                        <Input placeholder="Enter your email."/>
                        <Button class="w-full mt-2">
                            Subscribe!
                        </Button>  
                    </div>
                </Card.Content>
            </Card.Root>

            <Card.Root hidden>
                <Card.Header>
                    <Card.Title class="text-lg">
                        Featured Postcards
                    </Card.Title>
                </Card.Header>
                <Card.Content>

                </Card.Content>
            </Card.Root>

            
        </aside>
    </div>


    
    
</div>

