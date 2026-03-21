<script>
    import * as Card from "$lib/components/ui/card";
    import { Camera } from "lucide-svelte";
    import * as Dialog from "$lib/components/ui/dialog";

    let { gallery = [] } = $props();

    let galleryImageDialogOpen = $state(false);
    let galleryImageData = $state({
        image: "",
        id: -1
    });

    const openGalleryImage = (image, id) => {
        galleryImageData = { image, id };
        galleryImageDialogOpen = true;
    };
</script>

<Card.Root class="gap-1 p-6">
    <h2 class="mb-4 flex items-center text-lg font-semibold text-foreground sm:text-xl">
        <Camera class="mr-2 h-5 w-5" />
        Photo Gallery
    </h2>

    <Dialog.Root bind:open={galleryImageDialogOpen}>
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>Image</Dialog.Title>
            </Dialog.Header>
            {#if galleryImageData.image}
                <img
                    src={galleryImageData.image}
                    alt={`Gallery img ${galleryImageData.id + 1}`}
                    class="h-full w-full cursor-pointer rounded object-cover"
                />
            {/if}
        </Dialog.Content>
    </Dialog.Root>

    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        {#each gallery as image, idx}
            <button
                type="button"
                onclick={() => openGalleryImage(image, idx)}
            >
                <img
                    src={image}
                    alt={`Gallery img ${idx + 1}`}
                    class="h-32 w-full cursor-pointer rounded object-cover transition-transform hover:scale-102 lg:h-42"
                />
            </button>
        {/each}
    </div>
</Card.Root>
