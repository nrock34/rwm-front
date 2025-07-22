<script>
    import PostsView from '$lib/components/posts/PostsView.svelte';
    import ProgramsVIewAll from '$lib/components/programs-page/ProgramsVIewAll.svelte';
    import ResourcesView from '$lib/components/resources/ResourcesView.svelte';
    import PopUpView from '$lib/components/resources/single-views/PopUpView.svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();


</script>


<div class="p-4 bg-muted">

    <div class="">
        <div class="">
            <PostsView />
            <ProgramsVIewAll />
            <!-- <ResourcesView /> -->
        </div>
    </div>
    

</div>