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
   
<section class="flex justify-center items-center lg:mb-20 mb-10">
  <div class="lg:w-[90%]  px-6 lg:px-16 relative z-10">
   <!-- Why Choose Us -->
   <div id="reasons" class="lg:mt-24 my-16 lg:mb-24 ">
    {#if visibleSections.cards}
    <div in:fly={{ y: 50, duration: 800 }}>
        <div class="text-center lg:mb-16 md:mb-12 mb-0">
            <h3 class="lg:text-5xl md:text-3xl text-2xl font-bold bg-gradient-to-tr from-[#101447] to-[#1201a9] text-transparent bg-clip-text inline-block pb-2">Accelerating the Future with Creoleap</h3>
            <div class="w-24 h-1 bg-gradient-to-r from-[#080A25] to-[#0a015a] mx-auto lg:mt-4 rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 md:gap-6 gap-0">
            {#each [
                {icon: "mdi:book-education-outline", color: "#6504b0", title: "NEP-Aligned Curriculum", desc: "Our programs are designed to meet the guidelines of the National Education Policy, ensuring future-ready education."},
                {icon: "mdi:atom", color: "#00BFFF", title: "CCC Methodology", desc: "We integrate Curiosity, Creativity, and Critical Thinking into every learning experience."},
                {icon: "mdi:robot", color: "#FF4500", title: "Innovative Learning Solutions", desc: "We provide advanced educational products and set up future-ready STEM labs."},
                {icon: "mdi:hand-extended-outline", color: "#32CD32", title: "Hands-On Training Programs", desc: "Our expert-led training sessions empower both teachers and students with practical knowledge."},
                {icon: "mdi:flask-outline", color: "#FFA500", title: "Experiential Learning Focus", desc: "We prioritize real-world applications over rote memorization to enhance engagement and retention."},
                {icon: "mdi:toolbox-outline", color: "#800080", title: "Comprehensive Resources", desc: "From robotics kits to AI-driven tools, we offer a diverse range of learning materials."},
                {icon: "mdi:account-group", color: "#1E90FF", title: "Expert-Led Development", desc: "Our team of professionals ensures high-quality content and solutions tailored to modern education needs."},
                {icon: "mdi:desktop-mac", color: "#DC143C", title: "Innovation Hubs", desc: "We create collaborative spaces that promote creativity and technological exploration."},
                {icon: "mdi:headset", color: "#2E8B57", title: "Dedicated Support & Consultation", desc: "We provide ongoing guidance to ensure seamless implementation of our solutions."}
            ] as feature, i (i)}
                <div class="group relative z-10 overflow-hidden" in:fly={{ y: 50, duration: 500, delay: 100 + i * 100 }}>
                    <div class="bg-white/90 backdrop-blur-xl lg:p-8 md:p-6 p-4 rounded-xl shadow-xl border border-transparent transition-all duration-500 group-hover:border-[{feature.color}]/50 group-hover:shadow-[0_40px_40px_rgba(0,0,0,0)] h-full relative z-10 group-hover:translate-y-[-25px]">
                        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[{feature.color}]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-[{feature.color}]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div class="flex items-center mb-6 relative z-10">
                            <div class="w-14 h-14 rounded-lg bg-[{feature.color}]/40 flex items-center justify-center mr-4 transition-all duration-500 group-hover:bg-[{feature.color}]/40">
                                <Icon icon={feature.icon} class="text-[{feature.color}]" width="28" height="28" />
                            </div>
                            <h4 class="text-xl !font-ubuntu font-bold text-[#0a015a] group-hover:text-[{feature.color}] transition-colors duration-300">{feature.title}</h4>
                        </div>
                        <p class="text-gray-700 !font-ubuntu leading-relaxed pl-4 border-l-2 border-[{feature.color}]/30 relative z-10">{feature.desc}</p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
    {/if}
</div>

<!-- Inspiring Innovation -->
<div id="innovation" class="lg:mt-24 md:mt-16 mt-0 ">
    {#if visibleSections.innovation}
    <div in:fly={{ y: 50, duration: 800 }}>
        <div class="text-center !font-ubuntu lg:mb-16 md:mb-12 mb-8">
            <h3 class="lg:text-5xl md:text-3xl text-2xl font-bold bg-gradient-to-tr from-[#101447] to-[#1201a9] text-transparent bg-clip-text inline-block pb-2">Inspiring Innovation & Critical Thinking</h3>
            <div class="w-24 h-1 bg-gradient-to-br from-[#101447] to-[#1201a9] mx-auto lg:mt-4 md:mt-2 mt-0 rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="order-2 md:order-1 relative" in:fly={{ x: -50, duration: 800, delay: 200 }}>
                <div class="absolute -bottom-16 -left-16 w-80  h-80 bg-gradient-to-br from-[#6504b0]/20 to-transparent rounded-full"></div>
                <div class="absolute -top-10 -right-10 w-40  h-40 bg-gradient-to-br from-[#FF4500]/20 to-transparent rounded-full"></div>
                
                <div class="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-white relative z-10 transform transition-all duration-500 hover:scale-[1.02]"
                     style="transform: perspective(1000px) rotateY({mouseX * 40}deg) rotateX({-mouseY * 40}deg);">
                    <img 
                        src="/skills.png"
                        alt="Innovation Hub"
                        class="w-full"
                    />
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-80 transition-opacity duration-500 flex items-end">
                        <div class="p-6 text-white">
                            <h4 class="md:text-xl text-lg !font-ubuntu font-bold mb-2">Innovation Hubs</h4>
                            <p>Creating spaces where ideas flourish and innovation thrives</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="order-1 md:order-2" in:fly={{ x: 50, duration: 800, delay: 400 }}>
                <div class="lg:space-y-8 md:space-y-6 space-y-3">
                    <div class="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 border-[#6504b0] hover:shadow-[0_10px_30px_rgba(101,4,176,0.15)] transition-all duration-300 transform hover:translate-x-10">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-[#f8f0ff] flex items-center justify-center mr-4">
                                <Icon icon="mdi:magnify" class="text-[#6504b0]" width="24" height="24" />
                            </div>
                            <h4 class="md:text-xl text-lg !font-ubuntu font-bold text-[#0a015a]">Curiosity-Driven Learning</h4>
                        </div>
                        <p class="md:text-lg text-base !font-ubuntu text-gray-700 leading-relaxed">We encourage students to ask questions, explore concepts, and develop a deeper understanding of technology through guided discovery and experiential learning.</p>
                    </div>
                    
                    <div class="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 border-[#FF4500] hover:shadow-[0_10px_30px_rgba(255,69,0,0.15)] transition-all duration-300 transform hover:translate-x-10">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-[#fff4f0] flex items-center justify-center mr-4">
                                <Icon icon="mdi:puzzle-outline" class="text-[#FF4500]" width="24" height="24" />
                            </div>
                            <h4 class="md:text-xl text-lg !font-ubuntu font-bold text-[#0a015a]">Creative Problem-Solving</h4>
                        </div>
                        <p class="md:text-lg text-base !font-ubuntu text-gray-700 leading-relaxed">Through hands-on activities and collaborative projects, we nurture innovation and out-of-the-box thinking that prepares students for real-world challenges.</p>
                    </div>
                    
                    <div class="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 border-[#00BFFF] hover:shadow-[0_10px_30px_rgba(0,191,255,0.15)] transition-all duration-300 transform hover:translate-x-10">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-[#f0faff] flex items-center justify-center mr-4">
                                <Icon icon="mdi:domain" class="text-[#00BFFF]" width="24" height="24" />
                            </div>
                            <h4 class="md:text-xl text-lg !font-ubuntu font-bold text-[#0a015a]">Building Future-Ready Hubs</h4>
                        </div>
                        <p class="md:text-lg text-base !font-ubuntu text-gray-700 leading-relaxed">Our innovation hubs serve as incubation centers for young minds to explore, create, and bring ideas to life through state-of-the-art technology and expert guidance.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/if}
</div>
  </div>
  

  <!-- Call to Action -->
</section>
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