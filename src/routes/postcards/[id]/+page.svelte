<script>
	import * as Card from "$lib/components/ui/card";
	import * as Avatar from "$lib/components/ui/avatar";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Separator } from "$lib/components/ui/separator";
	import { Calendar, Share2 } from "lucide-svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import { enhance } from "$app/forms";
	import { fly } from "svelte/transition";
	import ResilientImage from "$lib/components/shared/ResilientImage.svelte";
	import PostcardContentPreview from "$lib/components/postcards/PostcardContentPreview.svelte";
	import { openPostcardLayoutEditor } from "$domains/postcards/layout-editor.js";
	import { getPostcardGalleryImages, resolvePostcardPreviewDocument } from "$domains/postcards/preview.js";

	let galleryImageViewOpen = $state(false);
	let galleryImageViewData = $state(
		{
			image: null,
			id: null
		}
	);

	let { data, form } = $props();

	const postcard = data.postcardData;
	const initialPreview = resolvePostcardPreviewDocument(postcard);
	let previewDocument = $state(initialPreview.document);
	let previewSource = $state(initialPreview.source);
	const galleryImages = $derived.by(() =>
		getPostcardGalleryImages({
			...postcard,
			contentBlocks: previewDocument
		})
	);

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

		<div class="flex flex-wrap gap-3">
			<Button
				variant="outline"
				type="button"
				onclick={() => {
					openPostcardLayoutEditor(previewDocument, {
						title: `${postcard.title} layout playground`,
						onSave: (nextDocument) => {
							previewDocument = nextDocument;
							previewSource = "edited";
						}
					});
				}}
			>
				Open Layout Editor
			</Button>
		</div>

		<PostcardContentPreview document={previewDocument} source={previewSource} />

		{#if postcard.content}
			<Card.Root class="gap-0 pt-0">
				<div class="flex justify-between items-center px-6 mx-3">
					<div class="grid space-y-0 my-4">
						<div class="space-x-1.5 flex items-center text-secondary-foreground font-light text-sm">
							<Avatar.Root class="h-9 w-9">
								<Avatar.Image src={postcard.author.avatar} />
								<Avatar.Fallback class="text-xs">{postcard.author.name.split(" ").map((s) => s[0]).join(".")}</Avatar.Fallback>
							</Avatar.Root>
							<div class="flex flex-col items-start text-foreground font-medium text-sm sm:text-base">
								<a href="" class="ml-0.5 leading-none">
									{postcard.author.name}
								</a>
								<div class="flex items-center gap-x-1">
									<Calendar class="h-3.5 w-3.5" />
									<span class="text-xs font-light tracking-wide ml-0.5">
										{new Date(postcard.datePublished).toDateString()}
									</span>
								</div>
							</div>
						</div>
					</div>

					<Button href="/" class="items-center flex space-x-2 mr-1 h-fit">
						<Share2 class="w-2 h-2" />
						<span class="text-xs">Share</span>
					</Button>
				</div>

				<Separator class="mb-3" />

				<Card.Content class="mx-6 pb-6">
					<div class="mb-3">
						<h2 class="text-xl font-semibold">Legacy HTML Article</h2>
						<p class="text-sm text-muted-foreground">
							Current production content rendering remains active below for backward compatibility.
						</p>
					</div>
					<article class="prose-sm sm:prose-base 3xl:prose-lg py-3">
						{@html postcard.content}
					</article>
				</Card.Content>
			</Card.Root>
		{/if}

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
							<Avatar.Root class="w-8 h-8">
								<Avatar.Fallback class="bg-secondary/55 text-xs font-semibold tracking-tight">
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
	</div>

	<aside class="col-span-3 md:col-span-1">
		<div class="sticky top-20 flex flex-col-reverse space-y-8">
			<Card.Root class="gap-0 p-6 ring-ring/50 ring-2 bg-secondary m-2">
				<Card.Header class="gap-0 px-0">
					<Card.Title class="text-lg font-bold text-primary/85 leading-none mb-0.75">
						Subscribe To Our Newsletter
					</Card.Title>
					<span class="leading-tight text-xs text-foreground/85">
						Stay updated on the latest resources, programs, scholarships and postcards.
					</span>
				</Card.Header>
				<Card.Content class="px-0 mt-2">
					<form use:enhance method="POST" action={"?/newsletterSignup"}>
						<div class="flex flex-col gap-4 mt-[0.35rem]">
							<div>
								<Input
									name="email"
									type="email"
									value={form?.email}
									placeholder="Enter your email."
								/>
								{#if form?.error}
									<p in:fly={{ y: 10 }} class="pt-1 pl-1 capitalize tracking-normal text-destructive text-xs ">Error: {form.error} - {form.description} </p>
								{/if}
								{#if form?.status === "success"}
									<p in:fly={{ y: 10 }} class="pt-1 pl-1 text-xs leading-none tracking-normal text-primary">Success, you're now subscribed to the newsletter. Stay tuned for updates sent to your email!</p>
								{/if}
							</div>
							<Button type="submit" class="w-full mt-1.5">
								Subscribe!
							</Button>
						</div>
					</form>
				</Card.Content>
			</Card.Root>

			<Card.Root class="gap-0 p-8 py-6">
				<h2 class="font-semibold text-lg mb-0 py-0">
					Gallery
				</h2>
				<Separator class="my-4 mt-2" />
				{#if galleryImages.length > 0}
					<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 mb-4">
						<Dialog.Root bind:open={galleryImageViewOpen}>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>
										Image
									</Dialog.Title>
								</Dialog.Header>
								<ResilientImage
									class="h-full w-full object-cover rounded-md transition-transform"
									src={galleryImageViewData.image}
									fallbackSrc={null}
									alt={galleryImageViewData.id}
									hideOnError={true}
								/>
							</Dialog.Content>
						</Dialog.Root>
						{#each galleryImages as image, idx}
							<div class="flex items-center justify-center rounded-xl">
								<button
									type="button"
									onclick={() => {
										galleryImageViewOpen = true;
										galleryImageViewData.image = image;
										galleryImageViewData.id = idx;
									}}
								>
									<ResilientImage
										class="cursor-pointer h-28 w-full object-cover rounded-md hover:scale-102 transition-transform"
										src={image}
										fallbackSrc={null}
										alt={idx}
										hideOnError={true}
									/>
								</button>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-sm leading-6 text-muted-foreground">
						No gallery images were found in the current API content yet. Legacy HTML images will continue to appear here automatically when present.
					</p>
				{/if}
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
