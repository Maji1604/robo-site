<script lang="ts">
	import Icon from '@iconify/svelte';

    // Data for cards and content with custom gradients
    const content = [
        {
            id: "stem",
            title: "STEM Education",
            description: "At CreoLeap Technologies, our STEM (Science, Technology, Engineering, and Mathematics) programs are designed to encourage hands-on learning through interactive experiments, real-world projects, and problem-solving activities. We integrate coding, electronics, and engineering principles to build critical thinking, creativity, and analytical skills, preparing students for future careers in technology and innovation.",
            buttonText: "Discover more",
            img: "/robo.webp",
            gradient: "from-sky-400 to-sky-700", // Light blue to dark blue
            hoverColor: "bg-blue-100"
        },
        {
            id: "robotics",
            title: "Robotics",
            description: "Our Robotics programs empower students to design, build, and program intelligent robots, bridging the gap between theoretical knowledge and real-world applications. With AI-powered robotic kits, coding platforms, and interactive challenges, students develop logical thinking, automation skills, and an understanding of robotics in industries such as healthcare, automation, and space exploration.",
            buttonText: "Start Building",
            img: "/lego.avif",
            gradient: "from-red-400 to-red-600", // Light red to mid red
            hoverColor: "bg-red-100"
        },
        {
            id: "electronics",
            title: "Electronics",
            description: "At Creoleap Technologies, we provide a hands-on electronics education experience that blends innovation, automation, and real-world applications. Our programs feature smart electronics kits, interactive learning modules, and AI-powered simulations to help students master circuit design, embedded systems, and IoT technology.",
            buttonText: "Begin journey",
            img: "/electronics.webp",
            gradient: "from-yellow-400 to-yellow-600", // Light yellow to darker yellow
            hoverColor: "bg-yellow-100"
        },
        {
            id: "ai",
            title: "AI (Artificial Intelligence)",
            description: "Our AI Education programs equip students with knowledge of machine learning, data science, and neural networks, helping them understand how artificial intelligence is shaping the future. Through AI-powered learning platforms, coding exercises, and real-world AI applications, students gain skills in automation, predictive analytics, and ethical AI development, preparing them to lead in the AI-driven world.",
            buttonText: "Explore AI",
            img: "/ai.webp",
            gradient: "from-teal-300 to-teal-600", // Light greenish-blue to darker
            hoverColor: "bg-teal-100"
        },
        {
            id: "iot",
            title: "IoT (Internet of Things) Education",
            description: "The Internet of Things (IoT) curriculum introduces students to the power of connected smart devices. Through hands-on projects in home automation, smart cities, and industrial IoT, students learn how to develop and program intelligent systems that sense, analyze, and respond to real-world environments, making technology more efficient and interconnected.",
            buttonText: "Learn More",
            img: "/cloud.png",
            gradient: "from-blue-800 to-gray-900", // Dark blue to bronze
            hoverColor: "bg-indigo-100"
        }
    ];

    // References to DOM elements
    let tabButtons = {};
    let navElement: HTMLElement;
    let componentRoot: HTMLDivElement;
    let sectionElement: HTMLElement;

    // Active section tracking
    let activeSection = content[0].id;
    let autoplayInterval: number | undefined;
    let isPaused = true; // Initially paused
    let pauseTimeout: number | undefined;

    // Function to change active section
    function setActiveSection(id: string, userInitiated = false) {
        activeSection = id;
        
        // Scroll the selected tab into view (will happen after rendering)
        setTimeout(() => {
            if (tabButtons[id]) {
                scrollTabIntoView(id);
            }
        }, 0);
        
        // If user clicked, pause autoplay for 10 seconds
        if (userInitiated) {
            pauseAutoplay();
        }
    }

    // Function to pause autoplay for 10 seconds
    function pauseAutoplay() {
        clearTimeout(pauseTimeout);
        isPaused = true;
        
        // Resume after 10 seconds
        pauseTimeout = setTimeout(() => {
            isPaused = false;
            startAutoplay();
        }, 10000);
    }

    // Function to scroll tab into view
    function scrollTabIntoView(id: string) {
        const button = tabButtons[id];
        if (button && navElement) {
            // Get the button's position relative to the nav container
            const buttonRect = button.getBoundingClientRect();
            const navRect = navElement.getBoundingClientRect();
            
            // Calculate the scroll position to center the button in view
            const scrollLeft = button.offsetLeft - (navRect.width / 2) + (buttonRect.width / 2);
            
            // Smooth scroll to the button
            navElement.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }

    // Auto-rotate function
    function rotateSection() {
        if (isPaused) return;
        
        const currentIndex = content.findIndex(item => item.id === activeSection);
        const nextIndex = (currentIndex + 1) % content.length;
        activeSection = content[nextIndex].id;
        
        // Ensure the newly selected tab is visible
        setTimeout(() => {
            scrollTabIntoView(content[nextIndex].id);
        }, 0);
    }

    // Start autoplay
    function startAutoplay() {
        // Clear any existing interval to prevent duplicates
        clearInterval(autoplayInterval);
        
        // Set new interval
        autoplayInterval = setInterval(() => {
            if (!isPaused) {
                rotateSection();
            }
        }, 3000);
    }

    // Initialize autoplay on component mount
    import { onMount, onDestroy } from 'svelte';
    
    onMount(() => {
        // Set up Intersection Observer to detect when the section is visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Section is visible, start autoplay
                        isPaused = false;
                        startAutoplay();
                    } else {
                        // Section is not visible, pause autoplay
                        isPaused = true;
                        clearInterval(autoplayInterval);
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% of the section is visible
            }
        );

        // Observe the section element
        if (sectionElement) {
            observer.observe(sectionElement);
        }

        // Clean up observer on component destroy
        onDestroy(() => {
            if (sectionElement) {
                observer.unobserve(sectionElement);
            }
            clearInterval(autoplayInterval);
            clearTimeout(pauseTimeout);
        });

        // Add touch and click event listeners to the whole component
        if (componentRoot) {
            componentRoot.addEventListener('click', pauseAutoplay);
            componentRoot.addEventListener('touchstart', pauseAutoplay);
        }
    });
</script>

<div bind:this={componentRoot}>
    <header class="lg:pt-20 md:pt-16 pt-10 z-10 bg-white !font-ubuntu">
        <div class="px-8">
            <div class="text-center lg:mb-16 md:mb-12 mb-8">
                <h3 class="lg:text-5xl md:text-3xl text-2xl font-bold bg-gradient-to-tr from-[#101447] to-[#1201a9] text-transparent bg-clip-text inline-block pb-2">Future Ready Learning Solutions</h3>
                <div class="w-24 h-1 bg-gradient-to-br from-[#101447] to-[#1201a9] mx-auto lg:mt-4 md:mt-2 mt-0 rounded-full"></div>
            </div>
            <div class="flex justify-center items-center lg:py-4 md:py-3 py-1">
                <!-- Navigation -->
                <nav class="w-full overflow-x-auto" bind:this={navElement}>
                    <ul class="flex w-full justify-between lg:justify-center gap-2 lg:gap-5 border-b">
                        {#each content as item}
                            <li class="flex-1 lg:flex-none lg:w-{100 / content.length}% text-center">
                                <button 
                                    bind:this={tabButtons[item.id]}
                                    class="w-full lg:px-8  lg:py-5 md:px-6 md:py-4 px-4 py-2 md:text-lg text-base lg:text-xl font-ubuntu font-bold whitespace-nowrap transition-all duration-300 lg:rounded-t-3xl md:rounded-t-2xl rounded-t-xl {activeSection === item.id ? `bg-gradient-to-b ${item.gradient} text-white` : `text-gray-600 hover:${item.hoverColor}`}"
                                    on:click={() => setActiveSection(item.id, true)}
                                >
                                    {item.title}
                                </button>
                                {#if activeSection === item.id}
                                    <!-- <div class="absolute bottom-0 left-0 w-full h-1 bg-white"></div> -->
                                {/if}
                            </li>
                        {/each}
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <main class="lg:container !font-ubuntu lg:mx-auto p-4 lg:p-8" bind:this={sectionElement}>
        {#each content as item}
            {#if activeSection === item.id}
                <div class="mt-0 animate-fadeIn">
                    <div class="flex flex-col lg:flex-row gap-8 items-center">
                        <!-- Image Section with Shimmer Effect -->
                        <div class="w-full lg:w-1/2 md:w-3/4 relative">
                            <!-- Shimmer Effect (only visible if image is not loaded) -->
                            {#if !item.img}
                                <div class="w-full h-auto rounded-[40px] shadow-lg bg-gray-200 animate-pulse"></div>
                            {/if}

                            <!-- Image (placed above shimmer if it exists) -->
                            <img
                                src={item.img}
                                alt={item.title}
                                class="w-full h-auto rounded-[40px] shadow-lg {item.img ? 'opacity-100' : 'opacity-0'}"
                                on:load={() => {
                                    const img = document.querySelector(`img[src="${item.img}"]`);
                                    if (img) img.classList.remove('opacity-0');
                                }}
                            />
                        </div>

                        <!-- Content Section -->
                        <div class="w-full !font-ubuntu lg:w-1/2 md:w-3/4 flex flex-col lg:gap-6 gap-4 ">
                            <h2 class="md:text-3xl text-2xl lg:text-5xl font-extrabold font-cool leading-normal bg-gradient-to-r {item.gradient} bg-clip-text text-transparent">
                                {item.title}
                            </h2>
                            <p class="md:text-lg text-base  lg:text-xl !leading-normal !font-ubuntu text-gray-600">
                                {item.description}
                            </p>
                            <button
                                class="md:px-7 px-5 bg-gradient-to-l {item.gradient} md:py-3 py-2 font-medium !font-ubuntu text-lg rounded-full text-white w-fit"
                                on:click={() => setActiveSection(item.id, true)}
                            >
                                {item.buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            {/if}
        {/each}
    </main>
</div>
<div>
    <section class="section !font-ubuntu">
 
  
        <div class="grid">
          <!-- Card 1: AI-Based Robotics Education -->
          <div class="card ">
            <div class="icon">
              <Icon icon="carbon:education" width="48" height="48" />
            </div>
            <h3 class="!font-ubuntu ">AI-Based Robotics Education</h3>
            <p class="!font-ubuntu !m-0">  
              Smart robotic kits designed for K-12 students. AI-powered learning integrated with real-world applications. Hands-on experience in automation, coding, and robotics.
            </p>
          </div>
      
          <!-- Card 2: AI-Driven STEM Curriculum -->
          <div class="card">
            <div class="icon">
              <Icon icon="solar:notebook-bookmark-bold-duotone" width="48" height="48" />
            </div>
            <h3 class="!font-ubuntu ">AI-Driven STEM Curriculum</h3>
            <p class="!font-ubuntu !m-0">
              Customized AI-infused STEM learning programs. Aligned with NEP 2020 and global educational standards. Adaptive learning with AI-based assessments for personalized growth.
            </p>
          </div>
      
          <!-- Card 3: AI-Powered Learning Platform -->
          <div class="card">
            <div class="icon">
              <Icon icon="mdi:laptop" width="48" height="48" />
            </div>
            <h3 class="!font-ubuntu ">AI-Powered Learning Platform</h3>
            <p class="!font-ubuntu !m-0">
              Interactive online modules for immersive robotics education. Virtual AI simulations in STEM, Robotics, and Electronics.
            </p>
          </div>
      
          <!-- Card 4: AI Training & Workshops -->
          <div class="card">
            <div class="icon">
              <Icon icon="prime:microchip-ai" width="52" height="52" />
            </div>
            <h3 class="!font-ubuntu ">AI Training & Workshops</h3>
            <p class="!font-ubuntu ">
              AI and robotics boot camps for students and professionals. Faculty training programs to enhance AI literacy. AI readiness initiatives for institutions and educators.
            </p>
          </div>
        </div>
      </section>
</div>

<style>
    /* Animation for content transition */
    .animate-fadeIn {
        animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Shimmer Effect */
    .animate-pulse {
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    /* Make the scrollbar in the navigation nicer */
    nav {
        scrollbar-width: thin;
        scrollbar-color: rgba(128, 90, 213, 0.6) transparent;
    }

    nav::-webkit-scrollbar {
        height: 4px;
    }

    nav::-webkit-scrollbar-thumb {
        background-color: rgba(128, 90, 213, 0.6);
        border-radius: 4px;
    }

    .section {
      padding: 2rem 1rem;
      /* background-color: #f9fafb; */
      text-align: center;
    }
  
    .section h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1rem;
    }
  
    .section p {
      font-size: 1.1rem;
      color: #64748b;
      max-width: 800px;
      margin: 0 auto 3rem;
    }
  
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 0 2rem;
    }
  
    .card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
  
    .card:hover {
      transform: translateY(-10px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
  
    .card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 1rem 0;
    }
  
    .card p {
      font-size: 1.2rem;
      color: #64748b;
      line-height: 1.6;
    }
  
    .icon {
      font-size: 2.5rem;
      color: rgba(112, 50, 195, 1);
      margin-bottom: 1rem;
    }
  
    @media (max-width: 768px) {
    .section {
      padding: 0rem 0rem;
    }

    .section h2 {
      font-size: 2rem;
    }

    .section p {
      font-size: 1rem;
    }

    .grid {
      grid-template-columns: 1fr;
      padding: 0 0.5rem; /* Further reduced padding on small screens */
    }


    .card h3 {
      font-size: 1.25rem; /* Slightly smaller heading on small screens */
    }

    .card p {
      font-size: 1rem; /* Slightly smaller text on small screens */
    }
  }
</style>