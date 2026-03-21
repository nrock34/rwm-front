<script>
	import '../app.css';
	import { Toaster } from "$lib/components/ui/sonner"
    import { setTokenState } from '$lib/stores/jwt.svelte';
    import { onMount } from 'svelte';
    import Footer from '$lib/components/layout/footer.svelte';
    import { setContext } from 'svelte';
    import { page } from "$app/state";
    import Navigation from '$lib/components/layout/navigation.svelte';

	let { children, data } = $props();

    function hidesAppChrome(pathname) {
        return pathname === "/auth/login" ||
            pathname === "/auth/signup" ||
            pathname.startsWith("/onboarding");
    }

	setContext('config', data.config);

	const tokenState = setTokenState(data.acs_tkn)
    const showHeader = $derived(!hidesAppChrome(page.url.pathname));
    const showFooter = $derived(!hidesAppChrome(page.url.pathname));

	$effect(() => {
		tokenState.syncToken(data.acs_tkn)
	})

	onMount(() => {
		if (!data.acs_tkn) {
			tokenState.refreshAccessToken()
		}
	})

</script>

<Toaster position="top-right" />

<svelte:head>
	<title>RomeWithMe - Study Abroad Community</title>
	<meta property="og:title" content="RomeWithMe – Connect, Share & Explore Abroad" />
	<meta property="og:description" content="RomeWithMe is a platform for students and travelers to share experiences, find community, and stay connected while abroad." />
	<meta property="og:image" content="https://romewithme.com/og-image.png" />
	<meta property="og:url" content="https://romewithme.com" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="min-h-screen flex flex-col">
	{#if showHeader}
		<header class="sticky top-0 w-full backdrop-blur-[4px] z-50">
			<Navigation
				auth={data.auth}
				viewer={data.viewer}
				class="bg-muted/70 py-2.5 pt-3 border-b-3 border-b-accent-foreground"
			/>
		</header>
	{/if}

	<main class="flex-grow">
		{@render children()}
	</main>
		
	{#if showFooter}
		<div class="scrollerFooter shrink-0">
			<Footer />
		</div>
	{/if}
</div>
