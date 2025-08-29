<script>
    import { Bookmark, Calendar, Mail, MessageSquare, Phone, Settings2, MapPin, User, IdCard } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import Activity from "$lib/components/profile-page/self-tabs/Activity.svelte";
    import ApplicationTracker from "$lib/components/profile-page/self-tabs/ApplicationTracker.svelte";
    import Bookmarked from "$lib/components/profile-page/self-tabs/Bookmarked.svelte";
    import Dashboard from "$lib/components/profile-page/self-tabs/Dashboard.svelte";
    import Settings from "$lib/components/profile-page/self-tabs/Settings.svelte";
    // import { profileData } from "$lib/components/profile-page/test";
    import Info from "$lib/components/profile-page/self-tabs/Info.svelte";
    import { getTokenState } from "$lib/stores/jwt.svelte.js";
    import { onMount } from "svelte";

    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    let activeTab = $state('settings');

    let { data, children } = $props();

    let { profileData } = data

    const tokenState = getTokenState();

    const tabs = [
        { pos: 5, id: 'activity', name: 'Activity', component: () => Activity, icon: MessageSquare },
        { pos: 3, id: 'applications', name: 'Applications Tracker', component: () => ApplicationTracker, icon: Calendar },
        { pos: 4, id: 'bookmarks', name: 'Bookmared Items', component: () => Bookmarked, icon: Bookmark },
        { pos: 1, id: 'dashboard', name: 'Dashboard', component: () => Dashboard, icon: User },
        { pos: 6, id: 'settings', name: 'Account Settings', component: () => Settings, icon: Settings2 },
        { pos: 2, id: 'info', name: 'Account Info', component: () => Info, icon: IdCard}
    ].sort((a, b) => a.pos - b.pos)

    let tabsLength = tabs.length


    const pickTabComponent = (id) => {
        return tabs.find((tab) => tab.id === activeTab).component
    }

    const ActiveTabComponent = $derived( 
        tabs.find((tab) => tab.id === activeTab)?.component()
    )
    
    onMount(async () => {
        if (tokenState.isExpired) await tokenState.refreshAccessToken()
        console.log(tokenState.token)
    })

    $effect(() => {
        const paths = $page.url.pathname.split('/')
        if (paths.length > 3) {
            goto('/profile/dashboard')
        }
        activeTab = paths[2]
        console.log(paths)
    })

</script>


<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <div class="grid lg:grid-cols-4 gap-4 lg:gap-8">

        <!-- profile sidebar -->
        <div class="lg:col-span-1">

            <Card.Root class="p-6 gap-0 mb-6">
                <div class="text-center mb-4">
                    <div class="relative inline-block">
                        <img
                            src={profileData.avatar}
                            alt={profileData.name}
                            class="w-24 h-24 rounded-full object-cover mx-auto"
                        />
                    </div>
                    <h2 class="text-xl font-semibold text-foreground mt-3">
                        {profileData.name}
                    </h2>
                    <p class="text-sm text-muted-foreground">{profileData.major}</p>
                    <p class="text-sm text-muted-foreground">{profileData.university}</p>
                </div>

                <div class="space-y-2.5">
                    <div class="flex items-center space-x-2.5 text-sm">
                        <Mail class="h-4 w-4 text-secondary-foreground" />
                        <span class="text-secondary-foreground">{profileData.email}</span>
                    </div>
                    <div class="flex items-center space-x-2.5 text-sm">
                        <MapPin class="h-4 w-4 text-secondary-foreground" />
                        <span class="text-secondary-foreground">{profileData.location}</span>
                    </div>
                    <p class="text-sm text-secondary-foreground mt-3.5">
                        {profileData.bio}
                    </p>
                </div>

            </Card.Root>


            <!-- side navigation -->
            <nav class={`space-y-1.5 grid grid-cols-6 gap-x-0 lg:gap-y-1 lg:grid-cols-1`}>
                {#each tabs as tab}
                    {@const IconComponent = tab.icon}
                    <Button
                        href={`/profile/${tab.id}`}
                        data-sveltekit-noscroll
                        data-sveltekit-preload-data="hover"
                        key={tab.id}
                        onclick={() => activeTab = tab.id}
                        class={`sm:w-full h-full w-full items-center lg:!justify-start !justify-center flex flex-col lg:flex-row lg:gap-x-2 gap-0 shadow-none bg-transparent 
                            ${activeTab === tab.id
                                ? 'border-b-4 border-primary rounded-b-xs lg:bg-primary text-foreground/90 hover:bg-primary/15 bg-primary/10' 
                                : 'text-foreground/70 lg:hover:bg-muted lg:hover:text-foreground hover:bg-transparent hover:border-b-4 hover:border-secondary/80'} rounded-b-xs lg:border-none lg:rounded-(--radius) justify-start transition-none
                        `}>
                        <IconComponent class="h-4 w-4 m-0 mb-1 lg:mb-0" />
                        <span class="text-[0.65rem] sm:text-xs lg:text-sm font-medium text-wrap text-center lg:pl-2">{tab.name}</span>
                    </Button>
                {/each}
            </nav>
        </div>

        <div class="lg:col-span-3">
            {@render children()}
            <!-- <ActiveTabComponent { data }/> -->
        </div>

    </div>

</div>