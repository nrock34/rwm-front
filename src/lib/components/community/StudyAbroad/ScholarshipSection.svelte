<script>
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import * as Card from "$lib/components/ui/card";
	import { Calendar, Clock, DollarSign, ExternalLink, Globe, MapPin, Star } from "lucide-svelte";
	import { getDeadlineLabel } from "$domains/community/mappers.js";

	const categories = [
		{ id: "all", name: "All" },
		{ id: "merit", name: "Merit" },
		{ id: "need", name: "Need" },
		{ id: "research", name: "Research" },
		{ id: "cultural", name: "Cultural" },
		{ id: "athletic", name: "Athletic" }
	];

	const getStatusToneClass = (status) => {
		switch (status) {
			case "open":
				return "tone-pill tone-pill--green";
			case "upcoming":
				return "tone-pill tone-pill--yellow";
			case "closed":
				return "tone-pill tone-pill--red";
			default:
				return "tone-pill tone-pill--gray";
		}
	};

	let { scholarships = [], limit = 3, cardClass = "" } = $props();
	let selectedCategory = $state("all");

	const filteredScholarships = $derived(
		selectedCategory === "all"
			? scholarships
			: scholarships.filter((scholarship) => scholarship.categories.includes(selectedCategory))
	);
</script>

<Card.Root class={`h-fit gap-2 ${cardClass}`.trim()}>
	<Card.Header class="mb-0 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<Globe class="tone-text-amber h-5 w-5" />
			<h2 class="text-sm font-bold text-foreground sm:text-lg">Scholarships</h2>
		</div>
		<Button href="/scholarships" variant="ghost" class="text-primary shadow-none hover:bg-transparent hover:text-accent-foreground">
			<span class="flex items-center gap-1 text-xs font-medium">View All</span>
			<ExternalLink class="h-3 w-3" />
		</Button>
	</Card.Header>

	<Card.Content>
		<div class="mb-4 flex flex-wrap gap-1">
			{#each categories as category}
				<Button onclick={() => (selectedCategory = category.id)} variant={selectedCategory === category.id ? "secondary" : "outline"} class="h-7 px-2 text-xs lg:text-sm">
					{category.name}
				</Button>
			{/each}
		</div>

		<div class="space-y-3">
			{#if filteredScholarships.length > 0}
				{#each filteredScholarships.slice(0, limit) as scholarship (scholarship.id)}
					<div class={`rounded-(--radius) border p-4 hover:shadow-sm ${scholarship.featured ? "tone-surface-amber" : "border-border bg-card"}`}>
							<div class="mb-2 flex flex-col items-start justify-between gap-2">
								<div class="flex w-full items-center justify-between gap-2">
									<h3 class="text-card-title-sm w-fit font-semibold text-foreground sm:text-sm">{scholarship.title}</h3>
									<div class="flex flex-wrap items-center justify-end gap-1">
										{#if scholarship.featured}
											<Badge class="bg-primary/15 px-1.5 py-0 text-meta-xs font-medium text-accent-foreground/80 sm:text-xs">Featured</Badge>
										{/if}
										<Badge class={`px-1.5 py-0 text-meta-xs font-medium sm:text-xs ${getStatusToneClass(scholarship.status)}`}>{scholarship.status.toUpperCase()}</Badge>
									</div>
								</div>

								<div>
									<p class="mb-1 text-meta-xs text-secondary-foreground sm:text-xs">{scholarship.provider}</p>
									<p class="text-meta-xs text-muted-foreground sm:text-xs">{scholarship.description}</p>
								</div>
							</div>

						<div class="mb-5 grid grid-cols-2 gap-2 text-xs text-secondary-foreground">
								<div class="flex items-center gap-1">
									<DollarSign class="h-3 w-3" />
									<span class="text-meta-xs sm:text-xs">{scholarship.amount}</span>
								</div>
								<div class="flex items-center gap-1">
									<MapPin class="h-3 w-3" />
									<span class="text-meta-xs sm:text-xs">{scholarship.location}</span>
								</div>
								<div class="flex items-center gap-1">
									<Calendar class="h-3 w-3" />
									<span class="text-meta-xs font-medium sm:text-xs">{scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : "TBD"}</span>
								</div>
								<div class="flex items-center gap-1">
									<Clock class="h-3 w-3" />
									<span class="text-meta-xs sm:text-xs">{getDeadlineLabel(scholarship.deadline)}</span>
								</div>
							</div>

							<div class="mb-3 flex items-center gap-1 text-xs text-secondary-foreground">
								<Star class="tone-star h-3 w-3 fill-current" />
								<span>{scholarship.rating}</span>
							</div>

						<div class="flex items-center justify-between gap-6">
								<div class="flex flex-wrap items-center gap-1">
									{#each scholarship.qualifications as qualification}
										<span class="text-micro-xs rounded-(--radius) border bg-muted px-1.5 py-0.5 sm:text-meta-xs md:text-xs">{qualification}</span>
									{/each}
								</div>
								<Button href={scholarship.href} class="text-action-xs sm:text-xs">Learn More</Button>
							</div>
						</div>
					{/each}
			{:else}
				<p class="text-sm text-muted-foreground">No featured scholarships are available for this category right now.</p>
			{/if}
		</div>
	</Card.Content>

	<div class="mt-3 text-center">
		<Button href="/scholarships">Explore All Scholarships</Button>
	</div>
</Card.Root>
