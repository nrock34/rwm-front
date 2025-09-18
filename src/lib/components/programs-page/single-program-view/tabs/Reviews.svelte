<script>
    import { Star } from "lucide-svelte";
    
    let { program } = $props();

</script>


<div class="space-y-6">
    <div>
        <h3 class="text-lg font-semibold text-foreground mb-3">Student Reviews</h3>
        <div class="space-y-4">
            {#each program.testimonials as testimonial, idx}
                <div key={idx} class="border border-border rounded-(--radius) p-4 bg-background">
                    <div class="flex items-start space-x-3">
                        <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            class="w-10 h-10 rounded-full object-cover"
                        />
                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-2">
                                <div>
                                    <h4 class="font-medium text-foreground">{testimonial.name}</h4>
                                    <p class="text-xs text-secondary-foreground">{testimonial.program}</p>
                                </div>
                                <div class="flex items-center space-x-1">
                                    {#each Array.from({length: 5}) as _, idx}
                                        <Star key={idx} class={`h-3 w-3 ${idx + 1 < testimonial.rating ? 'text-yellow-500' : 'text-muted-foreground/60'} fill-current`}/>
                                    {/each}
                                </div>
                            </div>
                            <p class="text-sm text-secondary-foreground">{testimonial.text}</p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>