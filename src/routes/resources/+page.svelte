<script>
	import ResourcesView from "$lib/components/resources/ResourcesView.svelte";

	let { data } = $props();
</script>

<div class="page-shell mx-auto w-full px-6 py-8 sm:px-10 md:px-16">
	<ResourcesView resourcesByCategory={data.resourcesByCategory} />
</div>
