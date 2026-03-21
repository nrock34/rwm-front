<script>

    import { onDestroy } from 'svelte';
    import * as Form from '$lib/components/ui/form';
    import { superForm, fileProxy } from 'sveltekit-superforms';
    import { yupClient } from 'sveltekit-superforms/adapters';
    import Compressor from 'compressorjs';
    import { profileInfoSchema } from './schema';
    import { Input } from '$lib/components/ui/input';
    import { CameraIcon } from 'lucide-svelte';

    import CalendarIcon from "@lucide/svelte/icons/calendar";
    import {
        DateFormatter,
        getLocalTimeZone,
        today,
        parseDate

    } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { buttonVariants } from "$lib/components/ui/button";
    import { Calendar } from "$lib/components/ui/calendar";
    import * as Popover from "$lib/components/ui/popover";
    import { Button } from '$lib/components/ui/button';
    import { Textarea } from '$lib/components/ui/textarea';
 
    const df = new DateFormatter("en-US", {
        dateStyle: "long"
    });

    //form supervalidated
    let { actionName, data } = $props();

    let updated = $state(false)
    let compressingAvatar = $state(false)
    let compressionMessage = $state("")
    let avatarPreviewUrl = $state(/** @type {string | null} */ (null))

    
    const form = superForm(data.editProfileInfoForm, {
        validators: yupClient(profileInfoSchema)
    })

    const { form: formData, enhance, message } = form;

    const pfpFile = fileProxy(form, 'avatar')
    const currentAvatarUrl = $derived(
        typeof data.currentAvatarUrl === "string" && data.currentAvatarUrl.length > 0
            ? data.currentAvatarUrl
            : "https://picsum.photos/350/350"
    )
    const displayAvatarUrl = $derived(avatarPreviewUrl ?? currentAvatarUrl)

    // calendar variables
    let dateValue = $derived($formData.birthday ? parseDate($formData.birthday) : undefined)
    let datePlaceholder = $state(today(getLocalTimeZone()))

    function revokeAvatarPreview() {
        if (!avatarPreviewUrl) {
            return
        }

        URL.revokeObjectURL(avatarPreviewUrl)
        avatarPreviewUrl = null
    }

    onDestroy(() => {
        revokeAvatarPreview()
    })

    /**
     * @param {Blob | File} result
     * @param {File} originalFile
     * @returns {File}
     */
    function toUploadFile(result, originalFile) {
        if (result instanceof File) {
            return result
        }

        return new File([result], originalFile.name, {
            type: result.type || originalFile.type,
            lastModified: Date.now()
        })
    }

    /**
     * @param {File} file
     * @returns {Promise<File>}
     */
    function compressAvatar(file) {
        return new Promise((resolve, reject) => {
            new Compressor(file, {
                quality: 0.7,
                maxWidth: 1600,
                maxHeight: 1600,
                mimeType: file.type,
                success(result) {
                    try {
                        resolve(toUploadFile(result, file))
                    } catch (err) {
                        reject(err)
                    }
                },
                error(err) {
                    reject(err)
                }
            })
        })
    }

    /**
     * @param {Event & { currentTarget: EventTarget & HTMLInputElement }} event
     */
    async function handleAvatarChange(event) {
        compressionMessage = ""
        const selectedFile = event.currentTarget.files?.item(0)

        if (!selectedFile) {
            revokeAvatarPreview()
            pfpFile.set(null)
            updated = true
            return
        }

        compressingAvatar = true

        try {
            const compressedFile = await compressAvatar(selectedFile)
            const uploadFile = compressedFile.size > 0 && compressedFile.size < selectedFile.size
                ? compressedFile
                : selectedFile

            pfpFile.set(uploadFile)
            revokeAvatarPreview()
            avatarPreviewUrl = URL.createObjectURL(uploadFile)

            if (uploadFile !== selectedFile) {
                compressionMessage = `Image compressed from ${Math.round(selectedFile.size / 1024)} KB to ${Math.round(uploadFile.size / 1024)} KB.`
            }
        } catch {
            pfpFile.set(selectedFile)
            revokeAvatarPreview()
            avatarPreviewUrl = URL.createObjectURL(selectedFile)
            compressionMessage = "Image compression failed. The original file will be uploaded."
        } finally {
            compressingAvatar = false
            updated = true
        }
    }
                
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
                                    class="py-5 text-xs sm:text-sm"
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
                                    class="py-5 text-xs sm:text-sm"
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
                                                        class: "justify-start text-left w-full py-5 text-xs sm:text-sm items-center"
                                                    })
                                                )}
                                            >
                                                <CalendarIcon class="mr-2 w-4 h-4" />
                                                <span class="mt-0.5">{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : "Select a date"}</span>
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
                        <Form.FieldErrors/>
                    </Form.Field>
                </div>

                
                <div class="w-full col-span-2 min-h-0 flex flex-col row-span-2">
                    <Form.Field {form} name="bio">
                        <Form.Control class="h-full flex-1 min-h-0">
                            {#snippet children({props})}
                                <Form.Label class="mb-2">Bio</Form.Label>
                                <Textarea
                                    {...props}
                                    class="resize-none flex-1 w-full min-h-0 text-xs sm:text-sm"
                                    placeholder="Your bio..."
                                    oninput={() => updated = true}
                                    bind:value={$formData.bio}
                                />
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors/>
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
                                    class="py-5 text-xs sm:text-sm"
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
            <Form.Legend class="text-center sm:text-left">
                Profile Picture
            </Form.Legend>
            <Form.Control class="w-full h-full">
                {#snippet children({ props })}
                    <div class="flex w-full justify-center h-full items-center">
                        <label
                            class="cursor-pointer flex justify-center items-center w-36 h-36 rounded-full bg-muted/40 overflow-hidden"
                            for="profile-avatar-edit" 
                        >
                            <img class="object-cover w-full h-full -z-1" src={displayAvatarUrl} alt="Current profile avatar"/>
                            <div class=""></div>
                            <CameraIcon class="text-foreground absolute w-6 h-6"/>
                        </label>
                        <input
                            onchange={handleAvatarChange}
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
            {#if compressingAvatar}
                <p class="text-sm text-muted-foreground">Compressing image...</p>
            {:else if compressionMessage}
                <p class="text-sm text-muted-foreground">{compressionMessage}</p>
            {/if}
        </Form.Field>
    </div>

    {#if $message?.msg}
        <p class={`text-sm ${$message?.error ? "text-destructive" : "text-secondary-foreground"}`}>
            {$message.msg}
        </p>
    {/if}
    
    <Form.Button disabled={!updated || compressingAvatar} class="">
        Save Changes
    </Form.Button>

</form>
