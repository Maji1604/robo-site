<script lang="ts">
    // Previous imports and type definitions remain the same
    import { spring } from 'svelte/motion';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
// import image from "../../public/video/featuredimage.jpg"
import ellipse from "$lib/images/Ellipse 22.png";
import hero1 from "$lib/images/Group 3446 (2) (1).png";
    import waves from "$lib/images/pngwing.com (2) 1.png";

 
    const cards = [
        { video: "/video/electronics.mp4" },
        { video: "/video/electronics.mp4" },
        { video: "/video/stem.mp4" }
    ];
    // const cards = [
    //     { video: "$lib/video/electronics.mp4" },
    //     { video: "$lib//video/electronics.mp4" },
    //     { video: "$lib/video/stem.mp4" }
    // ];

    let activeIndex = 0;
    let isAnimating = false;
    let accumulatedDelta = 0;
    let lastCardVisible = false;
    let readyToScroll = false;
    const SCROLL_THRESHOLD = 100;
    let componentMounted = false;
    
    $: isFixed = !readyToScroll;

    // All previous functions remain exactly the same
    function enableScrolling() {
        if (browser && componentMounted) {
            readyToScroll = true;
            document.documentElement.style.scrollBehavior = 'smooth';
            document.documentElement.style.overflow = 'auto';
            setTimeout(() => {
                document.documentElement.style.scrollBehavior = 'auto';
            }, 100);
        }
    }

    function handleScroll(event: WheelEvent) {
        if (!componentMounted) return;
        if (readyToScroll && event.deltaY > 0) return;
        event.preventDefault();
        if (isAnimating) return;
        
        accumulatedDelta += event.deltaY;
        
        if (Math.abs(accumulatedDelta) >= SCROLL_THRESHOLD) {
            const delta = Math.sign(accumulatedDelta);
            
            if (delta > 0 && activeIndex < cards.length - 1) {
                isAnimating = true;
                activeIndex++;
                
                if (activeIndex === cards.length - 1 && !lastCardVisible) {
                    lastCardVisible = true;
                    setTimeout(enableScrolling, 500);
                }
                
                setTimeout(() => {
                    isAnimating = false;
                }, 1000);
            } else if (delta < 0 && activeIndex > 0) {
                isAnimating = true;
                activeIndex--;
                
                if (readyToScroll) {
                    readyToScroll = false;
                    lastCardVisible = false;
                    if (browser) {
                        document.documentElement.style.overflow = 'hidden';
                    }
                }
                
                setTimeout(() => isAnimating = false, 1000);
            }
            
            accumulatedDelta = 0;
        }
    }

    function getTransform(index: number, active: number) {
        const diff = index - active;
        const angle = diff * (Math.PI / 3);
        const radius = 180;
        
        const x = Math.sin(angle) * radius;
        const z = Math.tan(angle) * radius;
        const y = Math.abs(Math.tan(angle)) * 100;
        
        return `translate(${y}px, ${x}px) translateZ(${y}px) rotateZ(${diff * 45}deg)`;
    }
    
    onMount(() => {
        componentMounted = true;
        if (browser) {
            document.documentElement.style.overflow = 'hidden';
        }
    });
    
    onDestroy(() => {
        if (browser && componentMounted) {
            document.documentElement.style.overflow = 'auto';
            document.documentElement.style.scrollBehavior = 'auto';
        }
    });
</script>

<main class="bg-gradient-to-r from-[#1A023E] to-[#1E0445] flex {isFixed ? 'fixed-section' : ''}"
    on:wheel={handleScroll}>

    <div class="absolute right-0 top-0">
        <img src={ellipse} class="w-[500px]" alt="Decorative Ellipse">
    </div>

    <!-- <div class="absolute   top-[48%] transform -translate-y-1/2">
        <img src={hero1} class="w-[1000px]" alt="Hero Graphic">
    </div> -->

    <!-- Left Section (Text) -->
    <section class="h-screen  w-1/2 relative ">
        <div class="absolute px-16 inset-0 flex items-center justify-center">
            {#if activeIndex === 0}
                <div class="text-white flex flex-col gap-10">
                    <h1 class="text-6xl font-bold leading-normal">
                        Empowering Minds, Transforming Futures with AI Innovation
                    </h1>
                    <p class="text-xl">
                        Empowering young minds with cutting edge AI, STEM, Robotics and Electronics education, enabling them to innovate and lead in a technology-driven world.
                    </p>
                    <div>
                        <button class="px-7 bg-gradient-to-l from-[#6504B0] to-[#C961DE] py-3 font-medium text-lg rounded-full">
                            Unleash Potential
                        </button>
                    </div>
                </div>
            {:else if activeIndex === 1}
                <div class="text-white flex flex-col gap-10">
                    <h1 class="text-6xl font-bold leading-normal">
                        Building Tomorrow's Innovators Through Electronics
                    </h1>
                    <p class="text-xl">
                        Discover the world of electronics through hands-on learning, circuit design, and real-world projects. Shape the future by mastering the fundamentals of electronic engineering and innovation.
                    </p>
                    <div>
                        <button class="px-7 bg-gradient-to-l from-[#6504B0] to-[#C961DE] py-3 font-medium text-lg rounded-full">
                            Start Creating
                        </button>
                    </div>
                </div>
            {:else if activeIndex === 2}
                <div class="text-white flex flex-col gap-10">
                    <h1 class="text-6xl font-bold leading-normal">
                        Revolutionizing Education Through STEM and Robotics
                    </h1>
                    <p class="text-xl">
                        Experience the perfect blend of science, technology, engineering, and mathematics through advanced robotics. Build, program, and control robots while developing critical thinking and problem-solving skills.
                    </p>
                    <div>
                        <button class="px-7 bg-gradient-to-l from-[#6504B0] to-[#C961DE] py-3 font-medium text-lg rounded-full">
                            Begin Journey
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </section>

    <!-- Right Section (Cards) - Keeping original animation logic -->
    <section class="h-screen w-1/2">
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
                <div class="h-[500px] w-full rounded-[40px]  shadow-2xl flex ">
                    <div class="w-full flex items-center justify-center">
                        <video 
                            class="h-full relative rounded-[40px] z-10 w-full object-cover"
                            autoplay
                            loop
                            muted
                            playsinline
                            src={card.video}
                        >
                        Your browser does not support the video tag.
                        </video>
                        <!-- <div class="bg-white relative z-10 p-32"> -->

                        <!-- </div> -->
                    </div>
        <!-- <img src="/video/giphy.gif" alt="wdec" class="w-full z-20"> -->

                </div>
            </div>
            {/each}
        </div>

    </section>
  
</main>

<style>
    section {
        margin: 0;
        overflow: hidden;
        width: 100%;
    }

    .fixed-section {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 50;
    }

    .ease-out {
        transition-timing-function: cubic-bezier(0.33,0.8, 0.33, 0.8);
    }

</style>