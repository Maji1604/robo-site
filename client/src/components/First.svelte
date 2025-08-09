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
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
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
    width: 90%;
    max-width: 1200px;
    padding: 2vh;
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

  .content h1 {
    font-size: clamp(1.5rem, 4vw, 5rem);
    margin-bottom: 1vh;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  }

  .content p {
    font-size: clamp(1rem, 2vw, 2rem);
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
    margin-bottom: 2vh;
  }

  .content a {
    font-size: clamp(1rem, 2vw, 1.5rem);
    padding: 1vh 2vw;
  }

  @media (max-width: 640px) {
    .hero {
      height: 90vh;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .content {
      width: 95%;
    }
  }
</style>

<div class="hero">
  <video preload="metadata" autoplay loop muted playsinline>
    <source src='/video/elec.webm' type="video/webm" />
    <!-- <source src='/video/elec.mp4' type="video/mp4" /> -->

    Your browser does not support the video tag.
  </video>
  <div class="overlay"></div>

  <div class="content z-10 w-full px-4 md:w-3/4 lg:w-3/4">
    <h1 class="text-white w-full !font-ubuntu font-extrabold !leading-normal">
      Empowering Minds,<br/>
      Transforming Futures with AI Innovation
    </h1>
    <p class="text-white !font-ubuntu !leading-loose my-4 md:my-6 lg:my-10">
      Empowering young minds with cutting edge AI, STEM, Robotics and Electronics education, enabling them to innovate and lead in a technology-driven world.
    </p>
    <a href="/#solution" class="px-4 py-2 md:px-5 md:py-3 mt-2 !font-ubuntu font-medium z-10 w-fit text-white whitespace-nowrap rounded-full bg-gradient-to-l from-[#6504B0] to-[#C961DE]">
      Unleash Potential
    </a>
  </div>
</div>
