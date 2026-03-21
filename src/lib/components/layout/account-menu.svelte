<script>
    import * as Avatar from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import * as Popover from "$lib/components/ui/popover";
    import { Separator } from "$lib/components/ui/separator";
    import { LogIn, LogOut, Settings2, UserRound, UserRoundPlus } from "lucide-svelte";
    import { getAccountMenuItems, getViewerDisplayName, getViewerInitials } from "./account-menu.js";

    let { viewer } = $props();

    const isAuthenticated = $derived(Boolean(viewer?.isAuthenticated));
    const displayName = $derived(getViewerDisplayName(viewer));
    const initials = $derived(getViewerInitials(viewer));
    const menuItems = $derived(getAccountMenuItems(isAuthenticated));

    const menuIcons = {
        Profile: UserRound,
        Settings: Settings2,
        Logout: LogOut,
        Login: LogIn,
        "Sign Up": UserRoundPlus
    };
</script>

<Popover.Root>
    <Popover.Trigger>
        {#snippet child({ props })}
            <Button
                {...props}
                variant="ghost"
                size="icon"
                class="size-12 rounded-2xl border border-border/70 bg-background/80 shadow-sm transition hover:bg-background"
                aria-label="Account menu"
            >
                <Avatar.Root class="size-9">
                    {#if viewer?.avatar}
                        <Avatar.Image src={viewer.avatar} alt={displayName} />
                    {/if}
                    <Avatar.Fallback class="bg-primary/2 rounded-2xl text-sm font-semibold text-foreground">
                        <UserRound class="size-5 text-foreground" />
                    </Avatar.Fallback>
                </Avatar.Root>
            </Button>
        {/snippet}
    </Popover.Trigger>

    <Popover.Content align="end" class="w-64 p-2">
        <div class="space-y-1 px-2 py-2">
            <p class="text-xs uppercase tracking-[0.14em] text-muted-foreground">Account</p>
            <p class="text-sm font-semibold text-foreground">Hi, {displayName}</p>
            {#if isAuthenticated && viewer?.username}
                <p class="text-xs text-muted-foreground">@{viewer.username}</p>
            {/if}
        </div>

        <Separator class="my-2" />

        <div class="space-y-1">
            {#each menuItems as item}
                {@const Icon = menuIcons[item.label]}
                {#if item.action === "logout"}
                    <form method="POST" action="/auth/logout">
                        <Button type="submit" variant="ghost" class="w-full justify-start px-3">
                            <Icon />
                            <span class="text-sm">{item.label}</span>
                        </Button>
                    </form>
                {:else if item.href}
                    <Button href={item.href} variant="ghost" class="w-full justify-start px-3">
                        <Icon />
                        <span class="text-sm">{item.label}</span>
                    </Button>
                {/if}
            {/each}
        </div>
    </Popover.Content>
</Popover.Root>
