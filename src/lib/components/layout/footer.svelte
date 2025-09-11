<script>

    import { Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-svelte';

    const currentYear = new Date().getFullYear();
</script>



<footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex flex-col md:flex-row justify-between md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- {/* Brand and Description */} -->
        <div class="lg:col-span-1 md:w-[25%]">
            <div class="flex items-center space-x-2 mb-4">
                <Globe class="h-8 w-8 text-roman-400" />
                <div>
                <h3 class="text-xl font-bold">RomeWithMe</h3>
                <p class="text-sm text-gray-400">Study Abroad Community</p>
                </div>
            </div>
            <p class="text-gray-300 text-sm mb-6">
                Empowering students to make the most of their study abroad experience in Rome through community, resources, and support.
            </p>
            <div class="flex space-x-4">
                <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <Facebook class="h-5 w-5" />
                </a>
                <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <Instagram class="h-5 w-5" />
                </a>
                <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <Twitter class="h-5 w-5" />
                </a>
                <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <Youtube class="h-5 w-5" />
                </a>
            </div>
            </div>

            <!-- {/* Quick Links */} -->
            <div>
            <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm">
                <li><a href="#resources" class="text-gray-300 hover:text-white transition-colors">Resources</a></li>
                <li><a href="#community" class="text-gray-300 hover:text-white transition-colors">Community</a></li>
                <li><a href="#events" class="text-gray-300 hover:text-white transition-colors">Events</a></li>
                <li><a href="#housing" class="text-gray-300 hover:text-white transition-colors">Housing</a></li>
                <li><a href="#support" class="text-gray-300 hover:text-white transition-colors">Support</a></li>
                <li><a href="#blog" class="text-gray-300 hover:text-white transition-colors">Blog</a></li>
            </ul>
            </div>

            <!-- {/* Resources */} -->
            <div>
            <h4 class="text-lg font-semibold mb-4">Resources</h4>
            <ul class="space-y-2 text-sm">
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Pre-Departure Guide</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Visa Information</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Academic Resources</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Cultural Tips</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Language Learning</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Health & Safety</a></li>
            </ul>
            </div>

            <!-- {/* Contact Information */} -->
            <div>
            <h4 class="text-lg font-semibold mb-4">Contact Us</h4>
            <div class="space-y-3 text-sm">
                <div class="flex items-start space-x-2">
                <MapPin class="h-4 w-4 text-roman-400 mt-0.5 flex-shrink-0" />
                <div>
                    <p class="text-gray-300">Via dei Cappuccini, 9</p>
                    <p class="text-gray-300">00187 Roma RM, Italy</p>
                </div>
                </div>
                <div class="flex items-center space-x-2">
                <Phone class="h-4 w-4 text-roman-400 flex-shrink-0" />
                <p class="text-gray-300">+39 06 1234 5678</p>
                </div>
                <div class="flex items-center space-x-2">
                <Mail class="h-4 w-4 text-roman-400 flex-shrink-0" />
                <p class="text-gray-300">info@romewithme.com</p>
                </div>
            </div>
            
            <div class="mt-6">
                <h5 class="font-medium mb-2">Emergency Hotline</h5>
                <p class="text-roman-400 font-semibold">+39 06 9876 5432</p>
                <p class="text-xs text-gray-400">Available 24/7</p>
            </div>
            </div>
        </div>

        <!-- {/* Bottom Section */} -->
        <div class="border-t border-gray-800 mt-12 pt-8">
            <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
                <p>&copy; {currentYear} RomeWithMe. All rights reserved.</p>
                <div class="flex space-x-4">
                <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" class="hover:text-white transition-colors">Cookie Policy</a>
                </div>
            </div>
            
            <div class="flex items-center space-x-4 text-sm text-gray-400">
                <span>Made with ❤️ for students in Rome</span>
            </div>
            </div>
        </div>
    </div>
</footer>

