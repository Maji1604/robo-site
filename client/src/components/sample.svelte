<script>
  import { onMount } from 'svelte';
  
  let isVisible = false;
  /**
	 * @type {any[]}
	 */
  let textItems = [];
  /**
	 * @type {any[]}
	 */
  let featureItems = [];
  let imageRevealed = false;
  
  // Enhanced animation for staggered reveal
  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 200);
    
    // Faster staggered animation for text items
    if (textItems.length) {
      textItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, 300 + (index * 150));
      });
    }
    
    // Improved staggered animation for feature items
    if (featureItems.length) {
      featureItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateX(0)";
        }, 600 + (index * 120));
      });
    }
    
    // Faster image reveal
    setTimeout(() => {
      imageRevealed = true;
    }, 400);
  });
</script>

<section class="relative overflow-hidden py-16 md:py-24 mt-8 md:mt-16 bg-gradient-to-br from-[#080A25] to-[#0a015a] text-white">
  <!-- Abstract background elements -->
  <div class="absolute inset-0 overflow-hidden ">
    <!-- <div class="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
    <div class="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
    <div class="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div> -->
<div class="lg:flex justify-center items-center hidden">
  <img src="/svg/bg.svg" alt="My Icon" class="h-full " />
</div>
  </div>
  
  <div class="mx-auto px-6 relative z-10 max-w-7xl">    
    <!-- Enhanced values section -->
    <div class="text-center">
      <h2 
        bind:this={textItems[0]}
        class="text-4xl md:text-5xl font-bold mb-12 md:mb-16 opacity-0 transition-all duration-700 ease-out inline-block"
        style="transform: translateY(30px);"
      >
        <span class="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-violet-600 bg-clip-text text-transparent drop-shadow-lg">Our Approach</span>
      </h2>
      
      <div class="flex flex-wrap justify-center gap-6 md:gap-10">
        {#each ["🏆", "🌱", "⚡"] as icon, i}
          {@const titles = ["Greater Pride Visibility", "Embracing Change", "Advanced And Effective"]}
          {@const descriptions = [
            "When providing our services, institutions feel greater pride for our achievements like exceeding market expectations.",
            "Focusing on positive change that builds relationships rather than improves profits.",
            "Breathe marketing and performing to the modern way rather than by older, less effective methods."
          ]}
          
          <div 
            bind:this={featureItems[i]} 
            class="w-full sm:w-auto max-w-xs p-6 md:p-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 transform transition-all duration-500 opacity-0 hover:-translate-y-2 hover:border-fuchsia-500/30 hover:shadow-xl hover:shadow-fuchsia-700/20 group"
            style="transform: translateY(40px);"
          >
            <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-fuchsia-700/20">
              {icon}
            </div>
            <h3 class="text-xl md:text-2xl font-bold mb-4 group-hover:text-fuchsia-300 transition-colors duration-300">{titles[i]}</h3>
            <p class="text-gray-300 leading-relaxed text-sm md:text-base">{descriptions[i]}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  /* Custom animations that can't be directly implemented with standard Tailwind classes */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes glow {
    0% { box-shadow: 0 0 10px rgba(196, 94, 229, 0.5); }
    50% { box-shadow: 0 0 20px rgba(196, 94, 229, 0.8); }
    100% { box-shadow: 0 0 10px rgba(196, 94, 229, 0.5); }
  }
  
  /* Apply animations to elements */
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-glow {
    animation: glow 3s ease-in-out infinite;
  }
  
  /* Add custom utility class for animation delays */
  .delay-1000 {
    animation-delay: 1000ms;
  }
  
  .delay-2000 {
    animation-delay: 2000ms;
  }
  
  /* Custom class for image reveal animation */
  .translate-x-full {
    transform: translateX(100%);
  }
  
  /* Responsive text adjustments */
  @media (max-width: 640px) {
    .text-4xl {
      font-size: 2.25rem;
    }
    
    .text-2xl {
      font-size: 1.5rem;
    }
  }
  
  /* Enhance card hover effect */
  .group:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  }
</style>