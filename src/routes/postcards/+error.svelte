<script>
	import { page } from "$app/state";
	import { CircleAlert } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";
</script>

<svelte:head><title>Postcards unavailable | RomeWithMe</title></svelte:head>

<main class="mx-auto grid min-h-[65vh] max-w-2xl place-items-center px-6 py-16 text-center">
	<div>
		<CircleAlert class="mx-auto size-12 text-primary" aria-hidden="true" />
		<p class="mt-5 text-sm font-semibold uppercase tracking-widest text-primary">Error {page.status}</p>
		<h1 class="mt-2 text-3xl font-bold">We couldn’t load the postcards</h1>
		<p class="mt-3 text-muted-foreground">{page.error?.message ?? "Please try again in a moment."}</p>
		<div class="mt-7 flex justify-center gap-3">
			<Button href={page.url.pathname}>Try again</Button>
			<Button href="/" variant="outline">Go home</Button>
		</div>
	</div>
</main>
