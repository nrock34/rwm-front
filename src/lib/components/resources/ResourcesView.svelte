<script>
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import * as Card from "../ui/card";
    import * as ToggleGroup from "../ui/toggle-group";
    import { Book, BookOpen, Award, Heart, Users, FileText, Map, Video, LinkIcon, TypeIcon, Star, Download, Eye } from "lucide-svelte";
    import { resourcesByCategory } from "./test";
    import Badge from "../ui/badge/badge.svelte";
    import Button from "../ui/button/button.svelte";
    import PopUpView from "./single-views/PopUpView.svelte";
    import PopUpViewVideo from "./single-views/PopUpViewVideo.svelte";
    
    
    const resourceTypes = [
        { id: 'all', name: 'All Types', icon: FileText },
        { id: 'pdf', name: 'PDF Guides', icon: FileText },
        { id: 'video', name: 'Videos', icon: Video },
        { id: 'link', name: 'External Links', icon: LinkIcon },
        { id: 'interactive', name: 'Interactive Tools', icon: Map }
    ];

    const categories = [
    { 
      id: 'guides', 
      name: 'Study Guides', 
      icon: BookOpen,
      description: 'Comprehensive guides for studying abroad',
      count: 24
    },
    { 
      id: 'tips', 
      name: 'Tips & Advice', 
      icon: Award,
      description: 'Expert tips from students and advisors',
      count: 18
    },
    { 
      id: 'itineraries', 
      name: 'Travel Itineraries', 
      icon: Map,
      description: 'Curated travel plans and city guides',
      count: 12
    },
    { 
      id: 'academic', 
      name: 'Academic Resources', 
      icon: BookOpen,
      description: 'Course materials and study aids',
      count: 15
    },
    { 
      id: 'cultural', 
      name: 'Cultural Information', 
      icon: Users,
      description: 'Cultural insights and etiquette guides',
      count: 9
    },
    { 
      id: 'practical', 
      name: 'Practical Info', 
      icon: FileText,
      description: 'Visa, housing, and logistics information',
      count: 21
    }
  ];


    const currentResources = resourcesByCategory['practical'] || []
    

    let selectedType = $state('all');
    let selectedCategory = $state('guides');

    const filteredResources = $derived(resourcesByCategory[selectedCategory].filter(c =>
        selectedType === 'all' || c.type === selectedType
    ))

     const getTypeIcon = (type) => {
        switch (type) {
        case 'pdf': return FileText;
        case 'video': return Video;
        case 'link': return LinkIcon;
        case 'interactive': return Map;
        default: return FileText;
        }
    };

</script>



<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">
            Resources
        </h1>
        <p class="text-muted-foreground">
            Comprehensive guides, tips, and tools for your study abroad journey.
        </p>
    </div>

    <div class="grid lg:grid-cols-4 gap-8">

        <!-- sidebar -->

        <div class="lg:col-span-1">
            <div class="space-y-6">
                <!-- categories -->
                <Card.Root class="p-5 gap-2">
                    <h3 class="text-foreground mb-4 font-semibold">
                        Categories
                    </h3>
                    <nav class="space-y-2">
                        <ToggleGroup.Root 
                            bind:value={selectedCategory}
                            size="lg" class="flex-col w-full gap-3" type="single">
                        {#each categories as category}
                            {@const CategoryIcon = category.icon}

                                <ToggleGroup.Item class={`hover:text-accent-foreground w-full 
                                                        flex items-center justify-between p-3 rounded text-left
                                                        ${selectedCategory === category.id ? 'bg-none' : ''}`} value={category.id}>
                                    <div class="flex items-center space-x-3">
                                        <CategoryIcon class="h-4 w-4"/>
                                        <div class="flex flex-col items-start">
                                            <div class="text-wrap">{category.name}</div>
                                            <div class="text-xs opacity-80">{category.count} resources</div>
                                        </div>
                                    </div>
                                    <ChevronRight class="w-4 h-4"/>
                                </ToggleGroup.Item>
                            
                        {/each}
                        </ToggleGroup.Root>
                    </nav>
                </Card.Root>

                <Card.Root class="gap-2 p-5">
                    <h3 class="font-semibold text-foreground mb-4">Resource Types</h3>
                    <div class="space-y-2">
                        <ToggleGroup.Root
                            bind:value={selectedType}
                            type="single" class="flex-col w-full items-start gap-2">
                        {#each resourceTypes as type}
                        {@const TypeIcon = type.icon}
                            <ToggleGroup.Item class="w-full py-2" value={type.id}>
                                <div class="flex items-center w-full justify-between">
                                    <div class="flex items-center space-x-3">
                                        <TypeIcon class="mr-3"/>
                                        {type.name}
                                    </div>
                                    <span class="items-center justify-center flex h-4 w-4 bg-muted/50 p-3.5 rounded">
                                        {type.id === 'all' ? currentResources.length : currentResources.filter(r => r.type === type.id).length}
                                    </span>
                                </div>
                            </ToggleGroup.Item>
                        {/each}
                        </ToggleGroup.Root>
                    </div>
                </Card.Root>
            </div>
        </div>

        <div class="lg:col-span-3">

            <!-- header -->
            <div class="mb-6">

                <div class="flex items-center space-x-5 mb-1">
                    <BookOpen class="text-primary w-7 h-7" />
                    <span class="text-2xl font-semibold">{categories.find(a => a.id === selectedCategory)?.name}</span>
                </div>
                <span class="text-secondary-foreground text-md">
                    {categories.find(a => a.id === selectedCategory)?.description}
                </span>

                <div class="mt-4.5 text-secondary-foreground text-sm">
                    Showing {filteredResources.length} resources
                    {#if selectedType != 'all'}
                        <span> • Filtered by {resourceTypes.find(t => t.id === selectedType)?.name}</span>
                    {/if}
                </div>
            </div>

            <div class="space-y-6">
                {#each filteredResources as resource}
                    {@const ResourceIcon = getTypeIcon(resource.type)}

                    <Card.Root class={`p-6 ${resource.featured ? 'ring-2 ring-ring/30' : ''}`}>

                        <div class="flex items-start space-x-4">
                            <img
                                src={resource.thumbnail}
                                alt={resource.title}
                                class="w-20 h-20 object-cover rounded flex-shrink-0"
                            />

                            <div class="flex-1">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="flex-1">
                                        <div class="flex items-center space-x-2 mb-1">
                                            <h3 class="font-semibold text-foreground">{resource.title}</h3>
                                            {#if resource.featured}
                                                <Badge>
                                                    Featured
                                                </Badge>
                                            {/if}
                                            <Badge class={``}>
                                                <TypeIcon class="h-3 w-3 mr-1"/>
                                                {resource.type.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <p class="text-xs text-muted-foreground mb-1">by <span class="ml-0.5 text-secondary-foreground">{resource.author}</span></p>
                                        <div class="flex items-center space-x-1 mb-2">
                                            <Star class="h-4 w-4 text-yellow-500 fill-current"/>
                                            <span class="text-xs font-medium">{resource.rating}</span>
                                            <span class="text-xs text-muted-foreground">
                                                ({resource.views} views)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p class="text-sm text-secondary-foreground mb-3">
                                    {resource.description}
                                </p>

                                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground mb-3">
                                    {#if resource.downloads}
                                        <div class="flex items-center space-x-1">
                                            <Download class="h-3 w-3"/>
                                            <span>{resource.downloads} downloads</span>
                                        </div>
                                    {/if}
                                    <div class="flex items-center space-x-1">
                                        <Eye class="h-3 w-3"/>
                                        <span>{resource.views} views</span>
                                    </div>
                                    <div class="flex items-center space-x-1">
                                        <FileText class="h-3 w-3"/>
                                        <span>{resource.size}</span>
                                    </div>
                                    <div class="flex items-center space-x-1">
                                        <Download class="h-3 w-3"/>
                                        <span>{resource.downloads} downloads</span>
                                    </div>
                                </div>

                                <div class="flex flex-wrap gap-1.5 mb-3">
                                    {#each resource.tags as tag, idx}
                                        <span class="text-xs border-1 p-0.5 px-2 font-semibold rounded-xl">
                                            #{tag}
                                        </span>
                                    {/each}
                                </div>


                                <div class="flex items-center justify-between">
                                    <span class="text-xs text-muted-foreground">
                                        Updated {new Date(resource.lastUpdated).toLocaleDateString()}
                                    </span>
                                    <div class="flex space-x-2">
                                        <Button class="flex items-center text-xs py-6 px-8 border border-primary">
                                            <Heart class="h-3 w-3 mr-1"/>
                                            Save
                                        </Button>
                                        <Button variant="secondary" class="border border-ring text-xs py-6 px-8">
                                            {resource.type === 'link' ? 'Visit' : resource.type === 'video' ? 'Watch' : 'Download'}
                                        </Button>
                                        <PopUpViewVideo resource={resource}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Root>
                {/each}
            </div>

            {#if filteredResources.length === 0}
                <div class="text-center py-12">
                    <BookOpen class="mx-auto mb-4 h-14 w-14 text-muted-foreground"/>
                    <h3 class="text-lg mb-1 font-medium text-foreground">
                        No resources found
                    </h3>
                    <p class="text-muted-foreground">
                        Try adjusting your filters.
                    </p>
                </div>
            {/if}

        </div>
    </div>
</div>