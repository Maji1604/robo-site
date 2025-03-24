<script>
  import Icon from "@iconify/svelte";
</script>

<footer class="bg-gradient-to-tr from-[#080A25] to-[#0a015a] text-white lg:pt-20 pb-8 pt-12 px-6 sm:px-10 lg:px-20 relative overflow-hidden">
  <!-- Top Section with Logo & Intro -->
  <div class="flex justify-center items-center md:text-left lg:mb-24 mb-14">
    <div class="lg:mb-6 mb-0 flex items-center justify-center">
      <img src="/newLogo.png" class="lg:w-2/5 w-3/4 mx-auto md:mx-0" alt="CreoLeap Technologies Logo">
    </div>
  </div>

  <!-- Middle Section with Links -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
    <!-- Nested Grid for Quick Links and Resources -->
    <div class="grid grid-cols-2 gap-8 text-center md:text-left md:col-span-2">
      <!-- Quick Links -->
      <div>
        <h3 class="font-bold text-lg mb-4 bg-gradient-to-tl from-[#6504B0] to-[#ef9eff] text-transparent bg-clip-text">
          Quick Links
        </h3>
        <ul class="space-y-2 text-gray-400">
          <li><a href="/about_us" class="hover:text-blue-400">About Us</a></li>
          <li><a href="/" class="hover:text-blue-400">Solutions</a></li>
          <li><a href="/#contact" class="hover:text-blue-400">Contact Us</a></li>
          <li><a href="/" class="hover:text-blue-400">Careers</a></li>
        </ul>
      </div>

      <!-- Resources -->
      <div>
        <h3 class="font-bold text-lg mb-4 bg-gradient-to-tl from-[#6504B0] to-[#ef9eff] text-transparent bg-clip-text">
          Resources
        </h3>
        <ul class="space-y-2 text-gray-400">
          <li><a href="/" class="hover:text-blue-400">Terms of Service</a></li>
          <li><a href="/" class="hover:text-blue-400">Privacy Policy</a></li>
        </ul>
      </div>
    </div>

    <!-- Contact Details -->
    <div class="max-w-md mx-auto space-y-4 text-center md:text-left">
      <h3 class="font-bold text-lg mb-2 bg-gradient-to-tl from-[#6504B0] to-[#ef9eff] text-transparent bg-clip-text">
        Contact Us
      </h3>
      <h1 class="text-gray-400 mb-4 font-medium">
        CREOLEAP TECHNOLOGIES PRIVATE LIMITED
      </h1>
      <div class="space-y-2 flex flex-col items-center md:items-start">
        <!-- Phone -->
        <div class="flex items-start gap-3">
          <Icon icon="mdi:phone" class="text-[#ef9eff94] mt-0 flex-shrink-0" width="20" />
          <a href="tel:+919363208701" class="text-gray-400 hover:text-blue-500 transition-colors">
            +91 9363208701
          </a>
        </div>
        <!-- Email -->
        <div class="flex items-start gap-3">
          <Icon icon="mdi:email-outline" class="text-[#ef9eff94] mt-0 flex-shrink-0" width="20" />
          <a href="mailto:info@creoleap.com" class="text-gray-400 hover:text-blue-500 transition-colors">
            info@creoleap.com
          </a>
        </div>
        <!-- Location -->
        <div class="flex items-start gap-3 text-center md:text-left">
          <Icon icon="mdi:map-marker-outline" class="text-[#ef9eff94] mt-0.5 flex-shrink-0" width="20" />
          <p class="text-gray-400">
            13/6, S.T. Hindu College Road, Beach Road,<br />Nagercoil - 629002
          </p>
        </div>
      </div>
    </div>

    <!-- Social Media -->
    <div class="text-center md:text-left">
      <h3 class="font-bold text-lg mb-4 bg-gradient-to-tl from-[#6504B0] to-[#ef9eff] text-transparent bg-clip-text">
        Follow Us
      </h3>
      <div class="flex space-x-4 justify-center md:justify-start">
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
    © 2025 CreoLeap Technologies. All rights reserved.
  </div>
</footer>