<script>
    import SocialFeedHeader from "./SocialFeedHeader.svelte";
    import SocialFeedPosts from "./SocialFeedPosts.svelte";

    import { Users, BookOpen, Calendar, Award } from 'lucide-svelte';

    let searchQuery = $state('');
    let activeContentType = $state('all')
    let activeFilter = $state('all')

    const filters = [
        { id: 'all', name: 'All Posts', icon: Users },
        { id: 'academics', name: 'Academics', icon: BookOpen },
        { id: 'events', name: 'Events', icon: Calendar },
        { id: 'opportunities', name: 'Opportunities', icon: Award }
    ];

     const contentTypes = [
        { id: 'all', name: 'All' },
        { id: 'photo', name: 'Photos' },
        { id: 'discussion', name: 'Discussions' },
        { id: 'announcement', name: 'Announcements' }
    ];

</script>

<div class="space-y-12">
    <SocialFeedHeader
        {filters}
        {contentTypes}
        bind:activeContentType
        bind:activeFilter
        bind:searchQuery
         />
    <SocialFeedPosts
        {contentTypes}
        {activeFilter}
        {activeContentType}
        {searchQuery}
         />
</div>

