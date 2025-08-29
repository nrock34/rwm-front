<script>
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { AlertCircle, Bell, ExternalLink, Clock, Calendar, Phone } from "lucide-svelte";

    import { innerWidth } from "svelte/reactivity/window";


    let xs = $derived(innerWidth.current < 400)
    let sm = $derived(innerWidth.current < 640)
    let md = $derived(innerWidth.current < 768)

     const announcements = [
    {
      id: 1,
      title: "New Housing Options Available for Spring 2024",
      content: "We've partnered with additional housing providers in Trastevere and Testaccio neighborhoods.",
      date: "2024-01-15T10:30:00Z",
      type: "housing",
      urgent: false,
      category: "Housing"
    },
    {
      id: 2,
      title: "Visa Processing Updates - Action Required",
      content: "New documentation requirements effective immediately. Submit additional forms by January 25th.",
      date: "2024-01-12T14:15:00Z",
      type: "visa",
      urgent: true,
      category: "Visa & Immigration"
    },
    {
      id: 3,
      title: "Cultural Immersion Workshop Series Begins",
      content: "Monthly workshops to understand Italian culture and customs. Registration required.",
      date: "2025-07-01T09:00:00Z",
      type: "cultural",
      urgent: false,
      category: "Cultural Programs"
    },
    {
      id: 4,
      title: "Emergency Contact System Update",
      content: "New 24/7 emergency hotline active. Update emergency contacts by January 20th.",
      date: "2024-01-08T16:45:00Z",
      type: "safety",
      urgent: true,
      category: "Safety & Security"
    }
  ];

  const deadlines = [
    {name: 'Housing', date: 'Feb 1'},
    {name: 'the goat birthday you already know', date: 'Mar 23'},
  ]

  $inspect(sm, xs)

  const getCategoryColor = (type) => {
    switch (type) {
      case 'visa': return 'bg-red-100 text-red-700';
      case 'housing': return 'bg-blue-100 text-blue-700';
      case 'cultural': return 'bg-green-100 text-green-700';
      case 'safety': return 'bg-orange-100 text-orange-700';
      case 'scholarship': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

</script>


<section class="">
    <div class="max-w-[105rem] mx-6 sm:mx-10 md:mx-14 lg:mx-18 xl:mx-22 w-full py-6 justify-self-center">
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2 leading-tight">
                <Bell class="w-6 h-6 text-primary"/>
                <div>
                    <h2 class="font-bold text-foreground text-sm sm:text-base"> Latest News & Updates </h2>
                    <p class="text-xs sm:text-sm text-foreground/70"> Stay informed on important announcements </p>
                </div>
            </div>
            <div class="flex items-center space-x-3">
                <div class="flex items-center space-x-1">
                    <div class="bg-destructive w-2 h-2 rounded-full animate-pulse"></div>
                    <span class="text-xs sm:text-sm text-secondary-foreground"> Live </span>
                </div>
                <Button class="bg-transparent text-xs sm:text-sm text-primary shadow-none hover:bg-secondary/60">
                    <span>View All</span>
                    <ExternalLink />
                </Button>
            </div>
        </div>

        <div class="grid grid-cols-10 gap-2">
            <!-- main anoiuncement -->
            <div class="col-span-10 md:col-span-7 xl:col-span-8 order-last md:order-none">
                <div class={`grid grid-cols-1 md:grid-cols-2 md:grid-cols-2 gap-2 `}>
                    {#each announcements.slice(0, md ? 1 : announcements.length) as announcement}
                        <Card.Root class="hover:shadow-md p-3 gap-0.5 sm:gap-1.5">
                            <div class="flex items-start justify-between mb-1">
                                <div class="flex items-start gap-1 flex-col-reverse lg:flex-row space-x-1">
                                    <div class="flex items-center space-x-1">
                                        {#if announcement.urgent}
                                            <AlertCircle class="w-3 h-3 flex-shrink-0"/>
                                        {/if}
                                        <span 
                                            class="px-1.5 py-0.5 text-[0.65rem] sm:text-xs font-medium rounded {getCategoryColor(announcement.type)}"
                                        >
                                            {announcement.category}
                                        </span>
                                    </div>
                                    
                                    {#if announcement.urgent}
                                        <Badge class="ml-4 lg:ml-0 text-[0.65rem] sm:text-xs py-0.5" variant="destructive">
                                            URGENT
                                        </Badge>
                                    {/if}
                                </div>
                                <div class="flex items-center text-[0.65rem] sm:text-xs text-gray-500">
                                    <Clock class="h-2.5 w-2.5 mr-1"/>
                                    {getTimeAgo(announcement.date)}
                                </div>
                            </div>

                            <h3 class="text-[0.75rem] sm:text-sm font-medium leading-tight">
                                {announcement.title}
                            </h3>
                            <p class="text-[0.65rem] sm:text-xs">{announcement.content}</p>

                            <div class="flex items-center justify-between mt-auto">
                                <div class="flex items-center text-[0.65rem] sm:text-xs">
                                    <Calendar class="w-4 h-4 mr-2"/>
                                    {new Date(announcement.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                                <Button class="text-[0.65rem] sm:text-xs" variant="ghost">
                                    Read more
                                </Button>
                            </div>
                        </Card.Root>
                    {/each}
                </div>
            </div>

            <div class="space-y-2 col-span-10 md:col-span-3 xl:col-span-2">
                <Card.Root class="bg-destructive/15 border-destructive/35 shadow-none hover:shadow-transparent-500 hover:shadow-sm p-3.5 gap-1.5">
                    <div class="flex items-center mb-1.5">
                        <Phone class="w-3.5 h-3.5 mr-1.5" />
                        <h3 class="font-semibold text-destructive text-xs"> Emergency Contacts </h3>
                    </div>
                    <div class="space-y-0.5 text-xs">
                        <p class="text-destructive/80">
                            Europe
                        </p>
                        <p class="font-bold text-destructive">
                            <span class="font-medium text-foreground">-</span> 112
                        </p>
                    </div>
                </Card.Root>


                 {#if !md}
                    <Card.Root class="p-2 py-3.5 gap-2 ">
                    
                        <Card.Header class="flex flex-col gap-0 leading-3 px-2.5 py-1">
                            <h3 class="text-xs font-medium">Upcoming Deadlines</h3>
                            <p class="font-light text-[0.615rem]">Program & Scholarship deadlines</p>
                        </Card.Header>

                        <Card.Content class="px-2.5">
                            <div class="space-y-0.5 text-xs">
                                {#each deadlines as deadline}
                                    <div class="flex justify-between space-x-1 items-center">
                                        <span class="second-foreground/80"> {deadline.name} </span>
                                        <span class="font-semibold text-accent-foreground/80 text-nowrap"> {deadline.date} </span>
                                    </div>
                                {/each}
                            </div>
                        </Card.Content>
                    </Card.Root>
                {/if}
            </div>

        </div>
    </div>
</section>