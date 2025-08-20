<script>
    import SignupForm from "$lib/components/forms/auth/signup-form.svelte";
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
    import * as Card from "$lib/components/ui/card/";
    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

    let { data } = $props()

    const sleep = (num) => {
        return new Promise(resolve => setTimeout(resolve, num))
    }

    const apple = async () => {
        await sleep(3000)
        return "apple"
    }
</script>

<div class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="flex w-full max-w-sm flex-col gap-6">
		<a href="##" class="flex items-center gap-2 self-center font-medium">
			<div
				class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
			>
				<GalleryVerticalEndIcon class="size-4" />
			</div>
			Acme Inc.
		</a>
        <svelte:boundary>
            <SignupForm actionName={"?/signup"} { data }/>
            {#snippet pending()}
                <Card.Root class="w-full h-full p-5">
                    <Skeleton class="w-full h-140 bg-current/10"/>
                </Card.Root>
            {/snippet}
        </svelte:boundary>
		
	</div>
</div>