<script>

    import { page } from "$app/state";

</script>

<div class="flex flex-col w-full items-center justify-center h-full">
    <h1>{page.status}. {page.error.message}</h1>
</div>
