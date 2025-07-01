<script>
    import * as Card from '$lib/components/ui/card';
    import CardHeader from '$lib/components/ui/card/card-header.svelte';
    import { Root } from 'postcss';
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    
    


    let { data } = $props();

</script>


<Card.Root>
    <Card.Header>
        <!-- Article Title -->
        <h1 class="text-[2.45rem] font-extrabold font-sans leading-relaxed tracking-normal">
            Exploring The Sardinian Caves
        </h1>
        <!-- Article Description -->
        <Card.Description>
            <div class="article-detail">
                By:  5 min Read
            </div>
        </Card.Description>
    </Card.Header>
    <Card.Content>
        <article>
            <p>
                Trastevere is more than just a neighborhood—it's a feeling. With its cobblestone streets, colorful buildings, and the scent of espresso wafting through alleyways, it captures the essence of Roman charm.
            </p>
            <p>
                Start your walk at Piazza Santa Maria and let your senses guide you through centuries of history and culture. From local trattorias to artisan shops, every corner tells a story.
            </p>
            <blockquote class="article-quote">
                "Rome wasn't built in a day, but Trastevere makes you feel like time stands still."
            </blockquote>
            <p>
                Whether you're studying abroad or just visiting, this quarter offers a perfect mix of relaxation and cultural immersion. Don’t forget to stop by the Janiculum Hill for one of the best panoramic views in the city.
            </p>
        </article>

        <div class="article-tags">
            <span>#Rome</span><span>#StudyAbroad</span><span>#TravelTips</span>
        </div>
    </Card.Content>
</Card.Root>

<Card.Root class="comment-section-container">
    <Card.Header>
        <Card.Title>
            Comments
        </Card.Title>
    </Card.Header>
    <Card.Content>
        <div class="comments">
            <div class="comment flex flex-row items-center">
                <Avatar.Root class='w-[3.5rem] h-[3.5rem] mr-3'>
                    <Avatar.Fallback class="text-[1.05rem] tracking-tight font-semibold bg-indigo-200">
                        MR
                    </Avatar.Fallback>
                </Avatar.Root>
                <div>
                   <strong>Maria Rossi</strong>
                    <p>Such a beautiful description of Trastevere—makes me want to visit again!</p>
                </div>
                 </div>
            <div class="comment flex flex-row items-center">
                <Avatar.Root class='w-[3.5rem] h-[3.5rem] mr-3'>
                    <Avatar.Fallback class="text-[1.05rem] tracking-tight font-semibold bg-rose-300">
                        LB
                    </Avatar.Fallback>
                </Avatar.Root>
                <div>
                    <strong>Luca Bianchi</strong>
                    <p>I loved Janiculum Hill too. The views are stunning at sunset.</p>
                </div>
            </div>
        </div>
    </Card.Content>
</Card.Root>

