<script>

    let { stats = [] } = $props()

</script>

<section class="py-16 bg-card">
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {#each stats as stat, idx}
                <div key={idx} class="text-center">
                    <div class="text-3xl lg:text-4xl font-bold text-primary mb-2">
                        {stat.number}
                    </div>
                    <div class="text-muted-foreground">
                        {stat.label}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>