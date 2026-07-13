<script>
    import { ExternalLink } from "lucide-svelte";
    import * as Card from "../ui/card";
    let { scholarship } = $props();

    const contact = $derived(scholarship.contact ?? {});
    const website = $derived(
        typeof contact.website === "string" && contact.website.trim().length > 0 ? contact.website : null
    );
    const hasAnyContact = $derived(
        Boolean(contact.email || contact.phone || contact.address || website)
    );
</script>

<Card.Root
    id="provider-contact"
    class={hasAnyContact
        ? "p-5 px-6 gap-0 bg-muted/15 border-border/70"
        : "p-4 px-5 gap-0 bg-muted/15 border-border/70"}
>
    <h3 class="text-[0.95rem] font-semibold text-foreground mb-3">Contact Information</h3>
    {#if hasAnyContact}
        <div class="space-y-3 text-[0.92rem]">
            {#if contact.email}
                <div>
                    <p class="font-medium text-foreground">Email</p>
                    <p class="text-muted-foreground">{contact.email}</p>
                </div>
            {/if}
            {#if contact.phone}
                <div>
                    <p class="font-medium text-foreground">Phone</p>
                    <p class="text-muted-foreground">{contact.phone}</p>
                </div>
            {/if}
            {#if website}
                <div>
                    <p class="font-medium text-foreground">Website</p>
                    <a
                        class="flex items-center"
                        href={website}
                        rel="noopener noreferrer">
                        Visit Website
                        <ExternalLink class="h-3 w-3 ml-1"/>
                    </a>
                </div>
            {/if}
            {#if contact.address}
                <div>
                    <p class="font-medium text-foreground">Address</p>
                    <p class="text-muted-foreground">{contact.address}</p>
                </div>
            {/if}
        </div>
    {:else}
        <p class="text-[0.9rem] text-muted-foreground">
            Contact information is not available right now.
        </p>
    {/if}
</Card.Root>
