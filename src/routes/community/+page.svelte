<script>
	import NewsUpdates from "$lib/components/community/CommunityNewsUpdates/NewsUpdates.svelte";
	import CommunityStats from "$lib/components/community/sidebar-elements/CommunityStats.svelte";
	import NewsletterSignup from "$lib/components/community/sidebar-elements/NewsletterSignup.svelte";
	import TrendingTags from "$lib/components/community/sidebar-elements/TrendingTags.svelte";
	import SocialFeed from "$lib/components/community/socialFeed/SocialFeed.svelte";
	import StudyAbroadSection from "$lib/components/community/StudyAbroad/ProgramsSection.svelte";
	import ScholarshipSection from "$lib/components/community/StudyAbroad/ScholarshipSection.svelte";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { innerWidth } from "svelte/reactivity/window";

	let { data, form } = $props();

	let md = $derived(innerWidth.current < 768);
	let xl = $derived(innerWidth.current < 1150);
	const postsPromise = data.posts;
	const updatesPromise = data.updates;
	const featuredProgramsPromise = data.featuredPrograms;
	const featuredScholarshipsPromise = data.featuredScholarships;
	const upcomingDeadlinesPromise = data.upcomingDeadlines;
</script>

<div class="space-y-10">
	<div class="mb-8 border-b border-border/70 bg-gradient-to-br from-secondary/70 to-accent/22 px-6 sm:px-10 md:px-14 lg:px-18 xl:px-22">
		{#await Promise.all([updatesPromise, upcomingDeadlinesPromise])}
			<div class="page-shell mx-auto w-full px-6 py-6 sm:px-10 md:px-14 lg:px-18 xl:px-22">
				<div class="mb-4 flex items-center justify-between gap-4">
					<div class="space-y-2">
						<Skeleton class="h-6 w-44 bg-muted-foreground/20" />
						<Skeleton class="h-4 w-60 bg-muted-foreground/15" />
					</div>
					<Skeleton class="h-9 w-24 bg-muted-foreground/20" />
				</div>
				<div class="grid grid-cols-10 gap-2">
					<div class="col-span-10 space-y-2 md:col-span-7 xl:col-span-8">
						<Skeleton class="h-36 w-full bg-muted-foreground/20" />
						<Skeleton class="h-36 w-full bg-muted-foreground/15" />
					</div>
					<div class="col-span-10 space-y-2 md:col-span-3 xl:col-span-2">
						<Skeleton class="h-20 w-full bg-muted-foreground/20" />
						<Skeleton class="h-32 w-full bg-muted-foreground/15" />
					</div>
				</div>
			</div>
		{:then [updates, upcomingDeadlines]}
			<NewsUpdates {updates} deadlines={upcomingDeadlines} />
		{/await}
	</div>

	<div class="px-6 sm:px-8 md:px-14 lg:px-18 xl:px-22">
			<div class="page-shell mx-auto grid w-full grid-cols-10 gap-8 gap-x-8">
			{#if md}
				<div class="col-span-10 mb-6 xl:order-first">
					<Button href="/community/posts" variant="ghost" class="h-fit w-full p-0">
						{#snippet children()}
							<Card.Root class="m-0 w-full gap-0 p-2 px-3 sm:p-4 sm:px-4">
								<div class="flex items-center justify-between gap-6">
									<h1 class="text-base font-semibold text-primary sm:text-lg">Social Feed</h1>
									<p class="text-xs font-medium sm:text-[0.8rem]">Visit the posts page to browse discussions, questions, and announcements.</p>
								</div>
							</Card.Root>
						{/snippet}
					</Button>
				</div>
			{/if}

			<div class="order-first col-span-10 flex flex-col md:col-span-7">
				{#if !md}
					{#await postsPromise}
						<div class="space-y-6">
							<div class="space-y-3">
								<Skeleton class="h-8 w-56 bg-muted-foreground/20" />
								<Skeleton class="h-12 w-full bg-muted-foreground/15" />
							</div>
							{#each Array(3) as _, idx (idx)}
								<Card.Root class="gap-4 border-border/70 bg-card/95 p-5">
									<div class="flex items-start justify-between gap-4">
										<div class="flex items-start gap-3">
											<Skeleton class="h-11 w-11 rounded-full bg-muted-foreground/20" />
											<div class="space-y-2">
												<Skeleton class="h-4 w-36 bg-muted-foreground/20" />
												<Skeleton class="h-3 w-28 bg-muted-foreground/15" />
											</div>
										</div>
										<Skeleton class="h-9 w-9 bg-muted-foreground/20" />
									</div>
									<div class="space-y-3">
										<Skeleton class="h-5 w-3/5 bg-muted-foreground/20" />
										<Skeleton class="h-4 w-full bg-muted-foreground/15" />
										<Skeleton class="h-4 w-11/12 bg-muted-foreground/15" />
										<Skeleton class="h-40 w-full bg-muted-foreground/15" />
									</div>
								</Card.Root>
							{/each}
						</div>
					{:then posts}
						<SocialFeed {posts} currentPath={data.currentPath} limit={xl ? 2 : 6} />
					{/await}
				{/if}
			</div>

			<div class="order-3 col-span-10 grid grid-cols-1 gap-8 gap-y-6 md:order-2 md:col-span-3 md:flex md:flex-col">
				<div>
					<NewsletterSignup result={form} />
				</div>
				<div>
					<TrendingTags tags={data.trendingTags} />
				</div>
				{#if !md}
					<div class="col-span-2">
						<CommunityStats stats={data.stats} />
					</div>
				{/if}
				{#if !xl}
					<div>
						{#await featuredScholarshipsPromise}
							<Card.Root class="h-fit gap-2 w-full">
								<Card.Header class="mb-0 flex items-center justify-between">
									<Skeleton class="h-6 w-40 bg-muted-foreground/20" />
									<Skeleton class="h-8 w-20 bg-muted-foreground/15" />
								</Card.Header>
								<Card.Content class="space-y-3">
									<Skeleton class="h-8 w-full bg-muted-foreground/15" />
									{#each Array(2) as _, idx (idx)}
										<Skeleton class="h-44 w-full bg-muted-foreground/15" />
									{/each}
								</Card.Content>
							</Card.Root>
						{:then featuredScholarships}
							<ScholarshipSection scholarships={featuredScholarships} cardClass="w-full" limit={2} />
						{/await}
					</div>
					<div>
						{#await featuredProgramsPromise}
							<Card.Root class="gap-2 w-full">
								<Card.Header class="mb-0 flex items-center justify-between">
									<Skeleton class="h-6 w-44 bg-muted-foreground/20" />
									<Skeleton class="h-8 w-20 bg-muted-foreground/15" />
								</Card.Header>
								<Card.Content class="space-y-3">
									<Skeleton class="h-8 w-full bg-muted-foreground/15" />
									{#each Array(2) as _, idx (idx)}
										<Skeleton class="h-44 w-full bg-muted-foreground/15" />
									{/each}
								</Card.Content>
							</Card.Root>
						{:then featuredPrograms}
							<StudyAbroadSection programs={featuredPrograms} cardClass="w-full" limit={2} />
						{/await}
					</div>
				{/if}
			</div>

			{#if xl}
				<div class="order-2 col-span-10 flex w-full flex-col justify-between gap-4 sm:flex-row md:order-3">
					{#await featuredProgramsPromise}
						<Card.Root class="gap-2 w-full">
							<Card.Header class="mb-0 flex items-center justify-between">
								<Skeleton class="h-6 w-44 bg-muted-foreground/20" />
								<Skeleton class="h-8 w-20 bg-muted-foreground/15" />
							</Card.Header>
							<Card.Content class="space-y-3">
								<Skeleton class="h-8 w-full bg-muted-foreground/15" />
								{#each Array(2) as _, idx (idx)}
									<Skeleton class="h-44 w-full bg-muted-foreground/15" />
								{/each}
							</Card.Content>
						</Card.Root>
					{:then featuredPrograms}
						<StudyAbroadSection programs={featuredPrograms} cardClass="w-full" limit={2} />
					{/await}
					{#await featuredScholarshipsPromise}
						<Card.Root class="h-fit gap-2 w-full">
							<Card.Header class="mb-0 flex items-center justify-between">
								<Skeleton class="h-6 w-40 bg-muted-foreground/20" />
								<Skeleton class="h-8 w-20 bg-muted-foreground/15" />
							</Card.Header>
							<Card.Content class="space-y-3">
								<Skeleton class="h-8 w-full bg-muted-foreground/15" />
								{#each Array(2) as _, idx (idx)}
									<Skeleton class="h-44 w-full bg-muted-foreground/15" />
								{/each}
							</Card.Content>
						</Card.Root>
					{:then featuredScholarships}
						<ScholarshipSection scholarships={featuredScholarships} cardClass="w-full" limit={2} />
					{/await}
				</div>
			{/if}
		</div>
	</div>
</div>
