<script>
    import { Star } from "lucide-svelte";
    import * as Card from "../ui/card";
    let { similarScholarships = [] } = $props();
</script>

<Card.Root class="p-5 px-6 gap-0">
    <h3 class="text-[0.95rem] font-semibold text-foreground mb-4">Similar Scholarships</h3>
    <div class="divide-y divide-border">
        {#each similarScholarships as similar}
            <div key={similar.id} class="py-3 first:pt-0 last:pb-0">
                <a
                    href={`/scholarships/${similar.id}`}
                    class="font-medium text-foreground hover:text-primary text-[0.92rem]"
                >
                    {similar.title}
                </a>
                <p class="text-xs text-muted-foreground mb-1">{similar.provider}</p>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-muted-foreground"> {similar.amount} </span>
                    <div class="flex items-center space-x-1">
                        <Star class="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{similar.rating}</span>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</Card.Root>
