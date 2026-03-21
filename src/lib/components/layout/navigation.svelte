<script>
    import * as NavigationMenu from "../ui/navigation-menu";
    import Globe from "$lib/assets/logos/VX78WS01.svelte";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import AccountMenu from "./account-menu.svelte";
    import { LogIn, LogOut, Settings2, Tally3, UserRound, UserRoundPlus, X } from "lucide-svelte";
    import { innerWidth } from "svelte/reactivity/window";
    import * as Drawer from "../ui/drawer";
    import { Separator } from "../ui/separator";
    import { getAccountMenuItems, getViewerDisplayName, getViewerInitials } from "./account-menu.js";

    let {
        auth = { isAuthenticated: false, isOnboarded: false, roles: [], claims: null },
        viewer = { isAuthenticated: false, name: null, avatar: null, username: null },
        class: className
    } = $props()

    const links = [
        {label: 'Postcards', href: '/postcards', desc: 'Link to postcards page'},
        {label: 'Programs', href: '/programs', desc: 'Link to programs page'},
        {label: 'Community', href: '/community', desc: 'Link to community page'},
        {label: 'About Us', href: '/about', desc: 'Link to about us page'},
    ]

    let isDesktop = $derived(innerWidth.current > 600);
    let shrinkText = $derived(innerWidth.current < 810)
    const displayName = $derived(getViewerDisplayName(viewer))
    const initials = $derived(getViewerInitials(viewer))
    const accountItems = $derived(getAccountMenuItems(Boolean(auth?.isAuthenticated)))

    const menuIcons = {
        Profile: UserRound,
        Settings: Settings2,
        Logout: LogOut,
        Login: LogIn,
        "Sign Up": UserRoundPlus
    }

</script>



<NavigationMenu.Root viewport={false} class={`px-6 sm:px-8 lg:px-12 max-w-full ${className}`}>
    <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
        <a href="/">
            <div class="flex items-center gap-x-1 mx-3">
                <Globe class="h-20 w-20 fill-primary"/>
                <div class="brand-lockup-tight flex flex-col">
                    <h3 class="font-bold text-2xl">RomeWithMe</h3>
                    <p class="tracking-tight text-foreground/85 text-sm">Grow Roots in New Places</p>
                </div>
            </div>
        </a>
        
        {#if isDesktop}
            <div class="flex min-w-0 flex-1 items-center justify-end gap-4">
                <NavigationMenu.List class="flex items-center justify-center">
                    {#each links as link}
                        <NavigationMenu.Item>
                            <NavigationMenu.Link>
                                {#snippet child()}
                                    <a href={link.href} class={`${shrinkText ? 'mx-2 text-sm' : 'mx-4'} inline-flex justify-center border-b-[1.75px] border-b-secondary-foreground px-1 py-1.5 font-medium hover:border-b-[2.5px]`}>{link.label}</a>
                                {/snippet}
                            </NavigationMenu.Link>
                        </NavigationMenu.Item>
                    {/each}
                </NavigationMenu.List>

                <AccountMenu {viewer} />
            </div>
        {:else}
            <div class="flex items-center">
                <Drawer.Root direction="right">
                    <Drawer.Trigger>
                        <Tally3 class="transform rotate-90 transition" />
                    </Drawer.Trigger>
                    <Drawer.Content class="max-w-72">
                        <Drawer.Close class="w-full flex justify-end p-1">
                            <X class="w-6 h-6"/>
                        </Drawer.Close>
                        <div class="flex flex-col gap-y-4 p-6 pt-2">
                            <h3 class="text-lg font-semibold mb-1">Navigation Menu</h3>
                            {#each links as link, idx}
                                <div>
                                    <a class="hover:text-muted-foreground " href={link.href}>{link.label}</a>
                                    {#if idx !== links.length-1}
                                        <Separator class="mt-2"/>
                                    {/if}
                                </div>
                            {/each}

                            <Separator class="mt-2" />

                            <div class="space-y-3">
                                <div class="flex items-center gap-3">
                                    <Avatar.Root class="size-11 border border-border/60">
                                        {#if viewer?.avatar}
                                            <Avatar.Image src={viewer.avatar} alt={displayName} />
                                        {/if}
                                        <Avatar.Fallback class="bg-primary/12 font-semibold text-foreground">
                                            {initials}
                                        </Avatar.Fallback>
                                    </Avatar.Root>
                                    <div class="space-y-0.5">
                                        <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Account</p>
                                        <p class="font-semibold text-foreground">Hi, {displayName}</p>
                                        {#if auth?.isAuthenticated && viewer?.username}
                                            <p class="text-sm text-muted-foreground">@{viewer.username}</p>
                                        {/if}
                                    </div>
                                </div>

                                <div class="space-y-1">
                                    {#each accountItems as item}
                                        {@const Icon = menuIcons[item.label]}
                                        {#if item.action === "logout"}
                                            <form method="POST" action="/auth/logout">
                                                <Button type="submit" variant="ghost" class="w-full justify-start px-3">
                                                    <Icon />
                                                    <span>{item.label}</span>
                                                </Button>
                                            </form>
                                        {:else if item.href}
                                            <Button href={item.href} variant="ghost" class="w-full justify-start px-3">
                                                <Icon />
                                                <span>{item.label}</span>
                                            </Button>
                                        {/if}
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </Drawer.Content>
                </Drawer.Root>
            </div>
        {/if}
    </div>
</NavigationMenu.Root>
