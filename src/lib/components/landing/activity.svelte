<script>

    import * as Card from "$lib/components/ui/card";
    import { ArrowRight, Heart, MessageCircle } from "lucide-svelte";
    let { recentActivity = [] } = $props()

</script>

<section class="py-20 bg-secondary/30">
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                    Join the Conversation
                </h2>
                <p class="text-xl text-muted-foreground mb-8">
                    See what's happening in our community right now. Connect with students, share experiences, and get real-time support.
                </p>
             
                <div class="space-y-4">
                    {#each recentActivity as activity, idx}
                        {@const Icon = activity.icon}
                        <div key={idx} class="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border">
                            <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Icon class="h-4 w-4 text-primary" />
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-foreground">{activity.title}</p>
                                <p class="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                    {/each}
                </div>
             
                <a href="/community" class="btn-primary mt-6 inline-flex items-center">
                    View Community Feed
                    <ArrowRight class="h-4 w-4 ml-2" />
                </a>
            </div>
           
            <div class="relative">
                <Card.Root class="card gap-1.5 p-6">
                    <div class="flex items-center space-x-3 mb-2">
                        <img
                            src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop"
                            alt="Marco"
                            class="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p class="font-medium text-foreground">Marco Benedetti</p>
                            <p class="text-xs text-muted-foreground">Local Expert • 2 hours ago</p>
                        </div>
                    </div>
                    <p class="text-foreground mb-1">
                    Amazing sunset from the Spanish Steps tonight! Rome never fails to take my breath away 🌅
                    </p>
                    <img
                        src="https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
                        alt="Rome sunset"
                        class="w-full h-32 object-cover rounded mb-2"
                    />
                    <div class="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div class="flex items-center space-x-1">
                            <Heart class="h-4 w-4" />
                            <span>89</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <MessageCircle class="h-4 w-4" />
                            <span>23</span>
                        </div>
                    </div>
                </Card.Root>
            </div>
        </div>
    </div>
</section>