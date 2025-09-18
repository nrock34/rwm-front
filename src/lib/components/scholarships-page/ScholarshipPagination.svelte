<script>
    import { ChevronsLeft, ChevronsRight } from "lucide-svelte";

    import * as Pagination from '$lib/components/ui/pagination'
    import {Button} from "../ui/button";
    

    let { scholarshipItems, filters, selectedSort,
         searchQuery, itemsPerPage, currentPage,
         paginatedScholarships = $bindable(), filteredScholarships: filteredScholarshipsUp = $bindable(),
        passedClass } = $props();

    const filteredScholarships = $derived(scholarshipItems.filter(item => {

        const matchesCategory = filters.category === 'all' || item.category === filters.category;
        const matchesCountry = filters.country === 'all' || item.country === filters.country;
        const matchesLevel = filters.educationLevel === 'all' || item.educationLevel === filters.educationLevel;
        const matchesField = filters.field === 'all' || item.field === filters.field;
        const matchesSearch = searchQuery === '' || 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.eligibility.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.provider.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesCountry && matchesLevel && matchesField && matchesSearch
    }))

    const sortedScholarships = $derived.by(() => [...filteredScholarships].sort((a, b) => {
        switch (selectedSort) {
            case 'deadline':
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            case 'amount':
                return b.amount.localeCompare(a.amount)
            case 'rating':
                return b.rating - a.rating
            case 'popularity':
                return b.applicants - a.applicants
            default:
                return 0;
        }
    }))

    const totalPages = $derived(Math.ceil(sortedScholarships.length / itemsPerPage));

    $effect(() => {
        if (totalPages < currentPage){
            currentPage = totalPages || 1
        }
        paginatedScholarships = sortedScholarships.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )
        filteredScholarshipsUp = filteredScholarships
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

