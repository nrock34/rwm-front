<script>

    import { Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-svelte';
    import GlobeLogo from '$lib/assets/logos/VX78WS01.svelte';
    import { Github } from '@lucide/svelte';
    import { getContext } from 'svelte';

    const currentYear = new Date().getFullYear();

    const config = getContext('config');

</script>



<footer class="footer-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div class="flex flex-col md:flex-row justify-between md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- {/* Brand and Description */} -->
        <div class="lg:col-span-1 md:w-[25%]">
            <div class="flex items-center gap-x-1">
                <GlobeLogo class="max-h-20 min-h-15 max-w-20 min-w-15 fill-primary"/>
                <div class="brand-lockup-tight flex flex-col">
                    <h3 class="font-bold text-2xl">RomeWithMe</h3>
                    <p class="footer-text-muted-strong tracking-tight text-sm">Grow Roots in New Places</p>
                </div>
            </div>
            <p class="footer-text-muted mb-6 text-sm">
                Empowering students to make the most of their study abroad experience through community, resources, and support.
            </p>
            <div class="flex space-x-4">
                {#if config?.socialLinkFB !== undefined && config.socialLinkFB !== ''}
                    <a href="#" class="footer-icon-link">
                    <Facebook class="h-5 w-5" />
                    </a>
                {/if}
                {#if config?.socialLinkIG !== undefined && config.socialLinkIG !== ''}
                    <a href="#" class="footer-icon-link">
                    <Instagram class="h-5 w-5" />
                    </a>
                {/if}
                {#if config?.socialLinkX !== undefined && config.socialLinkX !== ''}
                    <a href="#" class="footer-icon-link">
                    <Twitter class="h-5 w-5" />
                    </a>
                {/if}
                {#if config?.socialLinkYT !== undefined && config.socialLinkYT !== ''}
                    <a href="#" class="footer-icon-link">
                    <Youtube class="h-5 w-5" />
                    </a>
                {/if}
            </div>
            </div>

            <!-- {/* Quick Links */} -->
            <div>
            <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm">
                <li><a href="programs" class="footer-link">Programs</a></li>
                <li><a href="postcards" class="footer-link">Postcards</a></li>
                <li><a href="community" class="footer-link">Community</a></li>
                <!-- <li><a href="#housing" class="text-gray-300 hover:text-white transition-colors">Housing</a></li> -->
                <!-- <li><a href="#support" class="text-gray-300 hover:text-white transition-colors">Support</a></li> -->
                <!-- <li><a href="#blog" class="text-gray-300 hover:text-white transition-colors">Blog</a></li> -->
            </ul>
            </div>

            <!-- {/* Resources */} -->
            <div>
                <h4 class="text-lg font-semibold mb-4">Resources</h4>
                <ul class="space-y-2 text-sm">
                    <li class="footer-text-muted">COMING SOON</li>
                    <!-- <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Pre-Departure Guide</a></li>
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Visa Information</a></li>
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Academic Resources</a></li>
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Cultural Tips</a></li>
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Language Learning</a></li>
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Health & Safety</a></li> -->
                </ul>
            </div>

            <!-- {/* Contact Information */} -->
            <div id="footer-contactinfo">
            <h4 class="text-lg font-semibold mb-4">Contact Us</h4>
            <div class="space-y-3 text-sm">
                <!-- <div class="flex items-start space-x-2">
                    <MapPin class="h-4 w-4 text-roman-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <p class="text-gray-300">Via GUlio Cesare</p>
                        <p class="text-gray-300">01234, ROMA</p>
                    </div>
                </div> -->
                <!-- <div class="flex items-center space-x-2">
                    <Phone class="h-4 w-4 text-roman-400 flex-shrink-0" />
                    <p class="text-gray-300">N/A</p>
                </div> -->
                <div class="flex items-center space-x-2">
                    <Mail class="h-4 w-4 text-primary flex-shrink-0" />
                    <a href="mailto:info@romewithme.com"><p class="footer-text-muted">info@romewithme.com</p></a>
                </div>
            </div>
            
            <!-- <div class="mt-6">
                <h5 class="font-medium mb-2">Emergency Hotline</h5>
                <p class="text-roman-400 font-semibold">+39 06 9876 5432</p>
                <p class="text-xs text-gray-400">Available 24/7</p>
            </div> -->
            </div>
        </div>

        <!-- {/* Bottom Section */} -->
        <div class="footer-divider border-t mt-12 pt-8">
            <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div class="footer-text-faint flex flex-col items-center space-y-2 text-sm md:flex-row md:space-x-6 md:space-y-0">
                <p>&copy; {currentYear} RomeWithMe. All rights reserved.</p>
                <div class="flex space-x-4">
                <a href="#" class="footer-link">Privacy Policy</a>
                <a href="terms-of-service" class="footer-link">Terms of Service</a>
                <a href="#" class="footer-link">Cookie Policy</a>
                </div>
            </div>
            
            <div class="footer-text-faint flex items-center space-x-4 text-sm">
                <span>Built with ❤️ by <a href="https://github.com/nrock34" class="text-secondary hover:text-primary inline-flex items-center gap-x-1">Naeem <Github class="w-4 h-4"/></a></span>
            </div>
            </div>
        </div>
    </div>
</footer>
