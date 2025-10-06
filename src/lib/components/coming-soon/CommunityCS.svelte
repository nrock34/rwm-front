
<script>
  import NewsletterFormCS from './NewsletterFormCS.svelte';

    
    import { Users, MessageCircle, Heart, Share2, Globe, Bell, CheckCircle, Camera, MapPin, Calendar } from 'lucide-svelte';
    import Input from '../ui/input/input.svelte';
    import Button from '../ui/button/button.svelte';
    import { Search } from '@lucide/svelte';
    const email = $state('');

    const testimonials = [
        {
            name: 'Emma Chen',
            role: 'NYU Student in Florence',
            quote: 'The community has been incredible for getting real advice from students who\'ve been there.',
            avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
        },
        {
            name: 'David Rodriguez',
            role: 'UCLA Student in Barcelona',
            quote: 'I found my study group through the platform and made lifelong friends.',
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
        },
        {
            name: 'Sophie Martin',
            role: 'Oxford Student in Rome',
            quote: 'The local insights from Italian students have been invaluable for my experience.',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
        }
    ]

    const communityFeatures = [
        {
        icon: MessageCircle,
        title: 'Discussion Forums',
        description: 'Connect with students from around the world and share experiences',
        preview: 'Have active discussions'
        },
        {
        icon: Users,
        title: 'Study Groups',
        description: 'Form study groups and collaborate on academic projects',
        preview: 'Make study groups'
        },
        {
        icon: Camera,
        title: 'Photo Sharing',
        description: 'Share your study abroad moments and discover new destinations',
        preview: 'Your photos, shared'
        },
        {
        icon: MapPin,
        title: 'Local Meetups',
        description: 'Organize and join local events with fellow students',
        preview: 'Find monthly events'
        }
    ];

    const samplePosts = [
        {
        author: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        badge: 'Community Leader',
        time: '2 hours ago',
        content: 'Just had the most amazing pasta cooking class in Rome! The locals are so welcoming and patient with my broken Italian 😅',
        image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
        likes: 89,
        comments: 23
        },
        {
        author: 'Marco Benedetti',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        badge: 'Local Expert',
        time: '5 hours ago',
        content: 'Pro tip for new students: The best gelato in Trastevere is at Fatamorgana. Trust me on this one! 🍦',
        likes: 67,
        comments: 18
        }
    ];

    const interestOptions = [
        'Academic Support',
        'Cultural Exchange',
        'Language Practice',
        'Travel Planning',
        'Housing Tips',
        'Local Events',
        'Photography',
        'Food & Dining'
    ];

    const stats = [
        { number: '2,500+', label: 'Students Registered' },
        { number: '50+', label: 'Countries Represented' },
        { number: '1,200+', label: 'Posts Shared' },
        { number: '95%', label: 'Active Engagement' }
    ];
    
    let { form } = $props()

</script>


    <div class="min-h-screen bg-gradient-to-br from-purple-200/50 via-background to-pink-200/50">

      <section class="py-16 lg:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <div class="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users class="h-4 w-4" />
              <span>Community Platform Beta</span>
            </div>
            
            <h1 class="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Connect with
              <span class="text-purple-600 block">Fellow Adventurers</span>
            </h1>
            
            <p class="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join a vibrant community of students studying abroad. Share experiences, 
              get advice, and build lifelong friendships with people from around the world.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button class="text-lg flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 justify-center rounded-md ">
                    {#snippet children()}
                        <a class="flex items-center" href="#signup">
                            <Bell class="h-5 w-5 mr-2"/>
                            Join Newsletter Waitlist
                        </a>
                    {/snippet}
                    {@render children()}
                </button>
                <Button href="/" variant="outline" class="hover:!bg-transparent !flex hover:!text-current !text-lg px-8 !py-8">
                    <Search class="h-5 w-5 mr-2"/>
                    Explore Platform
                </Button>
            </div>

            
            <div class="max-w-4xl mx-auto bg-card rounded-xl shadow-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-foreground">Community Preview</h3>
                <span class="text-sm text-muted-foreground">Live soon</span>
              </div>
              
              <div class="space-y-4">
                {#each samplePosts as post, index}
                  <div key={index} class="border border-border rounded-lg p-4 text-left">
                    <div class="flex items-start space-x-3">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        class="w-10 h-10 rounded-full object-cover"
                      />
                      <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                          <span class="font-medium text-foreground">{post.author}</span>
                          <span class="badge-outline text-xs">{post.badge}</span>
                          <span class="text-xs text-muted-foreground">•</span>
                          <span class="text-xs text-muted-foreground">{post.time}</span>
                        </div>
                        <p class="text-sm text-muted-foreground mb-2">{post.content}</p>
                        {#if post.image} 
                          <img
                            src={post.image}
                            alt="Post content"
                            class="w-full h-32 object-cover rounded mb-2"
                          />
                        {/if}
                        <div class="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div class="flex items-center space-x-1">
                            <Heart class="h-3 w-3" />
                            <span>{post.likes}</span>
                          </div>
                          <div class="flex items-center space-x-1">
                            <MessageCircle class="h-3 w-3" />
                            <span>{post.comments}</span>
                          </div>
                          <div class="flex items-center space-x-1">
                            <Share2 class="h-3 w-3" />
                            <span>Share</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section hidden aria-hidden="true" class="py-12 bg-card/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {#each stats as stat, index} 
              <div key={index}>
                <div class="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div class="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            {/each}
          </div>
        </div>
      </section>

      
      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-foreground mb-4">Community Features</h2>
            <p class="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to connect, share, and grow with fellow study abroad students
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each communityFeatures as feature, index}
              {@const IconComponent = feature.icon}
              
                <div key={index} class="card p-6 text-center hover:shadow-lg transition-shadow">
                  <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent class="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 class="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p class="text-sm text-muted-foreground mb-3">{feature.description}</p>
                  <span class="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    {feature.preview}
                  </span>
                </div>
              
            {/each}
          </div>
        </div>
      </section>
      


      <section id="signup" class="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold mb-4">Stay Tuned For Access</h2>
            <p class="text-xl opacity-90 mb-8">
                Be among the first to join our community and help shape the platform
            </p>


            <div class="max-w-2xl mx-auto">
                <NewsletterFormCS {form} />
            </div>
        </div>
      </section>

      
      <!-- <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-foreground mb-4">What Students Are Saying</h2>
            <p class="text-muted-foreground">Early feedback from our community beta testers</p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            {#each testimonials as testimonial, index} 
              <div key={index} class="card p-6 text-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  class="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                />
                <p class="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <div class="font-medium text-foreground">{testimonial.name}</div>
                  <div class="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </section> -->

</div>
