<script>
    import { enhance } from "$app/forms";
    import { fly } from "svelte/transition";

    import { Button } from "../ui/button";
    import { Input } from "../ui/input";

    let { form } = $props();
</script>

<form
    use:enhance
    method="POST"
    action="?/newsletterSignup"
    class="mx-auto flex max-w-md flex-col gap-4 sm:flex-row sm:items-start"
>
    <div class="flex flex-1 flex-col items-start gap-y-1">
        <Input
            name="email"
            value={form?.email}
            type="email"
            placeholder="Enter your email address"
            class="flex-1 border-2 border-border"
        />
        {#if form?.error}
            <p in:fly={{ y: 10 }} class="pt-1 pl-1 text-xs capitalize tracking-normal text-destructive">
                Error: {form.error} - {form.description}
            </p>
        {/if}
        {#if form?.status === "success"}
            <p in:fly={{ y: 10 }} class="pt-1 pl-1 text-xs leading-none tracking-normal text-green-600">
                Success, you're now subscribed to the newsletter. Stay tuned for updates sent to your email!
            </p>
        {/if}
    </div>

    <Button type="submit" class="btn-primary cursor-pointer">Subscribe</Button>
</form>
