<script>
    import { ChevronsLeft, ChevronsRight } from "lucide-svelte";
    import * as Pagination from "$lib/components/ui/pagination";

    let {
        currentPage = $bindable(),
        totalPages = 0,
        passedClass = ""
    } = $props();
</script>

<div class={passedClass ? ` ${passedClass}` : ""}>
    {#if totalPages > 1}
        <Pagination.Root bind:page={currentPage} count={totalPages} perPage={1} siblingCount={1}>
            {#snippet children({ pages, currentPage: activePage })}
                <Pagination.Content>
                    <Pagination.Item>
                        <Pagination.PrevButton>
                            <ChevronsLeft class="size-4" />
                        </Pagination.PrevButton>
                    </Pagination.Item>
                    {#each pages as page (page.key)}
                        {#if page.type === "ellipsis"}
                            <Pagination.Item>
                                <Pagination.Ellipsis />
                            </Pagination.Item>
                        {:else}
                            <Pagination.Item>
                                <Pagination.Link {page} isActive={activePage === page.value}>
                                    {page.value}
                                </Pagination.Link>
                            </Pagination.Item>
                        {/if}
                    {/each}
                    <Pagination.Item>
                        <Pagination.NextButton>
                            <ChevronsRight class="size-4" />
                        </Pagination.NextButton>
                    </Pagination.Item>
                </Pagination.Content>
            {/snippet}
        </Pagination.Root>
    {/if}
</div>
