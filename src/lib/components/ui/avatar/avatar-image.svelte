<script>
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		src = undefined,
		...restProps
	} = $props();

	let currentSrc = $state(src);

	$effect(() => {
		currentSrc = src;
	});

	function handleError() {
		currentSrc = undefined;
	}
</script>

<AvatarPrimitive.Image
	bind:ref
	data-slot="avatar-image"
	class={cn("aspect-square size-full", className)}
	src={currentSrc}
	onerror={handleError}
	{...restProps}
/>
