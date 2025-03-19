<script>

	import Icon from "@iconify/svelte";

</script>


<footer class="bg-gradient-to-tr from-[#080A25] to-[#0a015a]  text-white lg:pt-20 pb-8  pt-12 px-6 sm:px-10 lg:px-20 relative overflow-hidden">
    
    <!-- Top Section with Logo & Intro -->
    <div class="flex justify-center items-center  md:text-left lg:mb-24 mb-14">
        <div class="lg:mb-6 mb-0 flex items-center justify-center">
            <img src="/newLogo.png" class="lg:w-2/5 w-3/4 mx-auto md:mx-0" alt="logo">
        </div>
    </div>

    <!-- Middle Section with Links -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
        
        <!-- Quick Links -->
        <div>
            <h3 class="font-bold text-lg mb-4  bg-gradient-to-tl from-[#6504B0] to-[#ef9eff]
            text-transparent bg-clip-text">Quick Links</h3>
            <ul class="space-y-2 text-gray-400">
                <li><a href="/about_us" class="hover:text-blue-400">About Us</a></li>
                <li><a href="/" class="hover:text-blue-400">Solutions</a></li>
                <li><a href="/#contact" class="hover:text-blue-400">Contact Us</a></li>
                <li><a href="/" class="hover:text-blue-400">Careers</a></li>
            </ul>
        </div>

        <!-- Resources -->
        <div>
            <h3 class="font-bold text-lg mb-4  bg-gradient-to-tl from-[#6504B0] to-[#ef9eff]
            text-transparent bg-clip-text">Resources</h3>
            <ul class="space-y-2 text-gray-400">
                <!-- <li><a href="/blog" class="hover:text-blue-400">Blog</a></li> -->
                <li><a href="/" class="hover:text-blue-400">FAQ</a></li>
                <li><a href="/" class="hover:text-blue-400">Terms of Service</a></li>
                <li><a href="/" class="hover:text-blue-400">Privacy Policy</a></li>
            </ul>
        </div>

        <!-- Contact Details -->
        <div >
            <h3 class="font-bold text-lg mb-4  bg-gradient-to-tl from-[#6504B0] to-[#ef9eff]
            text-transparent bg-clip-text">Contact Us</h3>
            <p class="text-gray-400">Email: <a href="mailto:info@creoleap.com" class="hover:text-blue-400">info@creoleap.com</a></p>
            <!-- <p>Phone: <a href="tel:+123456789" class="hover:text-blue-400">+123 456 789</a></p> -->
            <p class="text-gray-400">Location: S.T. Hindu College Road, Beach Road,<br /> Nagercoil - 629002</p>
        </div>

        <!-- Social Media -->
        <div>
            <h3 class="font-bold text-lg mb-4  bg-gradient-to-tl from-[#6504B0] to-[#ef9eff]
            text-transparent bg-clip-text">Follow Us</h3>
            <div class="flex space-x-4 md:justify-start justify-center">
              <a
              href="https://www.linkedin.com/company/creoleap/?viewAsMember=true"
              class="text-gray-400 hover:text-[#FF6B6B] transition-colors"
              aria-label="LinkedIn"
              target="_blank"
            >
              <Icon icon="mdi:linkedin" width="24" height="24" />
            </a>
              <a
                href="/"
                class="text-gray-400 hover:text-[#FF6B6B] transition-colors"
                aria-label="Instagram"
              >
                <Icon icon="mdi:instagram" width="24" height="24" />
              </a>
              <a
                href="/"
                class="text-gray-400 hover:text-[#FF6B6B] transition-colors"
                aria-label="WhatsApp"
              >
                <Icon icon="mdi:whatsapp" width="24" height="24" />
              </a>
              </div>
        </div>
    </div>

    <!-- Bottom Section with Copyright -->
    <div class="mt-12 pt-8 border-t border-gray-600 text-center text-gray-400">
        &copy; 2025 CreoLeap Technologies. All rights reserved.
    </div>
</footer>
