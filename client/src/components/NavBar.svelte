<script lang="ts">
  import { slide, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { sineOut } from 'svelte/easing';
  import Icon from '@iconify/svelte';

  let isOpen = false;
  let solutionsOpen = false; // Track Solutions submenu state
  let logo = '/newLogo.png'; // Ensure this path is correct relative to your public folder
  let menuRef: HTMLDivElement;
  let hamburgerRef: HTMLButtonElement;

  // Toggle mobile menu
  const toggleMenu = () => {
    isOpen = !isOpen;
    if (!isOpen) solutionsOpen = false; // Close submenu when closing drawer
  };

  // Toggle Solutions submenu (mobile only)
  const toggleSolutions = () => {
    solutionsOpen = !solutionsOpen;
  };

  // Navigation function
  function handleNavigation(event: Event, href: string) {
    event.preventDefault();
    isOpen = false;
    solutionsOpen = false;

    if (href.startsWith('#')) {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, href);
      }
    } else if (href.includes('#')) {
      const [pagePath, hash] = href.split('#');
      const currentPath = window.location.pathname;

      if (pagePath === currentPath || (pagePath === '/' && currentPath === '')) {
        const targetElement = document.querySelector(`#${hash}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, null, `#${hash}`);
        }
      } else {
        window.location.href = href;
      }
    } else {
      window.location.href = href;
    }
  }

  // Click-outside handler
  function clickOutside(node: HTMLElement) {
    const handleClick = (event: MouseEvent) => {
      if (
        isOpen &&
        !node.contains(event.target as Node) &&
        hamburgerRef &&
        !hamburgerRef.contains(event.target as Node)
      ) {
        isOpen = false;
        solutionsOpen = false;
      }
    };
    document.addEventListener('mousedown', handleClick);
    return {
      destroy() {
        document.removeEventListener('mousedown', handleClick);
      },
    };
  }

  onMount(() => {
    // Handle escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        isOpen = false;
        solutionsOpen = false;
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Verify logo
    const img = new Image();
    img.src = logo;
    img.onerror = () => console.warn('Logo image failed to load. Check the path:', logo);

    return () => document.removeEventListener('keydown', handleEscape);
  });
</script>

<svelte:head>
  <title>CreoLeap</title>
</svelte:head>

<header class="w-full flex justify-center items-center fixed top-0 z-50">
  <section class="w-full  bg-[#011546]/90 backdrop-blur-sm border-b border-purple-500/20 px-4 md:px-6 lg:h-20 h-14 flex items-center">
    <nav class="flex w-full items-center justify-between h-full">
      <!-- Logo -->
      <div>
        <a href="/" on:click={(e) => handleNavigation(e, '/')}>
          <img src={logo} alt="SK-Fisheries Logo" class="h-8 md:h-10 lg:h-16 object-contain" />
        </a>
      </div>

      <!-- Desktop Menu -->
      <div class="hidden md:block">
        <ul class="flex gap-6 lg:gap-8 items-center">
          <li>
            <a
              href="/"
              on:click={(e) => handleNavigation(e, '/')}
              class="text-white/90 hover:text-white text-lg font-medium transition-colors duration-300 relative group"
            >
              Home
              <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#C961DE] to-[#6504B0] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li>
            <a
              href="/about_us"
              on:click={(e) => handleNavigation(e, '/about_us')}
              class="text-white/90 hover:text-white text-lg font-medium transition-colors duration-300 relative group"
            >
              About
              <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#C961DE] to-[#6504B0] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li class="relative group">
            <a
              href="/#solution"
              on:click={(e) => handleNavigation(e, '/#solution')}
              class="text-white/90 hover:text-white text-lg font-medium transition-colors duration-300 relative flex items-center"
            >
              Solutions
              <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#C961DE] to-[#6504B0] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <!-- Desktop Submenu -->
            <ul
              class="absolute top-full left-0 mt-2 w-48 bg-[#011546]/90 backdrop-blur-md rounded-lg shadow-lg border border-purple-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-50"
              in:fade={{ duration: 200, easing: sineOut }}
              out:fade={{ duration: 150, easing: sineOut }}
            >
              <li>
                <a
                  href="/#fishery-management"
                  on:click={(e) => handleNavigation(e, '/#fishery-management')}
                  class="block px-4 py-2 text-white/90 hover:bg-gradient-to-r from-[#6504B0]/20 to-[#C961DE]/20 transition-colors duration-300"
                >
                  Fishery Management
                </a>
              </li>
              <li>
                <a
                  href="/#supply-chain"
                  on:click={(e) => handleNavigation(e, '/#supply-chain')}
                  class="block px-4 py-2 text-white/90 hover:bg-gradient-to-r from-[#6504B0]/20 to-[#C961DE]/20 transition-colors duration-300"
                >
                  Supply Chain
                </a>
              </li>
              <li>
                <a
                  href="/#analytics"
                  on:click={(e) => handleNavigation(e, '/#analytics')}
                  class="block px-4 py-2 text-white/90 hover:bg-gradient-to-r from-[#6504B0]/20 to-[#C961DE]/20 transition-colors duration-300"
                >
                  Analytics
                </a>
              </li>
            </ul>
          </li>
        
          <li>
            <button
            on:click={(e) => handleNavigation(e, '/#contact')}
            class="bg-[#6504B0] hover:bg-[#C961DE] py-2 px-4 lg:px-6 rounded-lg text-sm lg:text-base font-semibold text-white transition-colors duration-300"
          >
            Contact Us
          </button>
          </li>
        </ul>
      </div>

    

      <!-- Hamburger Menu - Mobile -->
      <button
        bind:this={hamburgerRef}
        class="md:hidden p-2 rounded-lg z-50 hover:bg-[#6504B0]/20 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        on:click={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <Icon
          icon={isOpen ? 'line-md:close' : 'line-md:menu'}
          width="28"
          height="28"
          class="text-white transition-all duration-700"
        />
      </button>
    </nav>
  </section>

  <!-- Mobile Menu Drawer -->
  {#if isOpen}
    <div
      bind:this={menuRef}
      class="fixed top-14 right-0 w-64 bg-[#011546]/95 backdrop-blur-md shadow-lg h-screen z-50 md:hidden"
      transition:slide={{ duration: 500, easing: sineOut, axis: 'x' }}
      use:clickOutside
      role="navigation"
      aria-label="Mobile navigation menu"
    >
      <div class="p-6">
        <ul class="flex flex-col gap-6">
          <li>
            <a
              href="/"
              on:click={(e) => handleNavigation(e, '/')}
              class="text-white/90 hover:text-white transition-colors duration-300 flex items-center gap-3"
            >
              <Icon icon="mdi:home" width="20" height="20" />
              <span>Home</span>
            </a>
          </li>
          <li>
            <a
              href="/about_us"
              on:click={(e) => handleNavigation(e, '/about_us')}
              class="text-white/90 hover:text-white transition-colors duration-300 flex items-center gap-3"
            >
              <Icon icon="mdi:information" width="20" height="20" />
              <span>About</span>
            </a>
          </li>
          <li>
            <button
              class="w-full text-left text-white/90 hover:text-white transition-colors duration-300 flex items-center justify-between"
              on:click={toggleSolutions}
              aria-expanded={solutionsOpen}
              aria-controls="solutions-submenu"
            >
              <div class="flex items-center gap-3">
                <Icon icon="mdi:folder" width="20" height="20" />
                <span>Solutions</span>
              </div>
              <Icon
                icon="mdi:chevron-down"
                width="20"
                height="20"
                class="transform transition-transform duration-300"
              />
            </button>
            {#if solutionsOpen}
              <ul
                class="pl-8 mt-2 flex flex-col gap-2"
                id="solutions-submenu"
                in:slide={{ duration: 300, easing: sineOut }}
                out:slide={{ duration: 200, easing: sineOut }}
              >
                <li>
                  <a
                    href="/#fishery-management"
                    on:click={(e) => handleNavigation(e, '/#fishery-management')}
                    class="text-white/90 hover:text-white transition-colors duration-300 block"
                  >
                    Fishery Management
                  </a>
                </li>
                <li>
                  <a
                    href="/#supply-chain"
                    on:click={(e) => handleNavigation(e, '/#supply-chain')}
                    class="text-white/90 hover:text-white transition-colors duration-300 block"
                  >
                    Supply Chain
                  </a>
                </li>
                <li>
                  <a
                    href="/#analytics"
                    on:click={(e) => handleNavigation(e, '/#analytics')}
                    class="text-white/90 hover:text-white transition-colors duration-300 block"
                  >
                    Analytics
                  </a>
                </li>
              </ul>
            {/if}
          </li>
          <li>
            <a
              href="/#contact"
              on:click={(e) => handleNavigation(e, '/#contact')}
              class="text-white/90 hover:text-white transition-colors duration-300 flex items-center gap-3"
            >
              <Icon icon="mdi:contact" width="20" height="20" />
              <span>Contact</span>
            </a>
          </li>
        </ul>

        <!-- Contact Button - Mobile -->
        <div class="mt-8">
          <button
            on:click={(e) => handleNavigation(e, '/#contact')}
            class="w-full bg-[#6504B0] hover:bg-[#C961DE] py-3 rounded-lg text-base font-semibold text-white transition-colors duration-300"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Backdrop -->
  {#if isOpen}
    <div
      class="fixed top-14 inset-0 bg-black/50 z-40 md:hidden"
      in:fade={{ duration: 700, easing: sineOut }}
      out:fade={{ duration: 300, easing: sineOut }}
      on:click={toggleMenu}
    ></div>
  {/if}
</header>

<style>
  .rotate-180 {
    transform: rotate(180deg);
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.5);
  }

  @media (prefers-reduced-motion: reduce) {
    [transition=slide],
    [transition=fade] {
      transition: none !important;
    }
    .transition-transform {
      transition: none !important;
    }
  }
</style>