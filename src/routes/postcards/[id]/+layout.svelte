<script>
    import * as Card from '$lib/components/ui/card';
    import * as Breadcrumb from '$lib/components/ui/breadcrumb';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';

    /** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */



    let { data, children } = $props();
</script>

<div class="main-container">

    <!-- breadcrumb section -->
    <div class="article-breadcrumb">
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator/>
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="#">Postcards</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator/>
                <Breadcrumb.Item>
                    <Breadcrumb.Page>Article Title Placehilder</Breadcrumb.Page>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
    </div>

    <div class="main-article-container">

        <div class="article-container">
            {@render children()} 
        </div>

        <aside class="sidebar-container">
            <Card.Root>
                <Card.Header>
                    <Card.Title class="text-lg">
                        featured postcards
                    </Card.Title>
                </Card.Header>
                <Card.Content>

                </Card.Content>
                <Card.Header>
                    <Card.Title class="text-lg">
                        subscribe to the newsletter :{')'}
                    </Card.Title>
                    <Card.Content class="px-0">
                        <div class="flex flex-col gap-4 mt-[0.4rem]">
                            <Input placeholder="Enter your email."/>
                            <Button class="mx-[4rem]">
                                Subscribe!
                            </Button>  
                        </div>
                        
                    </Card.Content>
                </Card.Header>
            </Card.Root>
        </aside>
    </div>
    
</div>

