<script>
    import PostsView from '$lib/components/posts/PostsView.svelte';
    import ProgramsVIewAll from '$lib/components/programs-page/ProgramsVIewAll.svelte';
    import ProgramDetailView from '$lib/components/programs-page/single-program-view/ProgramDetailView.svelte';
    import ResourcesView from '$lib/components/resources/ResourcesView.svelte';
    import PopUpView from '$lib/components/resources/single-views/PopUpView.svelte';
    import ResourceCS from '$lib/components/coming-soon/ResourcesCS.svelte'
    import ScholarshipCs from '$lib/components/coming-soon/ScholarshipCS.svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();


</script>


<ScholarshipCs />
