<script>
    import { createClassComponent } from "svelte/legacy";

</script>
<h1>
    Welcome to SvelteKit
</h1>

<div id="landing-top" class="bg-primary border-1 flex flex-col">

    <div id="landing-top-content" class="flex flex-row gap-6 mt-20 mb-15 pl-40 pr-20">

        <div id="landing-top-text" class="flex flex-col p-6">

            <h1 class="text-accent font-bold text-3xl md:text-5xl leading-tight max-w-full md:max-w-xs ">
                Wanting to study abroad? 
            </h1>
        
        </div>
        <div id="landing-top-images" class="grid grid-cols-2 auto-rows-fr md:max-v-[50vw] gap-6 p-6">

            <div class="image-placeholder row-span-5">
                <img src="https://picsum.photos/1200" class="w-full h-full"/>
            </div>
            
            <div class="image-placeholder  row-span-2">
                <img src="https://picsum.photos/1200" class="w-full h-full "/>
            </div>
            <div class="image-placeholder  row-span-3">
                <img src="https://picsum.photos/1200" class="w-full h-full "/>
            </div>
            
            

        </div>

    </div>
    
</div>


<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
