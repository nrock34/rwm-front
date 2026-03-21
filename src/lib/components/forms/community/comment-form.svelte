<script>
	import * as Form from "$lib/components/ui/form";
	import { Textarea } from "$lib/components/ui/textarea";
	import { superForm } from "sveltekit-superforms";
	import { yupClient } from "sveltekit-superforms/adapters";
	import { commentSchema } from "./comment-schema.js";

	let { data, actionName = "comment" } = $props();

	const form = superForm(data.commentForm, {
		dataType: "json",
		validators: yupClient(commentSchema)
	});

	const { form: formData, enhance, message } = form;
</script>

<form class="space-y-4" method="POST" action={`?/${actionName}`} use:enhance>
	<Form.Field {form} name="content">
		<Form.Control>
			{#snippet children({ props })}
				<div class="space-y-2">
					<Form.Label>Add a Comment</Form.Label>
					<Textarea {...props} bind:value={$formData.content} rows={5} placeholder="Share your thoughts with the community..." />
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	{#if $message?.msg}
		<p class={`text-sm ${$message?.error ? "text-destructive" : "text-secondary-foreground"}`}>
			{$message.msg}
		</p>
	{/if}

	<Form.Button>Post Comment</Form.Button>
</form>
