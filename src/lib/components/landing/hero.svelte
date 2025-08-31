<script>
    import { ArrowRight } from "@lucide/svelte";
    import { Award, CheckCircle, Globe } from "lucide-svelte";

    let tempLocation = 'Rome'
    let tempLocationTagline = 'Eternal City'
</script>



<section class="relative bg-graident-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
    <div class="absolute inset-0 bg-[url('https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10"></div>
    <div class="relative max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <div class="flex items-center space-x-2 mb-6">
                    <Globe class="h-8 w-8 text-primary"/>
                    <span class="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        Study Abroad Community
                    </span>
                </div>

                <h1 class="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                    Your Journey to
                    <span class="text-primary block">{tempLocation} Starts Here</span>
                </h1>
                <p class="text-xl text-secondary-foreground mb-8 leading-relaxed">
                    Connect with fellow students, discover scholarships, access essential resources, and make the most of your study abroad experience in the {tempLocationTagline}.
                </p>

                <div class="flex flex-col sm:flex-row gap-4 mb-8">
                    <a class="bg-primary/80 text-primary-foreground px-3 py-2 flex items-center rounded-lg cursor-pointer hover:bg-primary/70 transition-colors">
                        Join Community
                        <ArrowRight class="h-5 w-5 ml-2"/>
                    </a>
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
                    <img src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                            alt="Students In Rome"
                            class="rounded-2xl shadow-2xl"
                    />
                    <div class="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl border border-border">
                        <div class="flex items-center space-x-3">
                            <div class="flex -space-x-2">
                                <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" 
                                    className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                                <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" 
                                    className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                                <img src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" 
                                    className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                            </div>
                            <div>
                                <p class="text-sm font-medium text-foreground">2,500+ Students</p>
                                <p class="text-xs text-muted-foreground">Active Community</p>
                            </div>
                        </div>
                    </div>
                    <div class="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-lg border border-border">
                        <div class="flex items-center space-x-2">
                            <Award strokeWidth={2.5} class="h-7 w-7 text-secondary" />
                            <div >
                                <p class="text-sm font-medium text-foreground">89 Scholarships</p>
                                <p class="text-xs text-muted-foreground">Available Now</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl transform rotate-3 -z-10">
                </div>
            </div>
        </div>
    </div>
</section>