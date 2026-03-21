<script>
    import SignupForm from "$lib/components/forms/auth/signup-form.svelte";
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
    import * as Card from "$lib/components/ui/card/";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { getTokenState } from "$lib/stores/jwt.svelte.js";
    import Globe from "$lib/assets/logos/VX78WS01.svelte";

    let { data } = $props()

    const tokenState = getTokenState()

    const sleep = (num) => {
        return new Promise(resolve => setTimeout(resolve, num))
    }

    const apple = async () => {
        await sleep(3000)
        return "apple"
    }
</script>

<div class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="flex w-full max-w-sm flex-col gap-4">
		<a href="##" class="flex items-center gap-2 self-center font-medium bg-primary/80 p-2 py-1 rounded-lg shadow-md">
			<div
				class="flex size-10 items-center justify-center rounded-md"
			>
                <Globe class="stroke-white pl-0.5 fill-white text-center"/>
			</div>
            <div>
                <span class="text-lg font-normal">RomeWithMe</span>
            </div>
			
		</a>
        <svelte:boundary>
            <SignupForm
                onSignup={(tkn) => {
                    tokenState.token = tkn
                }} 
                actionName={"?/signup"}
                 { data }/>
            {#snippet pending()}
                <Card.Root class="w-full h-full p-5">
                    <Skeleton class="w-full h-140 bg-current/10"/>
                </Card.Root>
            {/snippet}
        </svelte:boundary>
		
	</div>
</div>