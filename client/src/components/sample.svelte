<script>
  import { onMount } from 'svelte';
  
  let isVisible = false;
  let textItems = [];
  let featureItems = [];
  let imageRevealed = false;
  
  // Features with icons
  const features = [
    { 
      icon: "🤖", 
      title: "AI-powered Interactive Kits",
      description: "Foster inquisitiveness and active learning through hands-on experiences."
    },
    { 
      icon: "🧪", 
      title: "STEM Education",
      description: "Encourage analytical and creative problem-solving with working components."
    },
    { 
      icon: "📚", 
      title: "AI-powered Curriculum",
      description: "Innovate education on all fronts with tailor-made solutions for schools."
    },
    { 
      icon: "🚀", 
      title: "Technology Training",
      description: "Prepare learners for life beyond school with focused skill development."
    }
  ];
  
  // Animation for staggered reveal
  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 300);
    
    // Staggered animation for text items
    if (textItems.length) {
      textItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, 500 + (index * 200));
      });
    }
    
    // Staggered animation for feature items
    if (featureItems.length) {
      featureItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateX(0)";
        }, 800 + (index * 150));
      });
    }
    
    // Image reveal
    setTimeout(() => {
      imageRevealed = true;
    }, 600);
  });
</script>

<section class="relative overflow-hidden bg-gradient-to-b from-blue-900 to-purple-900 text-white py-20">
  <!-- Animated background elements -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-full">
      <!-- Floating particle grid -->
      <div class="absolute w-full h-full opacity-10">
        <div class="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-purple-400 blur-xl animate-pulse"></div>
        <div class="absolute top-3/4 left-1/3 w-48 h-48 rounded-full bg-blue-400 blur-xl animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-indigo-400 blur-xl animate-pulse" style="animation-delay: 2s;"></div>
      </div>
      
      <!-- Circuit pattern overlay -->
      <div class="absolute inset-0 bg-[url('/images/circuit-pattern.svg')] bg-repeat opacity-5"></div>
    </div>
  </div>

  <div class="container mx-auto px-6 relative z-10">
    <div class="flex flex-col lg:flex-row items-center gap-12">
      <!-- Text content -->
      <div class="lg:w-1/2 space-y-8">
        <!-- Headline with gradient -->
        <h1 
          bind:this={textItems[0]}
          class="text-4xl md:text-5xl font-bold leading-tight opacity-0 transition-all duration-700 ease-out"
          style="transform: translateY(30px);"
        >
          <span class="bg-gradient-to-r from-[#C961DE] to-[#6504B0] bg-clip-text text-transparent">Inventing Tomorrow:</span>
          <br /> Technology Education Redefined
        </h1>
        
        <!-- Main content -->
        <p 
          bind:this={textItems[1]}
          class="text-lg text-gray-200 opacity-0 transition-all duration-700 ease-out" 
          style="transform: translateY(30px);"
        >
          CreoLeap Technologies is innovating education by enabling young learners with advanced programs in AI, STEM, Robotics, and Electronics. We extend impactful learning through a modern approach that bridges traditional and digital methods.
        </p>
        
        <!-- CTA buttons -->
        <div 
          bind:this={textItems[2]}
          class="flex flex-wrap gap-4 opacity-0 transition-all duration-700 ease-out"
          style="transform: translateY(30px);"
        >
          <button class="px-8 py-3 bg-gradient-to-r from-[#C961DE] to-[#6504B0] rounded-full font-medium shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1">
            Explore Programs
          </button>
          <button class="px-8 py-3 bg-transparent border border-purple-400 rounded-full font-medium hover:bg-purple-800/20 transition-all duration-300 transform hover:-translate-y-1">
            Learn More
          </button>
        </div>
      </div>
      
      <!-- Image/Illustration with reveal animation -->
      <div class="lg:w-1/2 relative">
        <div class="relative overflow-hidden rounded-xl shadow-2xl">
          <!-- Image mask animation -->
          <div class="absolute inset-0 bg-gradient-to-r from-[#C961DE] to-[#6504B0] clip-path-reveal transition-all duration-1500 ease-out"
               class:clip-path-revealed={imageRevealed}></div>
          
          <!-- Main image -->
          <img 
            src="/images/ai-education-hero.jpg" 
            alt="CreoLeap Technologies Education" 
            class="w-full h-auto rounded-xl transform transition-all duration-700 hover:scale-105"
          />
          
          <!-- Floating badges -->
          <div class="absolute -top-6 -right-6 bg-white text-purple-900 px-4 py-2 rounded-lg shadow-lg font-bold rotate-6 animate-float">
            AI-Powered
          </div>
          <div class="absolute -bottom-4 -left-4 bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg font-bold -rotate-3 animate-float-delay">
            Future-Ready
          </div>
        </div>
      </div>
    </div>
    
    <!-- Features grid -->
    <div class="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each features as feature, i}
        <div 
          bind:this={featureItems[i]}
          class="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 group opacity-0"
          style="transform: translateX(30px);"
        >
          <div class="text-4xl mb-4 p-3 bg-gradient-to-br from-[#C961DE]/20 to-[#6504B0]/20 inline-block rounded-lg group-hover:scale-110 transition-transform duration-300">
            {feature.icon}
          </div>
          <h3 class="text-xl font-semibold mb-2 text-white group-hover:text-[#C961DE] transition-colors duration-300">
            {feature.title}
          </h3>
          <p class="text-gray-300">
            {feature.description}
          </p>
        </div>
      {/each}
    </div>
    
    <!-- Values section -->
    <div class="mt-24 text-center">
      <h2 
        bind:this={textItems[3]}
        class="text-3xl font-bold mb-12 opacity-0 transition-all duration-700 ease-out inline-block"
        style="transform: translateY(30px);"
      >
        <span class="bg-gradient-to-r from-[#C961DE] to-[#6504B0] bg-clip-text text-transparent">Our Approach</span>
      </h2>
      
      <div class="flex flex-wrap justify-center gap-8">
        <div class="max-w-xs p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transform transition-all duration-500 hover:translate-y-[-10px] hover:border-purple-500/30">
          <h3 class="text-xl font-semibold mb-3">Greater Pride Visibility</h3>
          <p class="text-gray-300">When providing our services, institutions feel greater pride for our achievements like exceeding market expectations.</p>
        </div>
        
        <div class="max-w-xs p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transform transition-all duration-500 hover:translate-y-[-10px] hover:border-purple-500/30">
          <h3 class="text-xl font-semibold mb-3">Embracing Change</h3>
          <p class="text-gray-300">Focusing on positive change that builds relationships rather than improves profits.</p>
        </div>
        
        <div class="max-w-xs p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transform transition-all duration-500 hover:translate-y-[-10px] hover:border-purple-500/30">
          <h3 class="text-xl font-semibold mb-3">Advanced And Effective</h3>
          <p class="text-gray-300">Breathe marketing and performing to the modern way rather than by older, less effective methods.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(6deg); }
    50% { transform: translateY(-10px) rotate(6deg); }
  }
  
  @keyframes float-delay {
    0%, 100% { transform: translateY(0) rotate(-3deg); }
    50% { transform: translateY(-10px) rotate(-3deg); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-float-delay {
    animation: float 6s ease-in-out infinite 2s;
  }
  
  .animate-pulse {
    animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .clip-path-reveal {
    clip-path: inset(0 0 0 100%);
  }
  
  .clip-path-revealed {
    clip-path: inset(0 100% 0 0);
  }
</style>