<script>
    import { ChevronsLeft, ChevronsRight } from "lucide-svelte";

    import * as Pagination from '$lib/components/ui/pagination'
    import {Button} from "../ui/button/";
    

    let { newsItems, selectedCategory, selectedSort,
         searchQuery, itemsPerPage, currentPage,
         paginatedNews = $bindable(), filteredNews: filteredNewsUp = $bindable(),
        passedClass } = $props();

    const filteredNews = $derived(newsItems.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = searchQuery === '' || 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesSearch
    }))

    const sortedNews = $derived.by(() => [...filteredNews].sort((b, a) => {
        let ssort = selectedSort
        switch (ssort) {
            case 'date':
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case 'popularity':
                return (b.views + b.comments + b.shares) - (a.views + a.comments + a.shares)
            case 'relevance':
                return b.views - a.views
            default:
                return 0;
        }
    }))

    const totalPages = $derived(Math.ceil(sortedNews.length / itemsPerPage));

    $effect(() => {
        if (totalPages < currentPage){
            currentPage = totalPages
        }
        paginatedNews = sortedNews.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )
        filteredNewsUp = filteredNews
    })
    
    

</script>

<div class={(" " + passedClass)}>
{#if totalPages > 1}
    <Pagination.Root bind:page={currentPage} count={totalPages} perPage={1} siblingCount={1}>
        {#snippet children({ pages, currentPage})}
            <Pagination.Content>
                <Pagination.Item>
                    <Pagination.PrevButton>
                        <ChevronsLeft class="size-4"/>
                    </Pagination.PrevButton>
                </Pagination.Item>
                {#each pages as page (page.key)}
                    {#if page.type === "ellipsis"}
                        <Pagination.Item>
                            <PaginationEllipsis />
                        </Pagination.Item>
                    {:else}
                        <Pagination.Item>
                            <Pagination.Link {page} isActive={currentPage === page.value}>
                                {page.value}
                            </Pagination.Link>
                        </Pagination.Item>
                    {/if}
                {/each}
                <Pagination.Item>
                    <Pagination.NextButton>
                        <ChevronsRight class="size-4"/>
                    </Pagination.NextButton>
                </Pagination.Item>
            </Pagination.Content>
        {/snippet}
    </Pagination.Root>
{/if}

</div>

