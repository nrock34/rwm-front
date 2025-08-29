<script>
    import * as Card from '$lib/components/ui/card';
    import CardHeader from '$lib/components/ui/card/card-header.svelte';
    import { Root } from 'postcss';
    import * as Avatar from "$lib/components/ui/avatar/index.js";

    import Button from '$lib/components/ui/button/button.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';

    import { Calendar, User, MessageSquare, MessageSquareReply, Share, Share2 } from 'lucide-svelte';
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import DialogTitle from '$lib/components/ui/dialog/dialog-title.svelte';

    const extractImageSources = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const images = Array.from(doc.querySelectorAll('img'))
        return images.map(img => img.src)
    }    

    let galleryImageViewOpen = $state(false)
    let galleryImageViewData = $state(
        {
            image: null,
            id: null
        }
    )

    let { data } = $props();

    await new Promise(resolve => setTimeout(resolve, 100))
    
    const postcard = data.postcardData;
    const galleryImages = extractImageSources(postcard.content)

</script>

<div class="grid grid-cols-3 gap-8 pt-2 pb-24">
    <div class="col-span-3 md:col-span-2 flex flex-col gap-y-4"> 
        <Card.Root class="p-2 px-5">
            <div>
                <span class="flex gap-x-2 items-center">
                    <h3 class="font-semibold">Location:</h3>
                    <p class="capitalize tracking-wider text-xs">{postcard.location.city}, {postcard.location.country}</p>
                </span>
            </div>
        </Card.Root>
        <Card.Root class="gap-0 pt-0">
            <div class="flex justify-between items-center px-6 mx-3">
                <div class="grid space-y-0 my-4">
                    <div class="space-x-1.5 flex items-center text-secondary-foreground font-light text-sm">
                        <Avatar.Root class="h-9 w-9">
                            <Avatar.Fallback class="text-xs">{postcard.author.name.split(' ').map(s => s[0]).join('.')}</Avatar.Fallback>
                        </Avatar.Root>
                        <!-- <User class="h-6 w-6 text-accent-foreground fill-current" />  -->
                        <div class="flex flex-col items-start text-foreground font-medium text-sm sm:text-base">
                            <a  
                                href=""
                                class="ml-0.5 leading-none">
                                {postcard.author.name}
                            </a>
                            <div class="flex items-center gap-x-1">
                                <Calendar class=" h-3.5 w-3.5" /> 
                                <span
                                    class="text-xs font-light tracking-wide ml-0.5">
                                    {new Date(postcard.created_at).toDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    href="/"
                    class="items-center flex space-x-2 mr-1 h-fit"
                >
                    <Share2 class="w-2 h-2"/>
                    <span class="text-xs">Share</span>
                </Button>
            </div>

            <Separator class="mb-3"/>

            <Card.Content class="mx-6">
                <article class="prose-sm sm:prose-base 3xl:prose-lg py-3">
                    {@html postcard.content}
                </article>
            </Card.Content>
        </Card.Root>

        <Card.Root hidden class="gap-2 p-8 px-1 comment-section-container">
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
    

    <aside class="col-span-3 md:col-span-1">
        <div class="sticky top-20 space-y-8">

            <Card.Root class="gap-0 p-6 ring-ring/50 ring-2 bg-secondary">
                <Card.Header class="gap-0 px-0">
                    <Card.Title class="text-lg font-bold text-primary/85 leading-none mb-0.75">
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

            <Card.Root class="gap-0 p-8 py-6">
                <h2 class="font-semibold text-lg mb-0 py-0">
                    Gallery
                </h2>
                <Separator class="my-4 mt-2"/>
                <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 mb-4">
                    <Dialog.Root bind:open={galleryImageViewOpen}>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>
                                    Image
                                </Dialog.Title>
                            </Dialog.Header>
                            <img
                                class="h-full w-full object-cover rounded-md transition-transform"
                                src={galleryImageViewData.image}
                                alt={galleryImageViewData.id} 
                            />
                        </Dialog.Content>
                    </Dialog.Root>
                    {#each galleryImages as image, idx}
                        <div class="flex items-center justify-center rounded-xl">
                            <button
                                onclick={() => {
                                    galleryImageViewOpen=true
                                    galleryImageViewData.image = image
                                    galleryImageViewData.id = idx
                                }}>
                                {@render children(image, idx)}
                            </button>
                            {#snippet children(image, idx)}
                                <img
                                    class="cursor-pointer h-28 w-full object-cover rounded-md hover:scale-102 transition-transform"
                                    src={image}
                                    alt={idx} 
                                />
                            {/snippet}
                        </div>
                    {/each}
                </div>
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
        </div>
        
    </aside>
</div>