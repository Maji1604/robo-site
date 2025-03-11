<script>
  let isOpen = false;
  let logo = "/logo.png"; 
  // Toggle menu visibility
  const toggleMenu = () => (isOpen = !isOpen);
</script>

<nav class="bg-[#011546c4] backdrop-blur-sm z-50 fixed w-full top-0 text-white border-b border-purple-500/20">
  <div class="container mx-10 px-1 py-5 flex justify-between items-center">
      <!-- Logo -->
      <!-- <a href="/" class="text-2xl font-bold font-ubuntu bg-gradient-to-r from-[#C961DE] to-[#6504B0] bg-clip-text text-transparent">CreoLeap</a> -->
      <a href="/">
        <img src={logo} alt="Company Logo" class="h-12" />
      </a>
      <!-- Desktop Navigation -->
      <ul class="hidden md:flex space-x-8">
          <li>
              <a href="/" class="relative group">
                  <span class="font-medium text-white/90 transition-all duration-300 group-hover:text-white text-xl">Home</span>
                  <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#C961DE] to-[#6504B0] transition-all duration-300 group-hover:w-full"></span>
              </a>
          </li>
          <li>
              <a href="/about" class="relative group">
                  <span class="font-medium text-white/90 transition-all duration-300 group-hover:text-white text-xl">About</span>
                  <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#C961DE] to-[#6504B0] transition-all duration-300 group-hover:w-full"></span>
              </a>
          </li>
          <li>
              <a href="/services" class="relative group">
                  <span class="font-medium text-white/90 transition-all duration-300 group-hover:text-white text-xl">Services</span>
                  <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#C961DE] to-[#6504B0] transition-all duration-300 group-hover:w-full"></span>
              </a>
          </li>
          <li>
              <a href="/contact" class="relative group">
                  <span class="font-medium text-white/90 transition-all duration-300 group-hover:text-white text-xl">Contact</span>
                  <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#C961DE] to-[#6504B0] transition-all duration-300 group-hover:w-full"></span>
              </a>
          </li>
      </ul>
      

      <button
          class="md:hidden focus:outline-none p-2 rounded-lg hover:bg-purple-900/30 transition-colors"
          on:click={toggleMenu}
          aria-label="Toggle navigation menu"
      >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {#if isOpen}
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              {:else}
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              {/if}
          </svg>
      </button>
  </div>
  
  {#if isOpen}
      <div class="md:hidden overflow-hidden transition-all duration-300">
          <ul class="bg-gradient-to-b from-blue-800/95 to-purple-900/95 backdrop-blur-md text-white divide-y divide-purple-500/10">
              <li>
                  <a href="/" class="block px-6 py-3 hover:bg-gradient-to-r from-[#6504B0]/20 to-[#C961DE]/20 transition-all duration-300">
                      Home
                  </a>
              </li>
              <li>
                  <a href="/about" class="block px-6 py-3 hover:bg-gradient-to-r from-[#6504B0]/20 to-[#C961DE]/20 transition-all duration-300">
                      About
                  </a>
              </li>
              <li>
                  <a href="/services" class="block px-6 py-3 hover:bg-gradient-to-r from-[#6504B0]/20 to-[#C961DE]/20 transition-all duration-300">
                      Services
                  </a>
              </li>
              <li>
                  <a href="/contact" class="block px-6 py-3 hover:bg-gradient-to-r from-[#6504B0]/20 to-[#C961DE]/20 transition-all duration-300">
                      Contact
                  </a>
              </li>
          </ul>
      </div>
  {/if}
</nav>