<script>
    let isOpen = false;
    let logo = "/newLogo.png"; 
    const toggleMenu = () => (isOpen = !isOpen);
    
    // Improved navigation function that handles both same-page and cross-page navigation
    function handleNavigation(event, href) {
      // Check if this is a hash link on the current page
      if (href.startsWith('#')) {
        // We're targeting an element on the current page
        event.preventDefault();
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          // Close mobile menu if open
          if (isOpen) {
            isOpen = false;
          }
          
          // Smooth scroll to the element
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without causing page jump
          history.pushState(null, null, href);
        }
      } 
      else if (href.includes('#')) {
        // We're navigating to another page with a hash
        const [pagePath, hash] = href.split('#');
        
        // Check if we're already on the target page
        const currentPath = window.location.pathname;
        
        if (pagePath === currentPath || pagePath === '/' && currentPath === '') {
          // We're on the correct page, just scroll to the element
          event.preventDefault();
          const targetElement = document.querySelector(`#${hash}`);
          
          if (targetElement) {
            // Close mobile menu if open
            if (isOpen) {
              isOpen = false;
            }
            
            // Smooth scroll to the element
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // Update URL without causing page jump
            history.pushState(null, null, `#${hash}`);
          }
        }
        // If not on the right page, let the normal navigation happen
        // The browser will navigate to the new page and then to the hash
      }
    }
</script>
  
<nav class="bg-[#011546c4] backdrop-blur-sm z-50 fixed w-full top-0 text-white border-b border-purple-500/20">
  <div class="w-[100vw] px-4 md:px-4 py-2 flex justify-between items-center">
    <!-- Logo -->
    <div class="flex justify-start w-full xl:pl-10 lg:pr-8">
      <a href="/">
        <img src={logo} alt="Company Logo" class="lg:h-16 p-0 md:h-10 h-8" />
      </a>
    </div>
  
    <!-- Desktop Navigation -->
    <ul class="hidden md:flex space-x-6 xl:pr-10 lg:pr-8">
      <li>
        <a href="/" class="relative group">
          <span class="font-medium text-white/90 transition-all duration-300 group-hover:text-white text-lg">Home</span>
          <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#C961DE] to-[#6504B0] transition-all duration-300 group-hover:w-full"></span>
        </a>
      </li>
      <li>
        <a href="/about_us" class="relative group">
          <span class="font-medium text-white/90 transition-all duration-300 group-hover:text-white text-lg">About</span>
          <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#C961DE] to-[#6504B0] transition-all duration-300 group-hover:w-full"></span>
        </a>
      </li>
      <li>
        <a href="/" class="relative group">
          <span class="font-medium text-white/90 transition-all duration-300 group-hover:text-white text-lg">Solutions</span>
          <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#C961DE] to-[#6504B0] transition-all duration-300 group-hover:w-full"></span>
        </a>
      </li>
      <li>
        <a href="/#contact" class="relative group" on:click={(e) => handleNavigation(e, '/#contact')}>
          <span class="font-medium text-white/90 transition-all duration-300 group-hover:text-white text-lg">Contact</span>
          <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#C961DE] to-[#6504B0] transition-all duration-300 group-hover:w-full"></span>
        </a>
      </li>
    </ul>
  
    <!-- Hamburger Button (Visible until md) -->
    <button
      class="block md:hidden focus:outline-none p-2 rounded-lg hover:border bg-[#011546c4]"
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
    <div class="sm:block md:hidden overflow-hidden transition-all duration-300">
      <ul class="bg-[#011546c4] backdrop-blur-md text-white divide-y divide-purple-500/10">
        <li>
          <a href="/" class="block px-6 py-3 hover:bg-gradient-to-r from-[#6504B0]/20 to-[#C961DE]/20 transition-all duration-300">
            Home
          </a>
        </li>
        <li>
          <a href="/about_us" class="block px-6 py-3 hover:bg-gradient-to-r from-[#6504B0]/20 to-[#C961DE]/20 transition-all duration-300">
            About
          </a>
        </li>
        <li>
          <a href="/" class="block px-6 py-3 hover:bg-gradient-to-r from-[#6504B0]/20 to-[#C961DE]/20 transition-all duration-300">
            Solutions
          </a>
        </li>
        <li>
          <a href="/#contact" class="block px-6 py-3 hover:bg-gradient-to-r from-[#6504B0]/20 to-[#C961DE]/20 transition-all duration-300" on:click={(e) => handleNavigation(e, '/#contact')}>
            Contact
          </a>
        </li>
      </ul>
    </div>
  {/if}
</nav>