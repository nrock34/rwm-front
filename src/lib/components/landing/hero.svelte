<script>
    import { ArrowRight } from "@lucide/svelte";
    import { Award, CheckCircle, Globe } from "lucide-svelte";
    import TypingText from "../ui/typing-text/TypingText.svelte";
    import Button from "../ui/button/button.svelte";
    import { getContext } from "svelte";

    let wordIndex = 0;
    let charIndex = 1;
    let isLocationTextDeleting = false;

    const words = ['Rome', 'Tokyo', 'Barcelona', 'Paris', 'London']

    const siteConfig = getContext('config');

    let tempLocation = 'Rome'
    let tempLocationTagline = 'Eternal City'
    console.log(siteConfig?.heroBackgroundIMG)
</script>



<section class="relative bg-graident-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
    <div class={`absolute inset-0 bg-cover bg-center opacity-20`}
        style:background-image={`url('${siteConfig?.heroBackgroundIMG ?? 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'}')`}></div>
    <div class="relative max-w-[75rem] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-16 lg:py-28">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <div class="flex items-center space-x-2 mb-6">
                    <Globe class="h-8 w-8 text-primary"/>
                    <span class="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        Study Abroad Community
                    </span>
                </div>

                <h1 class="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                    From Travel Blog to 
                    <!-- <TypingText words={['words', 'hat']}/> -->
                    <span class="text-primary ">
                        Your Gateway 
                        <span class="block">
                            to <TypingText timing={120} timeout={1200} words={words}/>
                        </span>
                    </span>
                </h1>
                <p class="text-xl text-secondary-foreground mb-8 leading-relaxed">
                    Connect with fellow students, discover scholarships, access essential resources, and make the most of your study abroad experience in the {tempLocationTagline}.
                </p>

                <div class="flex flex-col sm:flex-row gap-4 mb-8">
                    <a class="bg-primary/80 text-primary-foreground px-3 py-2 flex items-center rounded-lg cursor-pointer hover:bg-primary/70 transition-colors">
                        Join Community
                        <ArrowRight class="h-5 w-5 ml-2"/>
                    </a>
                    <Button class="!py-6 text-base bg-primary-foreground/70 text-primary/85 hover:text-primary-foreground/80" href="/postcards">
                        Read My Story
                        <!-- <ArrowRight class="h-5 w-5 ml-2"/> -->
                    </Button>
                </div>

                <div class="flex items-center space-x-8 text-sm text-secondary-foreground/80">
                    <div class="flex items-center space-x-2">
                        <CheckCircle class="h-4 w-4 text-green-600"/>
                        <span>Free to join</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <CheckCircle class="h-4 w-4 text-green-600" />
                        <span>Verified students only</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <CheckCircle class="h-4 w-4 text-green-600" />
                        <span>24/7 support</span>
                    </div>
                </div>
            </div>

            <div class="relative">
                <div class="relative z-10">
                    <img src={siteConfig?.heroFocusIMG ?? "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"}
                            alt="Students In Rome"
                            class="rounded-2xl shadow-2xl"
                    />
                    <div class="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl border border-border">
                        <div class="flex items-center space-x-3">
                            <div class="flex -space-x-2">
                                <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" 
                                    class="w-8 h-8 rounded-full border-2 border-white" alt="" />
                                <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" 
                                    class="w-8 h-8 rounded-full border-2 border-white" alt="" />
                                <img src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" 
                                    class="w-8 h-8 rounded-full border-2 border-white" alt="" />
                            </div>
                            <div>
                                <p class="text-sm font-medium text-foreground">2,500+ Students</p>
                                <p class="text-xs text-muted-foreground">Active Community</p>
                            </div>
                        </div>
                    </div>
                    <div class="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-lg border border-border">
                        <div class="flex items-center space-x-2">
                            <Award strokeWidth={2.5} class="h-7 w-7 text-ring" />
                            <div >
                                <p class="text-sm font-medium text-foreground">89 Scholarships</p>
                                <p class="text-xs text-muted-foreground">Available Now</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-primary/25 to-accent/40 rounded-2xl transform rotate-3 -z-10 -translate-x-2">
                </div>
            </div>
        </div>
    </div>
</section>