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


<div id="innovation" class="px-6 md:px-0 lg:mt-24 md:mt-16 mb-5 md:mb-0 mt-0 overflow-hidden">
    {#if visibleSections.innovation}
    <div in:fly={{ y: 30, duration: 800 }}>
        <div class="text-center !font-ubuntu lg:mb-16 md:mb-12 mb-8">
            <h3 class="lg:text-5xl md:text-3xl text-2xl font-bold bg-gradient-to-tr from-[#101447] to-[#1201a9] text-transparent bg-clip-text inline-block pb-2">Inspiring Innovation & Critical Thinking</h3>
            <div class="w-24 h-1 bg-gradient-to-br from-[#101447] to-[#1201a9] mx-auto lg:mt-4 md:mt-2 mt-0 rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 justify-items-center lg:grid-cols-2 gap-16 items-center">
            <div class="">
                <div class="order-2 md:order-1 relative" in:fly={{ x: -30, duration: 800, delay: 200 }}>
                    <div class="absolute -bottom-16 -left-16 w-80  h-80 bg-gradient-to-br from-[#6504b0]/20 to-transparent rounded-full"></div>
                    <div class="absolute -top-10 -right-10 w-40  h-40 bg-gradient-to-br from-[#FF4500]/20 to-transparent rounded-full"></div>
                    
                    <div class="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-white relative z-10 transform transition-all duration-500 hover:scale-[1]"
                         style="transform: perspective(1000px) rotateY({mouseX * 30}deg) rotateX({-mouseY * 30}deg);">
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
            </div>
          
            
            <div class="order-1 md:order-2" in:fly={{ x: 50, duration: 800, delay: 400 }}>
                <div class="lg:space-y-8 md:space-y-6 space-y-3">
                    <div class="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 border-[#6504b0] hover:shadow-[0_10px_30px_rgba(101,4,176,0.15)] transition-all duration-300 transform md:hover:translate-x-10 hover:translate-x-5">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-[#f8f0ff] flex items-center justify-center mr-4">
                                <Icon icon="mdi:magnify" class="text-[#6504b0]" width="24" height="24" />
                            </div>
                            <h4 class="md:text-xl text-lg !font-ubuntu font-bold text-[#0a015a]">Curiosity-Driven Learning</h4>
                        </div>
                        <p class="md:text-lg text-base !font-ubuntu text-gray-700 leading-relaxed">We encourage students to ask questions, explore concepts, and develop a deeper understanding of technology through guided discovery and experiential learning.</p>
                    </div>
                    
                    <div class="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 border-[#FF4500] hover:shadow-[0_10px_30px_rgba(255,69,0,0.15)] transition-all duration-300 transform md:hover:translate-x-10 hover:translate-x-5">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-[#fff4f0] flex items-center justify-center mr-4">
                                <Icon icon="mdi:puzzle-outline" class="text-[#FF4500]" width="24" height="24" />
                            </div>
                            <h4 class="md:text-xl text-lg !font-ubuntu font-bold text-[#0a015a]">Creative Problem-Solving</h4>
                        </div>
                        <p class="md:text-lg text-base !font-ubuntu text-gray-700 leading-relaxed">Through hands-on activities and collaborative projects, we nurture innovation and out-of-the-box thinking that prepares students for real-world challenges.</p>
                    </div>
                    
                    <div class="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 border-[#00BFFF] hover:shadow-[0_10px_30px_rgba(0,191,255,0.15)] transition-all duration-300 transform md:hover:translate-x-10 hover:translate-x-5">
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