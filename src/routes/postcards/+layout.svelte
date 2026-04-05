<script>
    import AuthGuard from '$lib/components/auth/AuthGuard.svelte';

    /** @type {import('./$types').LayoutProps} */
    let { data, children } = $props();
</script>

<AuthGuard requiresAuth={false}>
    {@render children()}
</AuthGuard>
