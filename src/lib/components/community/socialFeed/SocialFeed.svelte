<script>
	import SocialFeedHeader from "./SocialFeedHeader.svelte";
	import SocialFeedPosts from "./SocialFeedPosts.svelte";

	let {
		posts = [],
		limit = 6,
		currentPath = "/community"
	} = $props();

	let searchQuery = $state("");
	let activeContentType = $state("all");
	let activeFilter = $state("all");

	const filters = [
		{ id: "all", name: "All Posts" },
		{ id: "opp", name: "Opportunities" },
		{ id: "social", name: "Social" },
		{ id: "academic", name: "Academic" },
		{ id: "housing", name: "Housing" },
		{ id: "events", name: "Events" }
	];

	const contentTypes = [
		{ id: "all", name: "All" },
		{ id: "discussion", name: "Discussions" },
		{ id: "announcement", name: "Announcements" },
		{ id: "photo", name: "Photos" },
		{ id: "question", name: "Questions" }
	];
</script>

<div class="space-y-12">
	<SocialFeedHeader
		{filters}
		{contentTypes}
		bind:activeContentType
		bind:activeFilter
		bind:searchQuery
	/>
	<SocialFeedPosts
		{posts}
		{limit}
		{activeFilter}
		{activeContentType}
		{searchQuery}
		{currentPath}
	/>
</div>
