<script>
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import Icon from '@iconify/svelte';
	import Footer_2 from '../../components/Footer_2.svelte';


    // Job positions data with sales roles in TN and Kerala, adjusted for Creoleap
    const positions = [
    //   {
    //     id: 1,
    //     title: "Sales Manager - Tech Solutions",
    //     type: "Full-time",
    //     location: "Nashville, TN",
    //     department: "Sales",
    //     description: "Lead sales initiatives for Creoleap’s tech solutions in the Tennessee region, targeting businesses and enterprises.",
    //     requirements: ["5+ years in sales leadership", "Experience in tech sales", "Strong negotiation skills"]
    //   },
    //   {
    //     id: 2,
    //     title: "Sales Representative",
    //     type: "Full-time",
    //     location: "Memphis, TN",
    //     department: "Sales",
    //     description: "Drive sales of Creoleap’s software and AI solutions to clients in Memphis, building strong relationships.",
    //     requirements: ["2+ years in sales", "Knowledge of tech industry trends", "Excellent communication skills"]
    //   },
    //   {
    //     id: 3,
    //     title: "Business Development Executive",
    //     type: "Full-time",
    //     location: "Knoxville, TN",
    //     department: "Sales",
    //     description: "Identify and develop new business opportunities for Creoleap’s tech solutions in Knoxville.",
    //     requirements: ["3+ years in business development", "Tech industry experience", "Proven sales track record"]
    //   },
    //   {
    //     id: 4,
    //     title: "Sales Manager - South India",
    //     type: "Full-time",
    //     location: "Kochi, Kerala",
    //     department: "Sales",
    //     description: "Oversee sales operations in Kerala, focusing on expanding Creoleap’s presence in the tech sector.",
    //     requirements: ["5+ years in sales management", "Fluency in Malayalam", "Experience in tech sales"]
    //   },
    //   {
    //     id: 5,
    //     title: "Sales Representative",
    //     type: "Full-time",
    //     location: "Thiruvananthapuram, Kerala",
    //     department: "Sales",
    //     description: "Promote and sell Creoleap’s tech solutions to businesses and startups in Thiruvananthapuram.",
    //     requirements: ["2+ years in sales", "Knowledge of local tech market", "Strong interpersonal skills"]
    //   },
    //   {
    //     id: 6,
    //     title: "Business Development Executive",
    //     type: "Full-time",
    //     location: "Kozhikode, Kerala",
    //     department: "Sales",
    //     description: "Expand Creoleap’s market reach in Kozhikode by identifying new sales opportunities in the tech sector.",
    //     requirements: ["3+ years in business development", "Tech sales experience", "Ability to travel within Kerala"]
    //   },
    //   {
    //     id: 7,
    //     title: "Software Engineer",
    //     type: "Full-time",
    //     location: "San Francisco, CA",
    //     department: "Engineering",
    //     description: "Design and develop scalable software solutions for Creoleap’s clients using modern tech stacks.",
    //     requirements: ["BS in Computer Science", "3+ years in software development", "Proficiency in JavaScript/Python"]
    //   },
    //   {
    //     id: 8,
    //     title: "AI Specialist",
    //     type: "Full-time",
    //     location: "Remote",
    //     department: "Engineering",
    //     description: "Develop and implement AI models to enhance Creoleap’s product offerings.",
    //     requirements: ["MS in AI/ML or related field", "Experience with TensorFlow/PyTorch", "Strong problem-solving skills"]
    //   }
    ];

    // Perks data adjusted for Creoleap
    const perks = [
      { icon: "mdi:brain", color: "#60A5FA", title: "Innovation-Driven", description: "Work on cutting-edge tech projects that push boundaries." },
      { icon: "mdi:earth", color: "#C084FC", title: "Global Reach", description: "Your work will impact clients worldwide." },
      { icon: "mdi:code-tags", color: "#6EE7B7", title: "Modern Tech Stack", description: "Access to the latest tools and technologies." },
      { icon: "mdi:rocket-launch", color: "#FF8787", title: "Career Growth", description: "Opportunities for learning and advancement." }
    ];

    // Team spotlight data adjusted for Creoleap
    const teamMembers = [
      { name: "Dr. Priya Sharma", role: "Lead AI Engineer", image: "/images/team/priya.jpg", quote: "I love building AI solutions that solve real-world problems!" },
      { name: "Rahul Menon", role: "Senior Software Engineer", image: "/images/team/rahul.jpg", quote: "Developing scalable tech at Creoleap is incredibly rewarding." },
      { name: "Anita Rao", role: "Product Manager", image: "/images/team/anita.jpg", quote: "I’m passionate about delivering innovative tech to our clients." }
    ];

    // Testimonials data
    const testimonials = [
      { name: "Vikram S.", role: "Software Developer", quote: "Creoleap fosters a culture of innovation and teamwork that I’ve never experienced elsewhere.", avatar: "/images/avatars/vikram.jpg" },
      { name: "Lakshmi N.", role: "Data Scientist", quote: "Working here feels like being part of a movement to shape the future of technology.", avatar: "/images/avatars/lakshmi.jpg" }
    ];

    // State management
    /**
     * @type {number | null}
     */
    let expandedCard = null;
    let email = "";
    let currentTestimonial = 0;
    let visible = false;
    let visibleSections = {
      hero: false,
      why: false,
      mission: false,
      positions: false,
      culture: false,
      team: false,
      testimonials: false,
      process: false,
      cta: false
    };

    // Filters state
    let selectedDepartment = 'All';
    let selectedLocation = 'All';
    const departments = ['All', 'Sales', 'Engineering'];
    const locations = ['All', 'Nashville, TN', 'Memphis, TN', 'Knoxville, TN', 'Kochi, Kerala', 'Thiruvananthapuram, Kerala', 'Kozhikode, Kerala', 'San Francisco, CA', 'Remote'];

    // Reactive filtered positions
    $: filteredPositions = positions.filter(position => {
      const matchesDepartment = selectedDepartment === 'All' || position.department === selectedDepartment;
      const matchesLocation = selectedLocation === 'All' || position.location === selectedLocation;
      return matchesDepartment && matchesLocation;
    });

    /**
     * @param {number} id
     */
    function toggleCard(id) {
      expandedCard = expandedCard === id ? null : id;
    }

    /**
     * @param {{ preventDefault: () => void; }} e
     */
    function handleSubmit(e) {
      e.preventDefault();
      alert(`Thank you! We'll contact you at ${email} about future opportunities.`);
      email = "";
    }

    // Intersection Observer for animations
    onMount(() => {
      setTimeout(() => {
        visible = true;
        visibleSections.hero = true;
      }, 200);

      const sections = [
        { id: 'why', key: 'why' },
        { id: 'mission', key: 'mission' },
        { id: 'positions', key: 'positions' },
        { id: 'culture', key: 'culture' },
        { id: 'team', key: 'team' },
        { id: 'testimonials', key: 'testimonials' },
        { id: 'process', key: 'process' },
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

      // Auto-rotate testimonials
      const interval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      }, 5000);
      return () => clearInterval(interval);
    });
</script>

<svelte:head>
  <title>Careers at Creoleap Technologies | Opportunities </title>
  <meta name="description" content="Join Creoleap Technologies to drive sales in Tennessee and Kerala, delivering innovative tech solutions to clients worldwide. Explore opportunities today!">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen pt-20 bg-white text-gray-900 font-sans">
  <!-- Hero Section with Tech-Focused Image Background -->
  <section class="relative overflow-hidden h-[600px] bg-cover bg-center bg-no-repeat" style="background-image: url('/careers.jpg');" aria-label="Team collaborating on tech innovation">
    <div class="absolute inset-0 bg-gradient-to-tr from-black/40 to-blue-950/80"></div>
    <div class="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center relative z-10">
      {#if visibleSections.hero}
        <div class="text-center text-white" in:fly={{ y: 50, duration: 800 }}>
          <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-6 font-heading drop-shadow-lg">
            Join Creoleap to Drive Tech Innovation
          </h1>
          <p class="text-xl max-w-3xl mx-auto mb-8 drop-shadow-md">
            Explore exciting opportunities to deliver cutting-edge tech solutions to clients worldwide.
          </p>
          <a 
            href="#positions" 
            class="inline-flex items-center px-8 py-3 bg-teal-500 text-white font-medium rounded-full shadow-lg hover:bg-teal-600 transition-all duration-300"
          >
            Browse Openings
          </a>
        </div>
      {/if}
    </div>
  </section>

  <!-- Why Creoleap? -->
  <section id="why" class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      {#if visibleSections.why}
        <div class="text-center mb-16" in:fade>
          <h2 class="text-4xl font-bold mb-4 font-heading relative inline-block pb-2">
            Why Creoleap?
            <span class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#6504b0] to-[#008080] rounded-full"></span>

          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover what makes Creoleap Technologies a great place to grow your career in technology and innovation.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          {#each [
            { title: "Innovate Every Day", desc: "Work on cutting-edge tech projects that solve real-world problems.", icon: "mdi:lightbulb" },
            { title: "Make an Impact", desc: "Deliver solutions that transform businesses globally.", icon: "mdi:earth" },
            { title: "Grow Your Career", desc: "Access mentorship and opportunities to advance in tech.", icon: "mdi:rocket-launch" }
          ] as reason, i}
            <div 
              class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              in:fly={{ y: 50, duration: 500, delay: i * 100 }}
            >
              <div class="text-4xl mb-4 text-teal-500">
                <Icon icon={reason.icon} width="40" height="40" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2 font-heading">{reason.title}</h3>
              <p class="text-gray-600 mb-4">{reason.desc}</p>
              <!-- <a href="#culture" class="text-teal-500 hover:text-teal-600 font-medium flex items-center">
                Learn More <span class="ml-1">→</span>
              </a> -->
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </section>

 <!-- Mission Section with Mission Statement and CCC Cards -->
<section id="mission" class="py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      {#if visibleSections.mission}
        <div class="text-center mb-16" in:fade>
          <h2 class="text-4xl font-bold mb-4 font-heading relative inline-block pb-2">
            Our Mission
            <!-- Gradient Underline -->
            <span class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#6504b0] to-[#008080] rounded-full"></span>
          </h2>
         
        </div>
  
        <div class="grid md:grid-cols-2 gap-12 items-center">

            <p class="text-xl text-gray-600 max-w-3xl mx-auto relative flex text-center items-center justify-center gap-3">
                <!-- Decorative Icon -->
                <!-- <Icon icon="mdi:flag-outline" class="text-[#6504b0] text-center" width="28" height="28" /> -->
                We equip educators and students with cutting-edge tools and experiential learning, bridging theory and practice to drive innovation and real-world problem-solving.
              </p>
          <!-- Right Side: CCC Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6" in:fly={{ x: 50, duration: 800, delay: 200 }}>
            <!-- Curiosity Card -->
            <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col items-center py-6 px-4 transition-all duration-500 hover:translate-y-[-10px] border-b-4 border-[#FF4500]">
              <div class="w-16 h-16 rounded-full bg-[#ffefe9] flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110">
                <Icon icon="mdi:brain" class="text-[#FF4500]" width="40" height="40" />
              </div>
              <p class="text-center font-bold text-[#0a015a]">Curiosity</p>
              <div class="w-10 h-1 bg-[#FF4500] mt-3 rounded-full"></div>
            </div>
  
            <!-- Creativity Card -->
            <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col items-center py-6 px-4 transition-all duration-500 hover:translate-y-[-10px] border-b-4 border-[#008080]">
              <div class="w-16 h-16 rounded-full bg-[#e6f7f7] flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110">
                <Icon icon="mdi:lightbulb-on-outline" class="text-[#008080]" width="40" height="40" />
              </div>
              <p class="text-center font-bold text-[#0a015a]">Creativity</p>
              <div class="w-10 h-1 bg-[#008080] mt-3 rounded-full"></div>
            </div>
  
            <!-- Critical Thinking Card -->
            <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col items-center py-6 px-4 transition-all duration-500 hover:translate-y-[-10px] border-b-4 border-[#483D8B]">
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
  </section>

  <!-- Open Positions -->
  <section id="positions" class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      {#if visibleSections.positions}
        <div class="text-center mb-16" in:fade>
          <h2 class="text-4xl font-bold mb-4 font-heading inline-block relative pb-2">
            Open Positions
            <span class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#6504b0] to-[#008080] rounded-full"></span>

          </h2>
          <!-- <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our team in Tennessee, Kerala, and beyond to drive sales and innovation in technology.
          </p> -->
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <select 
            bind:value={selectedDepartment} 
            class="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {#each departments as dept}
              <option value={dept} class="bg-white">{dept}</option>
            {/each}
          </select>
          <select 
            bind:value={selectedLocation} 
            class="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {#each locations as loc}
              <option value={loc} class="bg-white">{loc}</option>
            {/each}
          </select>
        </div>

        <div class="space-y-6 max-w-3xl mx-auto">
          {#each filteredPositions as position (position.id)}
            <div 
              class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              in:scale={{ duration: 300 }}
            >
              <div 
                class="cursor-pointer flex justify-between items-start"
                on:click={() => toggleCard(position.id)}
                on:keydown={(e) => e.key === 'Enter' && toggleCard(position.id)}
                tabindex="0"
                role="button"
                aria-expanded={expandedCard === position.id}
              >
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 font-heading">{position.title}</h3>
                  <div class="flex flex-wrap gap-3 mt-2">
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      {position.type}
                    </span>
                    <span class="text-gray-600 text-sm flex items-center">
                      <Icon icon="mdi:map-marker" class="mr-1" width="16" height="16" />
                      {position.location}
                    </span>
                  </div>
                </div>
                <span class="text-2xl font-bold text-gray-400">
                  {expandedCard === position.id ? '−' : '+'}
                </span>
              </div>
              
              {#if expandedCard === position.id}
                <div class="pt-4 border-t border-gray-200 animate-fade-in">
                  <div class="mb-6">
                    <h4 class="font-medium text-gray-900 mb-2 font-heading">Position Description</h4>
                    <p class="text-gray-600">{position.description}</p>
                  </div>
                  
                  <div class="mb-6">
                    <h4 class="font-medium text-gray-900 mb-2 font-heading">Requirements</h4>
                    <ul class="list-disc pl-5 space-y-1 text-gray-600">
                      {#each position.requirements as req}
                        <li>{req}</li>
                      {/each}
                    </ul>
                  </div>
                  
                  <a 
                    href={`/careers/apply/${position.title.toLowerCase().replace(/\s+/g, '-')}`} 
                    class="text-teal-500 hover:text-teal-600 font-medium flex items-center"
                  >
                    Apply Now <span class="ml-1">→</span>
                  </a>
                </div>
              {/if}
            </div>
          {:else}
            <div class="text-center py-12 bg-white rounded-lg shadow-md">
              <p class="text-gray-600">No open positions!</p>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <!-- Talent Network CTA -->
  <!-- <section id="cta" class="py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      {#if visibleSections.cta}
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-tl from-blue-50 to-purple-50 p-12 shadow-lg" in:fly={{ y: 50, duration: 800 }}>
          <div class="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full transform translate-x-1/2 -translate-y-1/3"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div class="relative z-10 text-center">
            <h2 class="text-4xl font-bold text-gray-900 mb-4 font-heading">
              Join Our Creoleap Team
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Not seeing the perfect role? We're always looking for exceptional talent to join our mission.
            </p>
            
            <form on:submit|preventDefault={handleSubmit} class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                bind:value={email}
                placeholder="Your email address" 
                required
                class="flex-grow px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button 
                type="submit" 
                class="px-6 py-3 bg-teal-500 text-white font-medium rounded-lg shadow hover:bg-teal-600 transition-all"
              >
                Get Notified
              </button>
            </form>
            
            <div class="mt-10">
              <p class="text-gray-600 mb-4">Follow our journey</p>
              <div class="flex justify-center gap-6">
                {#each [
                  { icon: "LinkedIn", svg: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" },
                  { icon: "Twitter", svg: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
                  { icon: "GitHub", svg: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" }
                ] as social}
                  <a 
                    href="#" 
                    class="text-gray-600 hover:text-teal-500 transition-colors"
                    aria-label={social.icon}
                  >
                    <svg viewBox="0 0 24 24" class="h-6 w-6 fill-current">
                      <path d={social.svg} />
                    </svg>
                  </a>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </section> -->
</div>

<Footer_2 />

<style>
  :global(body) {
    font-family: 'Inter', sans-serif;
  }

  .font-heading {
    font-family: 'Montserrat', sans-serif;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }

  /* Ensure the hero section background image is responsive */
  @media (max-width: 768px) {
    section.h-\[600px\] {
      height: 400px;
    }

    h1.text-5xl {
      font-size: 2.5rem;
    }

    p.text-xl {
      font-size: 1rem;
    }
  }
</style>