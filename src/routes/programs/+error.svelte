<script>

    import { page } from "$app/state";

</script>

<div class="flex w-full items-center min-h-[75svh] justify-center h-full gap-x-8 bg-gradient-to-br from-orange-500 from-0% via-orange-400 via-25% to-orange-200 to-100%">
    <div class="flex flex-col items-center">
        <h1 class="text-7xl font-medium">{page.status}</h1>
        <p class="font-medium text-lg"> {page.error.message}</p>
    </div>
    <div class="flex border-l-6 py-4 pr-6 border-foreground rounded-md backdrop-blur bg-white/10">
        <h3 class="text-lg font-light pl-8 inline-flex w-60 tracking-wide leading-tight">Uh oh, something went wrong. This has been logged
             and the administrator has been notified</h3>
    </div>
</div>
