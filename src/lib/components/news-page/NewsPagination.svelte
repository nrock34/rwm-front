<script>
    import PaginationControls from "$lib/components/shared/PaginationControls.svelte";
    import { createListController } from "$lib/components/shared/listing/controller.svelte.js";

    let {
        newsItems,
        selectedCategory,
        selectedSort,
        searchQuery,
        itemsPerPage,
        currentPage,
        paginatedNews = $bindable(),
        filteredNews: filteredNewsUp = $bindable(),
        passedClass
    } = $props();

    const listController = $derived.by(() => createListController({
        items: newsItems,
        filters: [
            (item) => selectedCategory === "all" || item.category === selectedCategory
        ],
        search: (item) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                String(item.title ?? "").toLowerCase().includes(query) ||
                String(item.excerpt ?? "").toLowerCase().includes(query)
            );
        },
        sort: (a, b) => {
            switch (selectedSort) {
                case "date":
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case "popularity":
                    return (Number(b.views ?? 0) + Number(b.comments ?? 0) + Number(b.shares ?? 0))
                        - (Number(a.views ?? 0) + Number(a.comments ?? 0) + Number(a.shares ?? 0));
                case "relevance":
                    return Number(b.views ?? 0) - Number(a.views ?? 0);
                default:
                    return 0;
            }
        },
        page: currentPage,
        perPage: itemsPerPage
    }));

    const totalPages = $derived(listController.totalPages);

    $effect(() => {
        if (currentPage !== listController.page) {
            currentPage = listController.page;
        }
        paginatedNews = listController.paginated;
        filteredNewsUp = listController.filtered;
    });

</script>

<PaginationControls bind:currentPage {totalPages} {passedClass} />
