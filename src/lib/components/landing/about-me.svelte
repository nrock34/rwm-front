<script>
    import { getContext } from "svelte";
    import * as Avatar from "../ui/avatar/";

    const siteConfig = getContext('config');

</script>

<section class="py-16">
    <div class="flex justify-center w-full">
        <div class="flex items-center gap-x-10 sm:gap-x-20 md:gap-x-30 lg:justify-between px-8 sm:px-14 md:px-26 w-full max-w-[60rem]">
            <Avatar.Root class="min-w-30 min-h-30">
                <Avatar.Fallback class="bg-blue-400 "></Avatar.Fallback>
                <Avatar.Image src={siteConfig?.landingAboutMeIMG}/>
            </Avatar.Root>
            <div class="flex flex-col gap-y-1">
                <h1 class="font-semibold text-2xl text-foreground">About My Travels</h1>
                <p class="text-base text-secondary-foreground/90 text-xs sm:text-sm max-w-140 leading-tight">Hi, I’m Naeem! Back in February 2025, I created this blog to capture my time in Rome and encourage others to take the leap into studying abroad. Now, it connects past, present, and future students through stories and resources.</p>
            </div>
        </div>
    </div>
</section>