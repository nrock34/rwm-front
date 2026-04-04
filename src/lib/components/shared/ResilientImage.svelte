<script>
	let {
		src = null,
		fallbackSrc = null,
		alt = "",
		class: className = "",
		hideOnError = false,
		ref = $bindable(null),
		...restProps
	} = $props();

	let currentSrc = $state(src);
	let failed = $state(false);

	$effect(() => {
		currentSrc = src;
		failed = false;
	});

	function handleError() {
		if (fallbackSrc && currentSrc !== fallbackSrc) {
			currentSrc = fallbackSrc;
			return;
		}

		failed = true;
	}
</script>

{#if currentSrc && !(hideOnError && failed)}
	<img
		bind:this={ref}
		src={currentSrc}
		alt={alt}
		class={className}
		onerror={handleError}
		{...restProps}
	/>
{/if}
