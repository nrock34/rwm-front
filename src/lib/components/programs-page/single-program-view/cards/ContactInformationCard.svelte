<script>
    import * as Card from "$lib/components/ui/card";
    import { ExternalLink } from "lucide-svelte";

    let { program } = $props();
</script>

<Card.Root class="gap-2 p-6">
    <h3 class="mb-4 font-semibold text-foreground">Contact Information</h3>
    <div class="space-y-3 text-sm">
        <div>
            <p class="font-medium text-foreground">Email</p>
            <p class="text-secondary-foreground">{program?.contact?.email ?? "-"}</p>
        </div>
        <div>
            <p class="font-medium text-foreground">Phone</p>
            <p class="text-secondary-foreground">{program?.contact?.phone ?? "-"}</p>
        </div>
        <div>
            <p class="font-medium text-foreground">Website</p>
            <a
                href={program?.contact?.website ?? "#"}
                class="flex items-center text-primary hover:text-primary/80"
                target="_blank"
                rel="noopener noreferrer"
            >
                Visit Website
                <ExternalLink class="h-3 w-3" />
            </a>
        </div>
        <div>
            <p class="font-medium text-foreground">Address</p>
            <p class="text-xs text-secondary-foreground">
                {program?.contact?.address?.state ?? "-"}
            </p>
        </div>
    </div>
</Card.Root>
