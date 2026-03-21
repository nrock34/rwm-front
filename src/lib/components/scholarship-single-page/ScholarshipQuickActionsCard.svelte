<script>
    import * as Card from "../ui/card";
    import Button from "../ui/button/button.svelte";
    import { scholarship as fallbackScholarship } from "./testdata";

    let { scholarship = fallbackScholarship } = $props();

    const normalizeLink = (value) => {
        if (typeof value !== "string") return null;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    };

    const actions = $derived.by(() => {
        const contact = scholarship.contact ?? {};
        const applicationLink = normalizeLink(scholarship.applicationLink);
        const websiteLink = normalizeLink(contact.website);
        const hasProviderContact = Boolean(
            normalizeLink(contact.email) ||
            normalizeLink(contact.phone) ||
            normalizeLink(contact.address)
        );

        return {
            applicationLink,
            websiteLink,
            hasProviderContact,
            hasAny: Boolean(applicationLink || websiteLink || hasProviderContact)
        };
    });
</script>

<Card.Root
    class={actions.hasAny
        ? "p-5 px-6 gap-0 bg-muted/10 border-border/70"
        : "p-4 px-5 gap-0 bg-muted/10 border-border/70"}
>
    <h3 class="text-[0.95rem] font-semibold text-foreground mb-3">Quick Actions</h3>
    {#if actions.hasAny}
        <div class="space-y-3">
            {#if actions.applicationLink}
                <Button class="w-full" href={actions.applicationLink} rel="noopener noreferrer">
                    I Want To Apply
                </Button>
            {/if}
            {#if actions.websiteLink}
                <Button class="w-full" href={actions.websiteLink} rel="noopener noreferrer">
                    Visit Website
                </Button>
            {/if}
            {#if actions.hasProviderContact}
                <Button class="w-full" href="#provider-contact">
                    Contact Provider
                </Button>
            {/if}
        </div>
    {:else}
        <p class="text-[0.9rem] text-muted-foreground">
            No actions available right now
        </p>
    {/if}
</Card.Root>
