<script>

    import * as Card from "$lib/components/ui/card"
    import { Star } from "lucide-svelte";

    let { testimonials = [] } = $props()
</script>

<section class="py-20 bg-background">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Loved by Students Worldwide
        </h2>
        <p class="text-xl text-secondary-foreground/85">
            See what our community members have to say about their experience
        </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
        {#each testimonials as testimonial, idx}
            <Card.Root key={idx} class="card gap-3 p-6">
                <div class="flex items-center space-x-1 mb-0">
                    {#each Array.from({ length: testimonial.rating }) as _, i }
                        <Star key={i} class="h-4 w-4 text-yellow-500 fill-current" />
                    {/each}
                </div>
                <p class="text-foreground mb-2 italic">"{testimonial.quote}"</p>
                <div class="flex items-center space-x-3">
                    <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        class="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <p class="font-medium text-foreground">{testimonial.name}</p>
                        <p class="text-sm text-muted-foreground">{testimonial.university}</p>
                        <p class="text-xs text-muted-foreground">{testimonial.program}</p>
                    </div>
                </div>
            </Card.Root>
        {/each}
        </div>
    </div>
 </section>