<script>
    import { AlertCircle, Bookmark, Calendar, DollarSign, MapPin, Share2, Star, Users } from "lucide-svelte";
    import { Badge } from "../ui/badge";
    import * as Card from "../ui/card";
    import { Button } from "../ui/button";
    import { Toggle } from "../ui/toggle";
    import { toast } from "svelte-sonner";
    let {
        scholarship,
        daysLeft = 0
    } = $props();

    let isScholarshipSaved = $state(false);
    const shouldShowApplicantMeta = scholarship.applicants != null && scholarship.awarded != null;
    const showDeadlineAlert = $derived(
        daysLeft === 'TODAY' || (typeof daysLeft === 'number' && daysLeft >= 0 && daysLeft <= 14)
    );
    const successRate = $derived(
        typeof scholarship.successRate === "string" ? scholarship.successRate.trim() : ""
    );
    const hasSuccessRate = $derived(
        Boolean(successRate && successRate.toLowerCase() !== "not provided")
    );
    const headerMetricGridClass = $derived(
        hasSuccessRate ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3"
    );

    async function handleShare() {
        if (typeof window === "undefined") return;

        const shareData = {
            title: scholarship.title,
            text: `Check out this scholarship: ${scholarship.title}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            await navigator.clipboard.writeText(window.location.href);
            toast.success("Scholarship link copied");
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return;
            toast.error("Couldn't share this scholarship right now");
        }
    }
</script>

<Card.Root class="p-5 px-6 gap-0">
    <Card.Header class="mb-3 p-0">
        <div class="mb-1.5 flex items-start justify-between gap-3">
            <div class="flex min-w-0 items-center space-x-2">
                <h1 class="text-[1.75rem] md:text-[1.85rem] leading-[1.08] font-bold text-foreground">
                    {scholarship.title}
                </h1>
                {#if scholarship.featured}
                    <Badge class="text-[0.7rem]">
                        Featured
                    </Badge>
                {/if}
            </div>
            <div class="flex flex-shrink-0 items-center space-x-2 pt-0.5">
                <Toggle
                    onPressedChange={() => {isScholarshipSaved = !isScholarshipSaved}}
                    >
                    <Bookmark class={isScholarshipSaved ? 'fill-current transition' : ''}/>
                </Toggle>
                <Button class="bg-muted hover:bg-muted/70 transition-colors" onclick={handleShare} type="button">
                    <Share2 class="h-4 w-4 text-secondary-foreground"/>
                </Button>
            </div>
        </div>

        <div>
            <p class="text-[0.95rem] font-medium text-secondary-foreground mb-1.5">
                {scholarship.provider}
            </p>
            <div class="flex items-center space-x-1 text-[0.92rem]">
                <Star class="h-3.5 w-3.5 text-yellow-500 fill-current" />
                <span class="font-medium">{scholarship.rating}</span>
                {#if shouldShowApplicantMeta}
                    <span class="text-muted-foreground">
                        ({scholarship.applicants} applicants, {scholarship.awarded} awarded)
                    </span>
                {/if}
            </div>
        </div>
    </Card.Header>

    <Card.Content class="p-0">
        <div class={`grid gap-3 mb-3 ${headerMetricGridClass}`}>
            <div class="flex items-center space-x-2">
                <DollarSign class="h-3.5 w-3.5 text-secondary-foreground"/>
                <div>
                    <p class="text-[0.92rem] font-medium">{scholarship.amount}</p>
                    <p class="text-xs text-muted-foreground">Award Amount</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <Calendar class="h-3.5 w-3.5 text-secondary-foreground"/>
                <div>
                    <p class="text-[0.92rem] font-medium">
                        {new Date(scholarship.deadline).toLocaleDateString()}
                    </p>
                    <p class="text-xs text-muted-foreground">Deadline</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <MapPin class='h-3.5 w-3.5 text-secondary-foreground'/>
                <div>
                    <p class="text-[0.92rem] font-medium">{scholarship.location}</p>
                    <p class="text-xs text-muted-foreground">Location</p>
                </div>
            </div>
            {#if hasSuccessRate}
                <div class="flex items-center space-x-2">
                    <Users class="h-3.5 w-3.5 text-secondary-foreground"/>
                    <div>
                        <p class="text-[0.92rem] font-medium">{successRate}</p>
                        <p class="text-xs text-muted-foreground">Success Rate</p>
                    </div>
                </div>
            {/if}
        </div>

        {#if showDeadlineAlert}
            <div class="bg-yellow-50 border border-yellow-200 rounded-(--radius) p-4 mb-4">
                <div class="flex items-center space-x-2">
                    <AlertCircle class="h-6 w-6 text-destructive/70"/>
                    <span class="text-[0.92rem] font-medium text-destructive">
                        Deadline approaching: {daysLeft === 'TODAY' ? 0 : daysLeft} days remaining
                    </span>
                </div>
            </div>
        {/if}
        
        <p class="text-[0.92rem] text-muted-foreground leading-relaxed">{scholarship.description}</p>
    </Card.Content>
</Card.Root>
