<script>
    import * as Card from "../ui/card";
    import { scholarship as fallbackScholarship } from "./testdata";

    let { scholarship = fallbackScholarship } = $props();

    const timeline = $derived(Array.isArray(scholarship.timeline) ? scholarship.timeline : []);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'past':
                return {
                    dot: 'bg-muted-foreground',
                    text: 'text-muted-foreground'
                };
            case 'upcoming':
                return {
                    dot: 'bg-yellow-300',
                    text: 'text-yellow-300'
                };
            case 'current':
                return {
                    dot: 'bg-green-500/80',
                    text: 'text-green-500/80'
                };
            default:
                return {
                    dot: 'bg-muted-foreground',
                    text: 'text-muted-foreground'
                };
        }
    };
</script>

<Card.Root class="p-5 px-6 gap-0">
    <h2 class="text-lg font-semibold text-foreground mb-4">Important Dates</h2>
    <div>
        {#each timeline as item, idx}
            {@const statusClasses = getStatusClasses(item.status)}
            <div key={idx} class="flex items-center space-x-2 mb-3">
                <div class="flex-shrink-0">
                    <div class={`w-4 h-4 rounded-full ${statusClasses.dot} border-muted-foreground/60 border`}></div>
                </div>
                <div class="flex-1 flex justify-between items-center">
                    <span class="text-[0.92rem] font-medium text-foreground">{item.event}</span>
                    <span class={`text-[0.92rem] ${statusClasses.text}`}>
                        {new Date(item.date).toLocaleDateString()}
                    </span>
                </div>
            </div>
        {/each}
    </div>
</Card.Root>
