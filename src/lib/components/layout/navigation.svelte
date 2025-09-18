<script>
    import * as NavigationMenu from "../ui/navigation-menu";
    import Globe from "$lib/assets/logos/VX78WS01.svelte";
    import { MapPin, Tally3, X } from "lucide-svelte";
    import { innerWidth } from "svelte/reactivity/window";

    import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
    import * as Drawer from "../ui/drawer";
    import Separator from "../ui/separator/separator.svelte";

    let { class: className } = $props()

    const links = [
        // {label: 'Resources', href: '/resources', desc: 'Link to resources page'},
        {label: 'Postcards', href: '/postcards', desc: 'Link to postcards page'},
        {label: 'Programs', href: '/programs', desc: 'Link to programs page'},
        {label: 'Community', href: '/community', desc: 'Link to community page'},
        {label: 'About Us', href: '/about', desc: 'Link to about us page'},
        // {label: 'Contact', href: '/contact', desc: 'Link to contact page'},
    ]

    let isDesktop = $derived(innerWidth.current > 600);
    let shrinkText = $derived(innerWidth.current < 810)
    $inspect(isDesktop)
    $inspect(innerWidth)

</script>



<NavigationMenu.Root viewport={false} class={`px-6 sm:px-8 lg:px-12 max-w-full ${className}`}>
    <div class="max-w-7xl flex justify-between items-center w-full">
        <a href="/">
            <div class="flex items-center gap-x-1 mx-3">
                <Globe class="w-20 h-20 stroke-primary fill-primary"/>
                <div class="flex flex-col space-y-[-4px]">
                    <h3 class="font-bold text-2xl">RomeWithMe</h3>
                    <p class="tracking-tight text-foreground/85 text-sm">Grow Roots in New Places</p>
                </div>
            </div>
        </a>
        
        {#if isDesktop}
        <NavigationMenu.List class="flex w-full">
            {#each links as link}
            <NavigationMenu.Item>
                <NavigationMenu.Link>
                    {#snippet child()}
                        <a href={link.href} class={`${shrinkText ? 'mx-2' : 'mx-4'} inline-flex justify-center px-1 py-1.5 border-b-[1.75px] hover:border-b-[2.5px] border-b-secondary-foreground font-medium ${shrinkText ? 'text-sm' : ''}`}>{link.label}</a>
                    {/snippet}
                </NavigationMenu.Link>
                
            </NavigationMenu.Item>
            {/each}
        </NavigationMenu.List>
        {:else}
            <div class="p-8">
                <Drawer.Root direction="right">
                    <Drawer.Trigger>
                        <Tally3 class="transform rotate-90 transition" />
                    </Drawer.Trigger>
                    <Drawer.Content class="max-w-60">
                        <Drawer.Close class="w-full flex justify-end p-1">
                            <X class="w-6 h-6"/>
                        </Drawer.Close>
                        <div class="flex flex-col pt-2 p-6 gap-y-3">
                            <h3 class="text-lg font-semibold mb-1">Navigation Menu</h3>
                            {#each links as link, idx}
                                <div>
                                    <a class="hover:text-muted-foreground " href={link.href}>{link.label}</a>
                                    {#if idx !== links.length-1}
                                        <Separator class="mt-2"/>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </Drawer.Content>
                </Drawer.Root>
            </div>
        {/if}
    </div>
</NavigationMenu.Root>