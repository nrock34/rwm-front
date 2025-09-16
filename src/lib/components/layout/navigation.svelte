<script>
    import * as NavigationMenu from "../ui/navigation-menu";
    import Globe from "$lib/assets/logos/VX78WS01.svelte";
    import { MapPin } from "lucide-svelte";

    import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";

    let { class: className } = $props()

    const links = [
        // {label: 'Resources', href: '/resources', desc: 'Link to resources page'},
        {label: 'Postcards', href: '/postcards', desc: 'Link to postcards page'},
        {label: 'Programs', href: '/programs', desc: 'Link to programs page'},
        {label: 'Community', href: '/community', desc: 'Link to community page'},
        {label: 'About Us', href: '/about', desc: 'Link to about us page'},
        {label: 'Contact', href: '/contact', desc: 'Link to contact page'},
    ]
</script>



<NavigationMenu.Root viewport={false} class={` max-w-full ${className}`}>
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
        

        <NavigationMenu.List class="flex w-full">
            <NavigationMenu.Item>
                {#each links as link}
                    <NavigationMenu.Link>
                        {#snippet child()}
                            <a href={link.href} class={`mx-4 px-1 py-1.5 border-b-[0.75px] hover:border-b-[1.5px] border-b-secondary-foreground`}>{link.label}</a>
                        {/snippet}
                    </NavigationMenu.Link>
                {/each}
            </NavigationMenu.Item>
        </NavigationMenu.List>
    </div>
</NavigationMenu.Root>