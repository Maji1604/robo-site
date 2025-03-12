<script lang="ts">
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

    // Active section tracking
    let activeSection = content[0].id;
    let autoplayInterval: number | undefined;
    let isPaused = false;
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
        startAutoplay();
        // Ensure the initially active tab is visible
        setTimeout(() => {
            scrollTabIntoView(activeSection);
        }, 100);
        
        // Add touch and click event listeners to the whole component
        if (componentRoot) {
            componentRoot.addEventListener('click', pauseAutoplay);
            componentRoot.addEventListener('touchstart', pauseAutoplay);
        }
    });
    
    onDestroy(() => {
        clearInterval(autoplayInterval);
        clearTimeout(pauseTimeout);
        
        // Clean up event listeners
        if (componentRoot) {
            componentRoot.removeEventListener('click', pauseAutoplay);
            componentRoot.removeEventListener('touchstart', pauseAutoplay);
        }
    });
</script>

<div bind:this={componentRoot}>
    <header class="pt-20 z-10 bg-white">
        <div class="px-8">
            <div class="flex justify-center items-center py-4">
                <!-- Navigation -->
                <nav class="w-full overflow-x-auto" bind:this={navElement}>
                    <ul class="flex w-full justify-between md:justify-center gap-2 lg:gap-5 border-b">
                        {#each content as item}
                            <li class="flex-1 lg:flex-none lg:w-{100 / content.length}% text-center">
                                <button 
                                    bind:this={tabButtons[item.id]}
                                    class="w-full px-8 py-5 text-lg lg:text-xl font-ubuntu font-bold whitespace-nowrap transition-all duration-300 rounded-t-3xl {activeSection === item.id ? `bg-gradient-to-b ${item.gradient} text-white` : `text-gray-600 hover:${item.hoverColor}`}"
                                    on:click={() => setActiveSection(item.id, true)}
                                >
                                    {item.title}
                                </button>
                                {#if activeSection === item.id}
                                    <div class="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <main class="container mx-auto p-4 md:p-8">
        {#each content as item}
            {#if activeSection === item.id}
                <div class="mt-0 animate-fadeIn">
                    <div class="flex flex-col md:flex-row gap-8 items-center">
                        <!-- Image Section -->
                        <div class="w-full md:w-1/2">
                            <img
                                src={item.img}
                                alt={item.title}
                                class="w-full h-auto rounded-[40px] shadow-lg"
                            />
                        </div>

                        <!-- Content Section -->
                        <div class="w-full md:w-1/2 flex flex-col gap-6">
                            <h2 class="text-3xl md:text-5xl font-extrabold font-cool leading-normal bg-gradient-to-r {item.gradient} bg-clip-text text-transparent">
                                {item.title}
                            </h2>
                            <p class="text-lg md:text-xl !leading-loose text-gray-600">
                                {item.description}
                            </p>
                            <button
                                class="px-7 bg-gradient-to-l {item.gradient} py-3 font-medium font-ubuntu text-lg rounded-full text-white w-fit"
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

<style>
    /* Animation for content transition */
    .animate-fadeIn {
        animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
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
</style>