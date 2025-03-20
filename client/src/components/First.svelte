<script>
  import { onMount } from "svelte";

  let videoSource = "/background-video.mp4"; // Update with your actual video path
</script>

<style>
  .hero {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: rgba(1, 21, 70, 0.769);
  }

  .hero video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    z-index: 10;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 1, 49, 0.5);
    z-index: 5;
  }

  @media (max-width: 640px) {
    .hero {
      height: 90vh;
    }
  }
</style>

<div class="hero">
  <video autoplay loop muted playsinline>
    <source src='/video/elec.mp4' type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <div class="overlay"></div>
 
  <div class="content z-10 w-full px-4 md:w-3/4 lg:w-3/4">
    <h1 style="text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);" class="text-white w-full font-cool font-extrabold text-3xl  md:text-4xl lg:text-6xl xl:text-[5rem] !leading-normal">
      Empowering Minds,<br/>
      Transforming Futures with AI Innovation
    </h1>
    <p style="text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);" class="text-white font-ubuntu text-lg md:text-xl lg:text-3xl !leading-loose my-4 md:my-6 lg:my-10">
      Empowering young minds with cutting edge AI, STEM, Robotics and Electronics education, enabling them to innovate and lead in a technology-driven world.
    </p>
    <a href="/#solution" class="px-4 py-2 md:px-5 md:py-3 mt-2 font-ubuntu font-medium text-lg md:text-xl lg:text-2xl z-10 w-fit text-white whitespace-nowrap rounded-full bg-gradient-to-l from-[#6504B0] to-[#C961DE]">
      Unleash Potential
    </a>
  </div>
</div>