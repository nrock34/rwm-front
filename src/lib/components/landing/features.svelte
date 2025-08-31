<script>
    import * as Card from "$lib/components/ui/card";


    let { features = [] } = $props()

</script>

<section class="py-20 bg-background">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything You Need for Study Abroad Success
        </h2>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
            From finding scholarships to connecting with fellow students, RomeWithMe provides all the tools and support you need.
        </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each features as feature, idx}
            {@const Icon = feature.icon}
            <Card.Root key = {idx} class="gap-3.5 p-6 text-center">
                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Icon class="h-6 w-6 text-primary"/>
                </div>
                <h3 class="text-lg font-semibold text-foreground">
                    {feature.title}
                </h3>
                <p class="text-muted-foreground">{feature.description}</p>
            </Card.Root>
        {/each}
        </div>
    </div>
</section>
