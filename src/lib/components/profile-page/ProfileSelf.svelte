<script>
    import { Bookmark, Calendar, Mail, MessageSquare, Phone, Settings2, MapPin, User } from "lucide-svelte";
    import { Button } from "../ui/button";
    import * as Card from "../ui/card";
    import Activity from "./self-tabs/Activity.svelte";
    import ApplicationTracker from "./self-tabs/ApplicationTracker.svelte";
    import Bookmarked from "./self-tabs/Bookmarked.svelte";
    import Dashboard from "./self-tabs/Dashboard.svelte";
    import Settings from "./self-tabs/Settings.svelte";
    import { profileData } from "./test";

    let activeTab = $state('settings');

    let { data } = $props();

    const tabs = [
        { id: 'acitivity', name: 'Activity', component: () => Activity, icon: MessageSquare },
        { id: 'applications', name: 'Applications Tracker', component: () => ApplicationTracker, icon: Calendar },
        { id: 'bookmarks', name: 'Bookmared Items', component: () => Bookmarked, icon: Bookmark },
        { id: 'dashboard', name: 'Dashboard', component: () => Dashboard, icon: User },
        { id: 'settings', name: 'Account Settings', component: () => Settings, icon: Settings2 },
    ]

    const pickTabComponent = (id) => {
        return tabs.find((tab) => tab.id === activeTab).component
    }

    const ActiveTabComponent = $derived( 
        tabs.find((tab) => tab.id === activeTab)?.component()
    )
    
    console.log( data )


</script>


<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <div class="grid lg:grid-cols-4 gap-8">

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
                        <Mail class="h-5 w-5 text-secondary-foreground" />
                        <span class="text-secondary-foreground">{profileData.email}</span>
                    </div>
                    <div class="flex items-center space-x-2.5 text-sm">
                        <MapPin class="h-5 w-5 text-secondary-foreground" />
                        <span class="text-secondary-foreground">{profileData.location}</span>
                    </div>
                    <p class="text-sm text-secondary-foreground mt-3.5">
                        {profileData.bio}
                    </p>
                </div>

            </Card.Root>


            <!-- side navigation -->
            <nav class="space-y-1.5">
                {#each tabs as tab}
                    {@const IconComponent = tab.icon}
                    <Button
                        key={tab.id}
                        onclick={() => activeTab = tab.id}
                        class={`w-full items-center space-x-2 px-4 py-6 shadow-none bg-transparent 
                            ${activeTab === tab.id
                                ? 'bg-primary text-foreground/90' 
                                : 'text-foreground/70 hover:bg-muted hover:text-foreground'} justify-start
                        `}>
                        <IconComponent class=" h-4 w-4" />
                        <span class="text-sm font-medium">{tab.name}</span>
                    </Button>
                {/each}
            </nav>
        </div>

        <div class="lg:col-span-3">
            <ActiveTabComponent { data } />
        </div>

    </div>

</div>