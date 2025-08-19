<script>

    import * as Form from '$lib/components/ui/form';
    import { superForm, fileProxy } from 'sveltekit-superforms';
    import { yupClient } from 'sveltekit-superforms/adapters';
    import { profileInfoSchema } from './schema';
    import * as Select from '$lib/components/ui/select';
   
    import { Checkbox } from '$lib/components/ui/checkbox';
    import Input from '$lib/components/ui/input/input.svelte';
    import { CameraIcon } from 'lucide-svelte';

    import CalendarIcon from "@lucide/svelte/icons/calendar";
    import {
        DateFormatter,
        getLocalTimeZone,
        today,
        parseDate

    } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import Button from '$lib/components/ui/button/button.svelte';
    import Textarea from '$lib/components/ui/textarea/textarea.svelte';
 
    const df = new DateFormatter("en-US", {
        dateStyle: "long"
    });

    //form supervalidated
    let { actionName, data } = $props();

    let updated = $state(false)

    console.log(data)
    
    const form = superForm(data.editProfileInfoForm, {
        dataType: 'json',
        validators: yupClient(profileInfoSchema),
    })

    const { form: formData, enhance } = form;

    const pfpFile = fileProxy(form, 'avatar')

    // calendar variables
    let dateValue = $derived($formData.birthday ? parseDate($formData.birthday) : undefined)
    let datePlaceholder = $state(today(getLocalTimeZone()))

    // select trigger content
                
</script>



<form class="space-y-10 h-full" enctype="multipart/form-data" action={actionName} method="POST" use:enhance>

    <div class="flex w-full space-x-8 items-start">
            <div class="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-3.5 gap-x-4 space-x-3">
                
                <div class="w-full col-span-2">
                    <Form.Field {form} name="first_name">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label class="mb-2">First Name</Form.Label>
                                <Input
                                    {...props}
                                    class="py-5"
                                    placeholder={'First Name'}
                                    oninput={() => {updated = true}}
                                    bind:value={$formData.first_name}
                                />
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors/>
                    </Form.Field>
                </div>

                <div class="w-full col-span-2">
                    <Form.Field {form} name="last_name">
                        <Form.Control>
                            {#snippet children({props})}
                                <Form.Label class="mb-2">Last Name</Form.Label>
                                <Input
                                    {...props}
                                    class="py-5"
                                    placeholder={'Last Name'}
                                    bind:value={$formData.last_name}
                                    oninput={() => {
                                        updated = true
                                    }}
                                />
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors/>
                    </Form.Field>
                </div>

                
                <div class="w-full col-span-2">
                    <Form.Field {form} name="birthday">
                        <Form.Control class="m-0">
                            {#snippet children({props})}
                                <Form.Label class="mb-2">Birthday</Form.Label>
                                <Popover.Root class="">
                                    <Popover.Trigger class="w-full m-0">
                                        {#snippet child({props})}
                                            <Button
                                                {...props}
                                                variant="outline"
                                                class={cn(
                                                    buttonVariants({
                                                        variant: "outline",
                                                        class: "justify-start text-left w-full py-5"
                                                    })
                                                )}
                                            >
                                                <CalendarIcon class="mr-2 w-4 h-4" />
                                                {dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : "Select a date"}
                                            </Button>
                                        {/snippet}
                                    </Popover.Trigger>
                                    <Popover.Content class="w-auto p-0">
                                        <Calendar
                                            bind:placeholder={datePlaceholder} 
                                            value={dateValue}
                                            type="single" 
                                            initialFocus
                                            onValueChange={(v) => {
                                                updated = true;
                                            $formData.birthday = v ? v.toString() : "";
                                            }} />
                                    </Popover.Content>
                                </Popover.Root>
                            {/snippet}
                        </Form.Control>
                    </Form.Field>
                </div>

                
                <div class="w-full col-span-2 min-h-0 flex flex-col row-span-2">
                    <Form.Field {form} name="bio">
                        <Form.Control class="h-full flex-1 min-h-0">
                            {#snippet children({props})}
                                <Form.Label class="mb-2">Bio</Form.Label>
                                <Textarea
                                    {...props}
                                    class="resize-none flex-1 w-full min-h-0"
                                    placeholder="Your bio..."
                                    oninput={() => updated = true}
                                    bind:value={$formData.bio}
                                />
                            {/snippet}
                        </Form.Control>
                    </Form.Field>
                </div>


                <div class="col-span-2">        
                    <Form.Field {form} name="username">
                    
                        <Form.Control>
                            {#snippet children({props})}
                                <Form.Label class="mb-2">Username</Form.Label>
                                <Input
                                    disabled
                                    {...props}
                                    placeholder="@Username"
                                    class="py-5"
                                    oninput={() => updated = true}
                                    bind:value={$formData.username} 
                                />
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors/>
                    
                    </Form.Field>
                </div>

            </div>
            

        <Form.Field class="flex-1 flex-col flex space-y-8" {form} name="avatar">
            <Form.Legend>
                Profile Picture
            </Form.Legend>
            <Form.Control class="w-full h-full">
                {#snippet children({ props })}
                    <div class="flex w-full justify-center h-full items-center">
                        <label
                            class="cursor-pointer flex justify-center items-center w-36 h-36 rounded-full bg-muted/40 overflow-hidden"
                            for="profile-avatar-edit" 
                        >
                            <img class="object-cover w-full h-full -z-1" src="https://picsum.photos/350/350"/>
                            <div class=""></div>
                            <CameraIcon class="text-foreground absolute w-6 h-6"/>
                        </label>
                        <input
                            onchange={() => updated = true}
                            {...props}
                            accept="image/png, image/jpeg"
                            hidden
                            bind:files={$pfpFile}
                            type="file"
                            id="profile-avatar-edit"/>
                    </div>
                {/snippet}
            </Form.Control>
            <Form.FieldErrors/>
        </Form.Field>
    </div>
    
    <Form.Button disabled={!updated} class="">
        Save Changes
    </Form.Button>

</form>