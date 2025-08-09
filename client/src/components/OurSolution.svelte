<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

    const cards = [
        { img: "/robo.webp" },
        { img: "/lego.webp" },
        { img: "/electronics.webp" },
        { img: "/ai.webp" }, 
        { img: "/cloud.webp" } // New card
    ];

    let activeIndex = 0;
    let sectionContainer: HTMLElement;
    let scrolling = false;
    let touchStartY = 0;

    // Calculate transform for cards
    function getTransform(index: number, active: number) {
        const diff = index - active;
        const angle = diff * (Math.PI / 3);
        const radius = 180;

        const x = Math.sin(angle) * radius;
        const z = Math.tan(angle) * radius;
        const y = Math.abs(Math.tan(angle)) * 100;

        return `translate(${y}px, ${x}px) translateZ(${y}px) rotateZ(${diff * 45}deg)`;
    }

    // Handle changing slides
    function setActiveIndex(newIndex: number) {
        if (newIndex >= 0 && newIndex < cards.length) {
            activeIndex = newIndex;
        }
    }

    // Simple throttle function for scroll events
    function throttle(callback: Function, limit: number) {
        let waiting = false;
        return function() {
            if (!waiting) {
                callback.apply(this, arguments);
                waiting = true;
                setTimeout(function() {
                    waiting = false;
                }, limit);
            }
        };
    }

    // Handle smooth scrolling between slides
    function handleScroll(event: WheelEvent) {
        event.preventDefault();
        
        if (scrolling) return;
        
        const delta = Math.sign(event.deltaY);
        
        if (delta > 0 && activeIndex < cards.length - 1) {
            // Scroll down -> move to next card
            scrolling = true;
            setActiveIndex(activeIndex + 1);
            
            setTimeout(() => {
                scrolling = false;
            }, 800);
        } else if (delta < 0 && activeIndex > 0) {
            // Scroll up -> move to previous card
            scrolling = true;
            setActiveIndex(activeIndex - 1);
            
            setTimeout(() => {
                scrolling = false;
            }, 800);
        } else if (delta > 0 && activeIndex === cards.length - 1) {
            // At last card, scrolling down should allow regular page scroll
            document.body.style.overflow = 'auto';
        } else if (delta < 0 && activeIndex === 0) {
            // At first card, scrolling up should allow regular page scroll
            document.body.style.overflow = 'auto';
        }
    }

    // Handle touch interactions
    function handleTouchStart(e: TouchEvent) {
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e: TouchEvent) {
        if (scrolling) return;
        
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        
        if (Math.abs(diff) > 50) { // threshold
            if (diff > 0 && activeIndex < cards.length - 1) {
                // Swipe up -> next card
                scrolling = true;
                setActiveIndex(activeIndex + 1);
                
                setTimeout(() => {
                    scrolling = false;
                }, 800);
            } else if (diff < 0 && activeIndex > 0) {
                // Swipe down -> previous card
                scrolling = true;
                setActiveIndex(activeIndex - 1);
                
                setTimeout(() => {
                    scrolling = false;
                }, 800);
            }
            
            touchStartY = touchY;
        }
    }

    // Initialize observers and event listeners
    onMount(() => {
        if (browser) {
            // Create observer to check when section enters/exits viewport
            const sectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // When section comes into view, lock scrolling
                            document.body.style.overflow = 'hidden';
                        } else if (entry.boundingClientRect.top > 0) {
                            // Scrolled past the section
                            document.body.style.overflow = 'auto';
                        }
                    });
                },
                { threshold: 0.9 } // 90% visibility
            );
            
            sectionObserver.observe(sectionContainer);
            
            // Ensure proper state when page loads
            if (window.innerHeight > sectionContainer.getBoundingClientRect().top) {
                document.body.style.overflow = 'hidden';
            }
            
            // Add throttled wheel event listener
            const throttledScroll = throttle(handleScroll, 200);
            sectionContainer.addEventListener('wheel', throttledScroll, { passive: false });
            
            return () => {
                sectionObserver.disconnect();
                sectionContainer.removeEventListener('wheel', throttledScroll);
                document.body.style.overflow = 'auto';
            };
        }
    });
</script>

<main
    class=" flex flex-row h-screen"
    bind:this={sectionContainer}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
>
    <!-- Left Section (Text) -->
    <section class="w-1/2 h-screen flex items-center justify-center px-16 sticky top-0">
        <div class="text-gray-800 flex flex-col gap-10">
            {#if activeIndex === 0}
                <h1 class="text-7xl font-cool font-bold leading-normal bg-gradient-to-r from-[#6504B0] to-[#C961DE] bg-clip-text text-transparent">
                    STEM Education
                </h1>
                <p class="text-xl font-ubuntu !leading-loose text-gray-600">
                    At CreoLeap Technologies, our STEM (Science, Technology, Engineering, and Mathematics) programs are designed to encourage hands-on learning through interactive experiments, real-world projects, and problem-solving activities. We integrate coding, electronics, and engineering principles to build critical thinking, creativity, and analytical skills, preparing students for future careers in technology and innovation.
                </p>
                <div>
                    <button 
                        class="px-7 bg-gradient-to-l from-[#6504B0] to-[#C961DE] py-3 font-medium text-lg rounded-full text-white"
                        on:click={() => setActiveIndex(1)}
                    >
                    Discover more
                    </button>
                </div>
            {:else if activeIndex === 1}
                <h1 class="text-7xl font-cool font-bold leading-normal bg-gradient-to-r from-[#6504B0] to-[#C961DE] bg-clip-text text-transparent">
                    Robotics 
                </h1>
                <p class="text-xl font-ubuntu !leading-loose  text-gray-600">
                    Our Robotics programs empower students to design, build, and program intelligent robots, bridging the gap between theoretical knowledge and real-world applications. With AI-powered robotic kits, coding platforms, and interactive challenges, students develop logical thinking, automation skills, and an understanding of robotics in industries such as healthcare, automation, and space exploration.
                </p>
                <div>
                    <button 
                        class="px-7 bg-gradient-to-l from-[#6504B0] to-[#C961DE] py-3 font-medium text-lg rounded-full text-white"
                        on:click={() => setActiveIndex(2)}
                    >
                        Start Building
                    </button>
                </div>
            {:else if activeIndex === 2}
                <h1 class="text-7xl font-cool font-bold leading-normal bg-gradient-to-r from-[#6504B0] to-[#C961DE] bg-clip-text text-transparent">
                   Electronics
                </h1>
                <p class="text-xl font-ubuntu !leading-loose text-gray-600">
                    At Creoleap Technologies, we provide a hands-on electronics education experience that blends innovation, automation, and real-world applications. Our programs feature smart electronics kits, interactive learning modules, and AI-powered simulations to help students master circuit design, embedded systems, and IoT technology.
                </p>
                <div>
                    <button 
                        class="px-7 bg-gradient-to-l from-[#6504B0] to-[#C961DE] py-3 font-medium text-lg rounded-full text-white"
                        on:click={() => setActiveIndex(3)}
                    >
                   Begin journey
                    </button>
                </div>
            {:else if activeIndex === 3}
                <h1 class="text-7xl font-cool font-bold leading-normal bg-gradient-to-r from-[#6504B0] to-[#C961DE] bg-clip-text text-transparent">
                    AI (Artificial Intelligence) 
                </h1>
                <p class="text-xl font-ubuntu !leading-loose text-gray-600">
                    Our AI Education programs equip students with knowledge of machine learning, data science, and neural networks, helping them understand how artificial intelligence is shaping the future. Through AI-powered learning platforms, coding exercises, and real-world AI applications, students gain skills in automation, predictive analytics, and ethical AI development, preparing them to lead in the AI-driven world.
                </p>
                <div>
                    <button 
                        class="px-7 bg-gradient-to-l from-[#6504B0] to-[#C961DE] py-3 font-medium text-lg rounded-full text-white"
                        on:click={() => {
                            document.body.style.overflow = 'auto';
                            window.scrollTo({
                                top: sectionContainer.offsetHeight + 100,
                                behavior: 'smooth'
                            });
                        }}
                    >
                        Explore AI
                    </button>
                </div>
                {:else if activeIndex === 4}
                <h1 class="text-7xl font-cool font-bold leading-normal bg-gradient-to-r from-[#6504B0] to-[#C961DE] bg-clip-text text-transparent">
                    IoT (Internet of Things) Education
                </h1>
                <p class="text-xl font-ubuntu !leading-loose text-gray-600">
                    The Internet of Things (IoT) curriculum introduces students to the power of connected smart devices. Through hands-on projects in home automation, smart cities, and industrial IoT, students learn how to develop and program intelligent systems that sense, analyze, and respond to real-world environments, making technology more efficient and interconnected.
                </p>
                <div>
                    <button 
                        class="px-7 bg-gradient-to-l from-[#6504B0] to-[#C961DE] py-3 font-medium text-lg rounded-full text-white"
                        on:click={() => setActiveIndex(3)}
                    >
                        Learn More
                    </button>
                </div>
            {/if}
        </div>
    </section>

    <!-- Right Section (Cards) -->
    <section class="w-1/2 h-screen flex items-center justify-center">
        <div class="relative h-full w-full">
            {#each cards as card, i}
                {@const isActive = i === activeIndex}
                {@const isPrev = i < activeIndex}
                {@const isNext = i > activeIndex}

                <div
                    class="absolute top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
                    style="
                        transform: 
                            translate(-0%, -50%)
                            {getTransform(i, activeIndex)}
                            scale({isActive ? 1 : 0.6});
                        opacity: {isActive ? 1 : isPrev || isNext ? 0.01 : 0};
                        z-index: {isActive ? 10 : 1};
                    "
                >
                    <div class="h-[500px] w-full rounded-[40px] shadow-2xl flex">
                        <div class="w-full flex items-center justify-center">
                            <!-- <video
                                class="h-full relative rounded-[40px] z-10 w-full object-cover"
                                autoplay
                                loop
                                muted
                                playsinline
                                src={card.video}
                            >
                                Your browser does not support the video tag.
                            </video> -->
                            <img src={card.img} loading="lazy" alt="" class="rounded-l-[40px] object-cover ">
                        </div>
                    </div>
                </div>
            {/each}
            
            <!-- Optional: Navigation Dots -->
            <div class="hidden bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {#each cards as _, i}
                    <button 
                        class="w-3 h-3 rounded-full transition-all duration-300"
                        style="background-color: {i === activeIndex ? '#6504B0' : '#CCCCCC'}; 
                               transform: scale({i === activeIndex ? 1.2 : 1});"
                        on:click={() => setActiveIndex(i)}
                    ></button>
                {/each}
            </div>
        </div>
    </section>
</main>

<style>
    section {
        margin: 0;
    }

    .sticky {
        position: sticky;
        top: 0;
    }

    .ease-out {
        transition-timing-function: cubic-bezier(0.33, 0.8, 0.33, 0.8);
    }
    
    /* Prevent default scrolling on main component when active */
    :global(body.no-scroll) {
        overflow: hidden;
    }
</style>