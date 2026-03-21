<script>
	import LoginForm from "$lib/components/forms/auth/login-form.svelte";
    import { getTokenState } from "$lib/stores/jwt.svelte.js";
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
	import Globe from "$lib/assets/logos/VX78WS01.svelte";
    let { data } = $props()

    const tokenState = getTokenState()
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
		<LoginForm
			class
            actionName={"?/login"} 
            onLogin={(token=null) => {
                tokenState.token = token
            }} 
            { data }/>
	</div>
</div>