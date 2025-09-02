<script>
	import '../app.css';
	import { NavigationMenuRoot, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '$lib/components/ui/navigation-menu/';
    import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { Toaster } from "$lib/components/ui/sonner"
    import { setTokenState } from '$lib/stores/jwt.svelte';
    import { onMount } from 'svelte';

	let { children, data } = $props();

	
	const tokenState = setTokenState()
	onMount(() => {
		if (!data.acs_tkn) {
			tokenState.refreshAccessToken()
		}
	})

</script>

<Toaster position="top-right" />

<div class="min-h-screen h-screen flex flex-col">
	<header id="navbar" class="h-fit">
		<NavigationMenuRoot viewport={false}>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink>
						{#snippet child()}
							<a href="/" class={navigationMenuTriggerStyle()}>Home</a>
						{/snippet}
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink>
						{#snippet child()}
							<a href="/" class={navigationMenuTriggerStyle()}>Postcards</a>
						{/snippet}
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink>
						{#snippet child()}
							<a href="/" class={navigationMenuTriggerStyle()}>Resources</a>
						{/snippet}
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink>
						{#snippet child()}
							<a href="/" class={navigationMenuTriggerStyle()}>About</a>
						{/snippet}
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenuRoot>
	</header>

	<main class="flex-grow">
		{@render children()}
	</main>
		

	<div class="footer shrink-0">
		<footer class="footer">
			&copy; 2025 RomeWithMe • All rights reserved
		</footer>
	</div>
</div>

