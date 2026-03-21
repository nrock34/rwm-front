<script>
	import ChevronRight from "@lucide/svelte/icons/chevron-right";
	import * as Card from "../ui/card";
	import * as ToggleGroup from "../ui/toggle-group";
	import { Award, BookOpen, FileText, LinkIcon, Map, Plus, Users, Video } from "lucide-svelte";
	import { Button } from "../ui/button";
	import ResourceCard from "./cards/ResourceCard.svelte";

	const EMPTY_COLLECTIONS = Object.freeze({});
	const CATEGORY_ORDER = Object.freeze(["guides", "tips", "itineraries", "academic", "cultural"]);

	let { resourcesByCategory = EMPTY_COLLECTIONS } = $props();

	const resourceTypes = [
		{ id: "all", name: "All Types", icon: FileText },
		{ id: "pdf", name: "PDF Guides", icon: FileText },
		{ id: "video", name: "Videos", icon: Video },
		{ id: "link", name: "External Links", icon: LinkIcon },
		{ id: "interactive", name: "Interactive Tools", icon: Map }
	];

	const categoryMeta = [
		{
			id: "guides",
			name: "Guides",
			icon: BookOpen,
			description: "Comprehensive guides for studying abroad"
		},
		{
			id: "tips",
			name: "Tips",
			icon: Award,
			description: "Expert tips from students and advisors"
		},
		{
			id: "itineraries",
			name: "Travel Itineraries",
			icon: Map,
			description: "Curated travel plans and city guides"
		},
		{
			id: "academic",
			name: "Academic",
			icon: BookOpen,
			description: "Course materials and study aids"
		},
		{
			id: "cultural",
			name: "Cultural",
			icon: Users,
			description: "Cultural insights and etiquette guides"
		}
	];

	let selectedType = $state("all");
	let selectedCategory = $state("guides");

	const categories = $derived(
		categoryMeta
			.slice()
			.sort((left, right) => CATEGORY_ORDER.indexOf(left.id) - CATEGORY_ORDER.indexOf(right.id))
			.map((category) => ({
				...category,
				count: resourcesByCategory[category.id]?.length ?? 0
			}))
	);

	const currentResources = $derived(resourcesByCategory[selectedCategory] ?? []);
	const selectedCategoryMeta = $derived(categories.find((category) => category.id === selectedCategory) ?? categories[0] ?? null);

	const filteredResources = $derived(
		currentResources.filter((resource) => {
			if (selectedType === "all") return true;
			if (selectedType === "interactive") {
				return resource.type === "interactive" || resource.type === "page";
			}
			return resource.type === selectedType;
		})
	);

	function getTypeCount(typeId) {
		if (typeId === "all") return currentResources.length;
		if (typeId === "interactive") {
			return currentResources.filter((resource) => resource.type === "interactive" || resource.type === "page").length;
		}
		return currentResources.filter((resource) => resource.type === typeId).length;
	}

	$effect(() => {
		if (!(selectedCategory in resourcesByCategory)) {
			selectedCategory = categories.find((category) => category.count > 0)?.id ?? "guides";
			return;
		}

		if ((resourcesByCategory[selectedCategory] ?? []).length === 0) {
			const firstAvailableCategory = categories.find((category) => category.count > 0)?.id;
			if (firstAvailableCategory) {
				selectedCategory = firstAvailableCategory;
			}
		}
	});
</script>

<div class="mx-auto w-full">
	<div class="mb-12 flex w-full items-center justify-between">
		<div class="mb-0">
			<h1 class="mb-2 text-3xl font-bold text-foreground">Resources</h1>
			<p class="text-muted-foreground">
				Comprehensive guides, tips, and tools for your study abroad journey.
			</p>
		</div>

		<Card.Root class="gap-0 bg-ring/10 p-2 ring-1 ring-ring/80 transition-colors hover:bg-ring/20 hover:ring-2">
			<Button variant="ghost" class="hover:cursor-pointer hover:bg-transparent hover:text-foreground">
				<BookOpen class="h-5 w-5" />
				<span class="text-md font-light">Contribute to Our Resources</span>
				<Plus />
			</Button>
		</Card.Root>
	</div>

	<div class="grid gap-8 lg:grid-cols-4">
		<div class="lg:col-span-1">
			<div class="space-y-6">
				<Card.Root class="gap-2 p-5">
					<h3 class="mb-4 font-semibold text-foreground">Categories</h3>
					<nav class="space-y-2">
						<ToggleGroup.Root bind:value={selectedCategory} size="lg" class="flex w-full flex-col gap-3" type="single">
							{#each categories as category}
								{@const CategoryIcon = category.icon}
								<ToggleGroup.Item
									class={`flex w-full items-center justify-between rounded p-3 text-left hover:text-accent-foreground ${selectedCategory === category.id ? "bg-none" : ""}`}
									value={category.id}
								>
									<div class="flex items-center space-x-3">
										<CategoryIcon class="h-4 w-4" />
										<div class="flex flex-col items-start">
											<div class="text-wrap">{category.name}</div>
											<div class="text-xs opacity-80">{category.count} resources</div>
										</div>
									</div>
									<ChevronRight class="h-4 w-4" />
								</ToggleGroup.Item>
							{/each}
						</ToggleGroup.Root>
					</nav>
				</Card.Root>

				<Card.Root class="gap-2 p-5">
					<h3 class="mb-4 font-semibold text-foreground">Resource Types</h3>
					<div class="space-y-2">
						<ToggleGroup.Root bind:value={selectedType} type="single" class="flex w-full flex-col items-start gap-2">
							{#each resourceTypes as type}
								{@const TypeIcon = type.icon}
								<ToggleGroup.Item class="w-full py-2" value={type.id}>
									<div class="flex w-full items-center justify-between">
										<div class="flex items-center space-x-3">
											<TypeIcon class="mr-3" />
											{type.name}
										</div>
										<span class="flex h-4 w-4 items-center justify-center rounded bg-muted/50 p-3.5">
											{getTypeCount(type.id)}
										</span>
									</div>
								</ToggleGroup.Item>
							{/each}
						</ToggleGroup.Root>
					</div>
				</Card.Root>
			</div>
		</div>

		<div class="lg:col-span-3">
			<div class="mb-6">
				<div class="mb-1 flex items-center space-x-5">
					{#if selectedCategoryMeta}
						{@const SelectedCategoryIcon = selectedCategoryMeta.icon}
						<SelectedCategoryIcon class="h-7 w-7 text-primary" />
					{:else}
						<BookOpen class="h-7 w-7 text-primary" />
					{/if}
					<span class="text-2xl font-semibold">{selectedCategoryMeta?.name}</span>
				</div>
				<span class="text-md text-secondary-foreground">{selectedCategoryMeta?.description}</span>

				<div class="mt-4.5 text-sm text-secondary-foreground">
					Showing {filteredResources.length} resources
					{#if selectedType !== "all"}
						<span> • Filtered by {resourceTypes.find((type) => type.id === selectedType)?.name}</span>
					{/if}
				</div>
			</div>

			<div class="space-y-6">
				{#each filteredResources as resource (resource.id)}
					<ResourceCard {resource} />
				{/each}
			</div>

			{#if filteredResources.length === 0}
				<div class="py-12 text-center">
					<BookOpen class="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
					<h3 class="mb-1 text-lg font-medium text-foreground">No resources found</h3>
					<p class="text-muted-foreground">Try adjusting your filters.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
