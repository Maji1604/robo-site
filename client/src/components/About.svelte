<script>
  // import Footer_2 from "../../components/Footer_2.svelte";
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import { fly, fade, scale } from 'svelte/transition';
  import { spring } from 'svelte/motion';

  // Animation control
  let visible = false;
  let visibleSections = {
      intro: false,
      vision: false,
      mission: false,
      cards: false,
      innovation: false,
      cta: false
  };

  // Intersection Observer for animations
  onMount(() => {
      // Set initial visible state
      setTimeout(() => {
          visible = true;
          visibleSections.intro = true;
      }, 200);

      // Setup intersection observers for each section
      const sections = [
          { id: 'vision-mission', key: 'vision' },
          { id: 'ccc-cards', key: 'cards' },
          { id: 'reasons', key: 'cards' },
          { id: 'innovation', key: 'innovation' },
          { id: 'cta', key: 'cta' }
      ];

      sections.forEach(section => {
          const element = document.getElementById(section.id);
          if (element) {
              const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                      if (entry.isIntersecting) {
                          visibleSections[section.key] = true;
                          observer.unobserve(entry.target);
                      }
                  });
              }, { threshold: 0.2 });
              
              observer.observe(element);
          }
      });
  });

  // Mouse parallax effect
  let mouseX = 0;
  let mouseY = 0;
  
  /**
 * @param {{ clientX: number; clientY: number; }} event
 */
  function handleMouseMove(event) {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
  }

  // Card hover states
  let hoveredCard = null;
  
  /**
 * @param {any} index
 */
  function setHoveredCard(index) {
      hoveredCard = index;
  }
  
  function clearHoveredCard() {
      hoveredCard = null;
  }
</script>

<svelte:window on:mousemove={handleMouseMove} />

<section id="about" class="flex justify-center items-center relative overflow-hidden bg-gradient-to-br from-white to-[#f8f6ff] text-[#080A25] py-24 mt-0">
  <!-- Animated background elements -->
  <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full opacity-10">
          <div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 blur-3xl animate-pulse" style="animation-duration: 8s;"></div>
          <div class="absolute top-2/3 right-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFA500] blur-3xl animate-pulse" style="animation-duration: 12s; animation-delay: 1s;"></div>
          <div class="absolute bottom-1/4 left-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-[#00BFFF] to-[#32CD32] blur-3xl animate-pulse" style="animation-duration: 10s; animation-delay: 2s;"></div>
      </div>
  </div>
  
  <div class=" lg:w-[90%]  px-6 lg:px-16 relative z-10">
      
      <!-- Title and Intro -->
      {#if visible}
      <div class="text-center mb-20" in:fly={{ y: 50, duration: 800, delay: 200 }}>

          <p class="mt-0 text-2xl text-gray-700 max-w-8xl mx-auto leading-relaxed">
              At Creoleap Technologies, we are transforming education by integrating AI, Robotics, and STEM learning into a dynamic, NEP-aligned curriculum based on the 
                 CCC Method. Our mission is to empower students and educators with innovative tools, fostering a culture of inquiry-driven, hands-on learning that prepares young minds for the future.
          </p>
      </div>
      {/if}

      <!-- Vision & Mission -->
      <div id="vision-mission" class="grid  grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          {#if visibleSections.vision}
          <div in:fly={{ x: -50, duration: 800, delay: 300 }}>
              <div class="flex flex-col gap-5 ">
                 <div class="bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-[0_10px_50px_rgba(101,4,176,0.1)] border border-purple-100">
                  <h3 class="text-3xl font-semibold text-[#0a015a] mb-6 flex items-center group">
                      <div class="flex items-center justify-center w-14 h-14 mr-4 bg-[#f5eeff] rounded-full text-[#6504b0] group-hover:bg-[#6504b0] group-hover:text-white transition-all duration-300">
                          <Icon icon="mdi:eye-outline" width="28" height="28" />
                      </div>
                      <span class="bg-gradient-to-r from-[#080A25] to-[#0a015a] bg-clip-text text-transparent">Our Vision</span>
                  </h3>
                  <p class="text-lg text-gray-700 mb-6 leading-relaxed pl-4 border-l-2 border-purple-200">
                      Creoleap Technologies envisions a future where students "Leap into the AI Future" through hands-on learning in AI, Robotics, and STEM, fostering curiosity, creativity, and critical thinking.
                  </p>
                 </div>

                 <div class="bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-[0_10px_50px_rgba(101,4,176,0.1)] border border-purple-100">
                  <h3 class="text-3xl font-semibold text-[#0a015a] mb-6 mt-10 flex items-center group">
                      <div class="flex items-center justify-center w-14 h-14 mr-4 bg-[#f5eeff] rounded-full text-[#6504b0] group-hover:bg-[#6504b0] group-hover:text-white transition-all duration-300">
                          <Icon icon="mdi:flag-outline" width="28" height="28" />
                      </div>
                      <span class="bg-gradient-to-r from-[#0a015a] to-[#4a30a0] bg-clip-text text-transparent">Our Mission</span>
                  </h3>
                  <p class="text-lg text-gray-700 leading-relaxed pl-4 border-l-2 border-purple-200">
                  We equip educators and students with cutting-edge tools and experiential learning, bridging theory and practice to drive innovation and real-world problem-solving.
                 </div>
              </div>
          </div>
          {/if}

          {#if visibleSections.vision}
          <div class="relative " in:fly={{ x: 50, duration: 800, delay: 500 }}>
              <div  style="transform: perspective(1000px) rotateY(-10deg) rotateX(2deg);" class="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform hover:scale-105 transition-all duration-500 relative group">
                  <!-- <div class="absolute inset-0 bg-gradient-to-t from-[#6504b0]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div> -->
                  <video autoplay loop muted  width="100%" poster="/path/to/poster-image.jpg" class="w-full object-cover">
                      <source src="/video/child.mp4" type="video/mp4">
                      Your browser does not support the video tag.
                  </video>
              </div>
              
              <div id="ccc-cards" class="mt-8 grid grid-cols-3 gap-6">
                  <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col items-center py-6 px-4 transition-all duration-500 hover:translate-y-[-10px] border-b-4 border-[#FF4500]" 
                       style="transform: perspective(1000px) rotateY({mouseX * 5}deg) rotateX({-mouseY * 5}deg);">
                      <div class="w-16 h-16 rounded-full bg-[#ffefe9] flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110">
                          <Icon icon="mdi:brain" class="text-[#FF4500]" width="40" height="40" />
                      </div>
                      <p class="text-center font-bold text-[#0a015a]">Curiosity</p>
                      <div class="w-10 h-1 bg-[#FF4500] mt-3 rounded-full"></div>
                  </div>
                  
                  <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col items-center py-6 px-4 transition-all duration-500 hover:translate-y-[-10px] border-b-4 border-[#008080]"
                       style="transform: perspective(1000px) rotateY({mouseX * 5}deg) rotateX({-mouseY * 5}deg);">
                      <div class="w-16 h-16 rounded-full bg-[#e6f7f7] flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110">
                          <Icon icon="mdi:lightbulb-on-outline" class="text-[#008080]" width="40" height="40" />
                      </div>
                      <p class="text-center font-bold text-[#0a015a]">Creativity</p>
                      <div class="w-10 h-1 bg-[#008080] mt-3 rounded-full"></div>
                  </div>
                  
                  <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col items-center py-6 px-4 transition-all duration-500 hover:translate-y-[-10px] border-b-4 border-[#483D8B]"
                       style="transform: perspective(1000px) rotateY({mouseX * 5}deg) rotateX({-mouseY * 5}deg);">
                      <div class="w-16 h-16 rounded-full bg-[#eeecf7] flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110">
                          <Icon icon="mdi:head-cog-outline" class="text-[#483D8B]" width="40" height="40" />
                      </div>
                      <p class="text-center font-bold text-[#0a015a]">Critical Thinking</p>
                      <div class="w-10 h-1 bg-[#483D8B] mt-3 rounded-full"></div>
                  </div>
              </div>
          </div>
          {/if}
      </div>

  

  </div>
</section>

<!-- <Footer_2 /> -->

<style>
  @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
  }
  
  @keyframes pulse {
      0% { opacity: 0.7; }
      50% { opacity: 0.9; }
      100% { opacity: 0.7; }
  }
  
  :global(.animate-float) {
      animation: float 6s ease-in-out infinite;
  }
  
  :global(.animate-pulse) {
      animation: pulse 4s ease-in-out infinite;
  }
</style>