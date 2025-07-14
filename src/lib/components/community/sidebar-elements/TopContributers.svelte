<script>
    import * as Avatar from "$lib/components/ui/avatar";
    import AvatarFallback from "$lib/components/ui/avatar/avatar-fallback.svelte";
    import AvatarImage from "$lib/components/ui/avatar/avatar-image.svelte";
    import { Badge } from "$lib/components/ui/badge";
    import * as Card from "$lib/components/ui/card";
    import { Separator } from "$lib/components/ui/separator";
    import { Star } from "lucide-svelte";


    const topContributors = [
    {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      posts: 24,
      badge: 'Community Leader'
    },
    {
      name: 'Marco Rossi',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      posts: 18,
      badge: 'Local Expert'
    },
    {
      name: 'Emma Chen',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      posts: 15,
      badge: 'Helpful Guide'
    }
  ];


</script>

<Card.Root>
    <Card.Header>
        <div class="flex items-center space-x-3">
            <Star class="text-ring w-6 h-6"/>
            <h3 class="text-md font-semibold">Top Contributors</h3>
        </div>
        <Separator class="mt-2"/>
    </Card.Header>
    <Card.Content class="space-y-2.5">
        {#each topContributors as contributor}
            <div key={contributor.name} class="flex items-center space-x-3">
                <Avatar.Root class="w-10 h-10 border-[2.5px] border-ring">
                    <Avatar.Image src={contributor.avatar}/>
                    <Avatar.Fallback>
                        {contributor.name}
                    </Avatar.Fallback>
                </Avatar.Root>
                <div class="flex-1">
                    <p class="text-foreground text-sm font-medium">
                        {contributor.name}
                    </p>
                    <div>
                        <span class="text-xs text-muted-foreground pr-3"> {contributor.posts} posts</span>
                        <Badge class="h-6 text-xs bg-secondary text-accent-foreground font-normal">
                            {contributor.badge}
                        </Badge>
                    </div>
                </div>
            </div>
        {/each}
    </Card.Content>
</Card.Root>