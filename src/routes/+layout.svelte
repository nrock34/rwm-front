<script>
	import '../app.css';
	import { NavigationMenuRoot, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '$lib/components/ui/navigation-menu/';
    import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { Toaster } from "$lib/components/ui/sonner"
    import { setTokenState } from '$lib/stores/jwt.svelte';
    import { onMount } from 'svelte';
    import Footer from '$lib/components/layout/footer.svelte';
    import { setContext } from 'svelte';
    import Navigation from '$lib/components/layout/navigation.svelte';

	let { children, data } = $props();

	setContext('config', data.config);

	const tokenState = setTokenState()
	onMount(() => {
		if (!data.acs_tkn) {
			tokenState.refreshAccessToken()
		}
	})

</script>

<Toaster position="top-right" />

<div class="min-h-screen h-screen flex flex-col">
	<header>
		<Navigation class="bg-muted/60 py-4.5 border-b-3 border-b-accent-foreground"/>
	</header>

	<main class="flex-grow">
		{@render children()}
	</main>
		

	<div class="scrollerFooter shrink-0">
		<Footer />
	</div>
</div>

