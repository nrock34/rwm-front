<script>
	import * as Form from "$lib/components/ui/form";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import * as Select from "$lib/components/ui/select";
	import { Textarea } from "$lib/components/ui/textarea";
	import { superForm } from "sveltekit-superforms";
	import { yupClient } from "sveltekit-superforms/adapters";
	import { postSchema } from "./post-schema.js";
	import {
		POST_TOPIC_OPTIONS,
		POST_TYPE_OPTIONS,
		getPostOptionLabel
	} from "$lib/components/community/socialFeed/post-options.js";

	let { data, actionName = "createPost" } = $props();

	const form = superForm(data.createPostForm, {
		dataType: "json",
		validators: yupClient(postSchema)
	});

	const { form: formData, enhance, message } = form;

	const selectedCategoryLabel = $derived(getPostOptionLabel(POST_TOPIC_OPTIONS, $formData.category, "Choose a topic"));
	const selectedTypeLabel = $derived(getPostOptionLabel(POST_TYPE_OPTIONS, $formData.type, "Choose a post type"));
</script>

<form class="space-y-6" method="POST" action={`?/${actionName}`} use:enhance>
	<div class="grid gap-5 md:grid-cols-2">
		<Form.Field {form} name="title" class="md:col-span-2">
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-2">
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.title} class="h-11" placeholder="What do you want to share?" />
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="category">
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-2">
						<Form.Label>Topic</Form.Label>
						<Select.Root type="single" bind:value={$formData.category}>
							<Select.Trigger class="w-full justify-between" {...props}>{selectedCategoryLabel}</Select.Trigger>
							<Select.Content>
								{#each POST_TOPIC_OPTIONS as option}
									<Select.Item value={option.id} label={option.label}>{option.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="type">
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-2">
						<Form.Label>Post Type</Form.Label>
						<Select.Root type="single" bind:value={$formData.type}>
							<Select.Trigger class="w-full justify-between" {...props}>{selectedTypeLabel}</Select.Trigger>
							<Select.Content>
								{#each POST_TYPE_OPTIONS as option}
									<Select.Item value={option.id} label={option.label}>{option.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="media" class="md:col-span-2">
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-2">
						<Form.Label>Media URL</Form.Label>
						<Input {...props} bind:value={$formData.media} class="h-11" placeholder="https://example.com/photo.jpg" />
					</div>
				{/snippet}
			</Form.Control>
			<Form.Description>Optional. Use a hosted image URL if this post should include media.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="tags" class="md:col-span-2">
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-2">
						<Form.Label>Tags</Form.Label>
						<Input {...props} bind:value={$formData.tags} class="h-11" placeholder="rome, housing, tips" />
					</div>
				{/snippet}
			</Form.Control>
			<Form.Description>Comma-separated. We’ll normalize these before sending them to the API.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="content" class="md:col-span-2">
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-2">
						<Form.Label>Content</Form.Label>
						<Textarea {...props} bind:value={$formData.content} rows={8} placeholder="Write your post here..." />
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<label class="flex items-start gap-3 rounded-xl border border-border/70 bg-secondary/20 px-4 py-4 text-sm text-foreground">
		<Checkbox bind:checked={$formData.published} class="mt-0.5" />
		<span class="space-y-1">
			<span class="block font-medium">Publish immediately</span>
			<span class="block text-muted-foreground">Leave this on if the post should go live as soon as it is submitted.</span>
		</span>
	</label>

	{#if $message?.msg}
		<p class={`text-sm ${$message?.error ? "text-destructive" : "text-secondary-foreground"}`}>
			{$message.msg}
		</p>
	{/if}

	<div class="flex flex-wrap gap-3">
		<Form.Button>Create Post</Form.Button>
	</div>
</form>
