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
	import { innerWidth } from "svelte/reactivity/window";

	let { data, form } = $props();

	let md = $derived(innerWidth.current < 768);
	let xl = $derived(innerWidth.current < 1150);
</script>

<div class="space-y-10">
	<div class="mb-8 border-b border-border/70 bg-gradient-to-br from-secondary/70 to-accent/22 px-6 sm:px-10 md:px-14 lg:px-18 xl:px-22">
		<NewsUpdates updates={data.summary.updates} deadlines={data.summary.upcomingDeadlines} />
	</div>

	<div class="px-6 sm:px-8 md:px-14 lg:px-18 xl:px-22">
			<div class="page-shell grid w-full justify-self-center grid-cols-10 gap-8 gap-x-8">
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
					<SocialFeed posts={data.summary.posts} currentPath={data.currentPath} limit={xl ? 2 : 6} />
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
						<ScholarshipSection scholarships={data.summary.featuredScholarships} cardClass="w-full" limit={2} />
					</div>
					<div>
						<StudyAbroadSection programs={data.summary.featuredPrograms} cardClass="w-full" limit={2} />
					</div>
				{/if}
			</div>

			{#if xl}
				<div class="order-2 col-span-10 flex w-full flex-col justify-between gap-4 sm:flex-row md:order-3">
					<StudyAbroadSection programs={data.summary.featuredPrograms} cardClass="w-full" limit={2} />
					<ScholarshipSection scholarships={data.summary.featuredScholarships} cardClass="w-full" limit={2} />
				</div>
			{/if}
		</div>
	</div>
</div>
