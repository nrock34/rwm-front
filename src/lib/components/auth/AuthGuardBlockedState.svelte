<script>
    import { ArrowLeft, Home, LockKeyhole, ShieldAlert } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";

    let {
        reason = "blocked",
        title = "This page is unavailable",
        message = "You cannot view this page right now.",
        actionLabel = "Go home",
        onClick = $bindable(() => {})
    } = $props();

    const Icon = $derived.by(() => {
        if (reason === "not_authenticated") return LockKeyhole;
        if (reason === "missing_role") return ShieldAlert;
        return Home;
    });

    const iconClasses = $derived.by(() => {
        if (reason === "not_authenticated") return "text-primary";
        if (reason === "missing_role") return "text-destructive";
        return "text-foreground";
    });

    const ActionIcon = $derived.by(() => {
        if (reason === "not_authenticated") return LockKeyhole;
        if (reason === "missing_role") return ArrowLeft;
        return Home;
    });
</script>

<div class="flex min-h-[55vh] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
    <Card.Root class="w-full max-w-xl gap-0 border-border/70  shadow-sm">
        <Card.Content class="flex flex-col items-center gap-5 px-6 py-10 text-center sm:px-10">
            <div class="rounded-full border border-border/70 bg-muted/60 p-4">
                <Icon class={`h-8 w-8 ${iconClasses}`} />
            </div>

            <div class="space-y-2">
                <h1 class="text-2xl font-semibold tracking-tight text-foreground">
                    {title}
                </h1>
                <p class="mx-auto max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                    {message}
                </p>
            </div>

            <Button class="min-w-40 gap-2" onclick={onClick}>
                <ActionIcon class="h-4 w-4" />
                <span>{actionLabel}</span>
            </Button>
        </Card.Content>
    </Card.Root>
</div>
