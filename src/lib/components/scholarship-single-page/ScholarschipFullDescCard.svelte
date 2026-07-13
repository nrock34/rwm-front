<script>
    import * as Card from "../ui/card";
    let { scholarship } = $props();

    const paragraphs = $derived(
        String(scholarship.fullDescription ?? scholarship.description ?? "")
            .split('\n\n')
            .filter(Boolean)
    );
</script>

<Card.Root class="p-5 px-6 gap-0">
                <h2 class="text-lg font-semibold text-foreground mb-4">
                    About This Scholarship
                </h2>
                <div class="prose prose-sm max-w-none text-[0.95rem] text-muted-foreground">
                    {#each paragraphs as paragraph, idx}
                        <p key={idx} class="mb-3">  {paragraph} </p>
                    {/each}
                </div>
            </Card.Root>
