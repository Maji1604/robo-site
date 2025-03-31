<!-- CareersPage.svelte -->
<script>
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import Footer_2 from '../../components/Footer_2.svelte';
  import { toast } from 'svelte-sonner';
  import * as Select from "$lib/components/ui/select";


  // Job positions data with sales roles in TN and Kerala, adjusted for Creoleap
  /**
   * @type {any[]}
   */
  const positions = [
    // {
    //   id: 1,
    //   title: "Sales Manager - Tech Solutions",
    //   type: "Full-time",
    //   location: "Nashville, TN",
    //   department: "Sales",
    //   description:
    //     "Lead sales initiatives for Creoleap’s tech solutions in the Tennessee region, targeting businesses and enterprises.",
    //   requirements: [
    //     "5+ years in sales leadership",
    //     "Experience in tech sales",
    //     "Strong negotiation skills",
    //   ],
    // },
    // {
    //   id: 2,
    //   title: "Sales Representative",
    //   type: "Full-time",
    //   location: "Memphis, TN",
    //   department: "Sales",
    //   description:
    //     "Drive sales of Creoleap’s software and AI solutions to clients in Memphis, building strong relationships.",
    //   requirements: [
    //     "2+ years in sales",
    //     "Knowledge of tech industry trends",
    //     "Excellent communication skills",
    //   ],
    // },
    // {
    //   id: 3,
    //   title: "Business Development Executive",
    //   type: "Full-time",
    //   location: "Knoxville, TN",
    //   department: "Sales",
    //   description:
    //     "Identify and develop new business opportunities for Creoleap’s tech solutions in Knoxville.",
    //   requirements: [
    //     "3+ years in business development",
    //     "Tech industry experience",
    //     "Proven sales track record",
    //   ],
    // },
    // {
    //   id: 4,
    //   title: "Sales Manager - South India",
    //   type: "Full-time",
    //   location: "Kochi, Kerala",
    //   department: "Sales",
    //   description:
    //     "Oversee sales operations in Kerala, focusing on expanding Creoleap’s presence in the tech sector.",
    //   requirements: [
    //     "5+ years in sales management",
    //     "Fluency in Malayalam",
    //     "Experience in tech sales",
    //   ],
    // },
    // {
    //   id: 5,
    //   title: "Sales Representative",
    //   type: "Full-time",
    //   location: "Thiruvananthapuram, Kerala",
    //   department: "Sales",
    //   description:
    //     "Promote and sell Creoleap’s tech solutions to businesses and startups in Thiruvananthapuram.",
    //   requirements: [
    //     "2+ years in sales",
    //     "Knowledge of local tech market",
    //     "Strong interpersonal skills",
    //   ],
    // },
    // {
    //   id: 6,
    //   title: "Business Development Executive",
    //   type: "Full-time",
    //   location: "Kozhikode, Kerala",
    //   department: "Sales",
    //   description:
    //     "Expand Creoleap’s market reach in Kozhikode by identifying new sales opportunities in the tech sector.",
    //   requirements: [
    //     "3+ years in business development",
    //     "Tech sales experience",
    //     "Ability to travel within Kerala",
    //   ],
    // },
    // {
    //   id: 7,
    //   title: "Software Engineer",
    //   type: "Full-time",
    //   location: "San Francisco, CA",
    //   department: "Engineering",
    //   description:
    //     "Design and develop scalable software solutions for Creoleap’s clients using modern tech stacks.",
    //   requirements: [
    //     "BS in Computer Science",
    //     "3+ years in software development",
    //     "Proficiency in JavaScript/Python",
    //   ],
    // },
    // {
    //   id: 8,
    //   title: "AI Specialist",
    //   type: "Full-time",
    //   location: "Remote",
    //   department: "Engineering",
    //   description:
    //     "Develop and implement AI models to enhance Creoleap’s product offerings.",
    //   requirements: [
    //     "MS in AI/ML or related field",
    //     "Experience with TensorFlow/PyTorch",
    //     "Strong problem-solving skills",
    //   ],
    // },
  ];
  const qualifications = [
    { value: "Bachelor's Degree", label: "Bachelor's Degree" },
    { value: "Master's Degree", label: "Master's Degree" },
    { value: 'Other', label: 'Other' },
  ];
  let selectedQualification = '';
  let isCTASubmitting = false;
  /**
   * @type {File|null}
   */
  let resumeFile = null;

  /**
   * @param {{ target: any; }} event
   */
  function handleFileChange(event) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Validate file type (PDF only)
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file.');
        input.value = ''; // Reset the input
        resumeFile = null;
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB.');
        input.value = ''; // Reset the input
        resumeFile = null;
        return;
      }
      resumeFile = file;
    }
  }

  // Convert file to Base64
  /**
	 * @param {Blob} file
	 */
  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // Remove the data URL prefix
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  /**
	 * @param {{ preventDefault: () => void; target: any; }} event
	 */
// In CareersPage.svelte, update the handleCTASubmit function
async function handleCTASubmit(event) {
  console.log('clicked')
  event.preventDefault();

  isCTASubmitting = true;
  const form = event.target;
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData.entries());

  // Validate required fields
  if (
    !formValues.firstName ||
    !formValues.lastName ||
    !formValues.mobile ||
    !formValues.email ||
    !selectedQualification ||
    !resumeFile
  ) {
    toast.error('Please fill out all required fields.');
    isCTASubmitting = false;
    return;
  }

  try {
    // Convert the resume file to Base64
    const resumeBase64 = await fileToBase64(resumeFile);

    // Prepare the payload for the serverless function
    const payload = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      mobile: formValues.mobile,
      email: formValues.email,
      education: selectedQualification,
      message: formValues.message || 'N/A',
      resumeBase64: resumeBase64,
    };

    // Send the data to the serverless function
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      toast.success('Your application has been submitted successfully!');
      form.reset();
      resumeFile = null;
      selectedQualification = '';
    } else {
      console.error('Server response:', result);
      toast.error(result.error || 'Failed to send application. Please try again.');
    }
  } catch (error) {
    console.error('Error sending application:', error);
    toast.error('An error occurred while submitting your application.');
  } finally {
    isCTASubmitting = false;
  }
}

  // Testimonials data
  const testimonials = [
    {
      name: "Vikram S.",
      role: "Software Developer",
      quote:
        "Creoleap fosters a culture of innovation and teamwork that I’ve never experienced elsewhere.",
      avatar: "/images/avatars/vikram.jpg",
    },
    {
      name: "Lakshmi N.",
      role: "Data Scientist",
      quote:
        "Working here feels like being part of a movement to shape the future of technology.",
      avatar: "/images/avatars/lakshmi.jpg",
    },
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
    cta: false,
  };

  // Filters state
  let selectedDepartment = 'All';
  let selectedLocation = 'All';
  const departments = ['All', 'Sales & Marketing', 'Learning & Development','Administration'];
  const locations = [
    'All',
    'Onsite',
    'Remote',
  ];

  // Reactive filtered positions
  $: filteredPositions = positions.filter((position) => {
    const matchesDepartment =
      selectedDepartment === 'All' || position.department === selectedDepartment;
    const matchesLocation =
      selectedLocation === 'All' || position.location === selectedLocation;
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
      { id: 'cta', key: 'cta' },
    ];

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                visibleSections[section.key] = true;
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.2 }
        );
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
  <title>Careers at Creoleap Technologies | Opportunities</title>
  <meta
    name="description"
    content="Join Creoleap Technologies to drive sales in Tennessee and Kerala, delivering innovative tech solutions to clients worldwide. Explore opportunities today!"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Inter:wght@400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="min-h-screen lg:mt-20 mt-14 bg-white text-gray-900 font-sans">
  <!-- Hero Section with Tech-Focused Image Background -->
  <section
    class="relative overflow-hidden h-[600px] bg-cover lg:bg-center bg-right bg-no-repeat"
    style="background-image: url('/career.jpg');"
    aria-label="Team collaborating on tech innovation"
  >
    <div class="absolute inset-0 bg-gradient-to-tr from-black/40 to-blue-950/80"></div>
    <div class="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center relative z-10">
      {#if visibleSections.hero}
        <div class="text-center text-white" in:fly={{ y: 50, duration: 800 }}>
          <h1
            class="lg:text-5xl  md:text-3xl text-2xl font-bold tracking-normal mb-6 font-heading drop-shadow-lg"
          >
            Join Creoleap to Drive Tech Innovation
          </h1>
          <p class="md:text-xl !font-Ubuntu text-lg max-w-3xl mx-auto mb-8 drop-shadow-md">
            Explore exciting opportunities to deliver cutting-edge tech solutions to
            clients worldwide.
          </p>
          <a
            href="#positions"
            class="inline-flex !font-Ubuntu items-center px-8 py-3 bg-gradient-to-l from-[#6504B0] to-[#C961DE] text-white font-medium rounded-full shadow-lg hover:bg-teal-600 transition-all duration-300"
          >
            Browse Openings
          </a>
        </div>
      {/if}
    </div>
  </section>

  <!-- Why Creoleap? -->
  <section id="why" class="lg:py-24 md:py-16 py-10 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      {#if visibleSections.why}
        <div class="text-center mb-16 W" in:fade>
          <h2
            class="lg:text-4xl text-2xl font-bold mb-4 font-heading relative inline-block pb-2"
          >
            Why Creoleap?
            <span
              class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#6504b0] to-[#008080 Angledown
              rounded-full"
            ></span>
          </h2>
          <p class="text-xl !font-Ubuntu text-gray-600 max-w-3xl mx-auto">
            Discover what makes Creoleap Technologies a great place to grow your
            career in technology and innovation.
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
              <h3 class="text-xl font-semibold text-gray-900 mb-2 font-heading">
                {reason.title}
              </h3>
              <p class="text-gray-600 mb-4 !font-Ubuntu">{reason.desc}</p>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <!-- Mission Section with Mission Statement and CCC Cards -->
  <section id="mission" class="!font-Ubuntu lg:py-24 md:py-16 py-10">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      {#if visibleSections.mission}
        <div class="text-center lg:mb-16 md:mb-10 mb-2" in:fade>
          <h2
            class="lg:text-4xl text-2xl font-bold mb-4 font-heading relative inline-block pb-2"
          >
            Our Mission
            <!-- Gradient Underline -->
            <span
              class="absolute  bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#6504b0] to-[#008080] rounded-full"
            ></span>
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center">
          <p
            class="text-xl !font-Ubuntu text-gray-600 max-w-3xl mx-auto relative flex text-center items-center justify-center gap-3"
          >
            We equip educators and students with cutting-edge tools and experiential
            learning, bridging theory and practice to drive innovation and real-world
            problem-solving.
          </p>
          <!-- Right Side: CCC Cards -->
          <div
            class="grid grid-cols-1 sm:grid-cols-3 lg:gap-6 gap-3 !font-Ubuntu"
            in:fly={{ x: 50, duration: 800, delay: 200 }}
          >
            <!-- Curiosity Card -->
            <div
              class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col items-center py-6 px-4 transition-all duration-500 hover:translate-y-[-10px] border-b-4 border-[#FF4500]"
            >
              <div
                class="w-16 h-16 rounded-full bg-[#ffefe9] flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110"
              >
                <Icon icon="mdi:brain" class="text-[#FF4500]" width="40" height="40" />
              </div>
              <p class="text-center !font-Ubuntu font-bold text-[#0a015a]">Curiosity</p>
              <div class="w-10 h-1 bg-[#FF4500] mt-3 rounded-full"></div>
            </div>

            <!-- Creativity Card -->
            <div
              class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col items-center py-6 px-4 transition-all duration-500 hover:translate-y-[-10px] border-b-4 border-[#008080]"
            >
              <div
                class="w-16 h-16 rounded-full bg-[#e6f7f7] flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110"
              >
                <Icon
                  icon="mdi:lightbulb-on-outline"
                  class="text-[#008080]"
                  width="40"
                  height="40"
                />
              </div>
              <p class="text-center font-bold text-[#0a015a] !font-Ubuntu">Creativity</p>
              <div class="w-10 h-1 bg-[#008080] mt-3 rounded-full"></div>
            </div>

            <!-- Critical Thinking Card -->
            <div
              class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col items-center py-6 px-4 transition-all duration-500 hover:translate-y-[-10px] border-b-4 border-[#483D8B]"
            >
              <div
                class="w-16 h-16 rounded-full bg-[#eeecf7] flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110"
              >
                <Icon
                  icon="mdi:head-cog-outline"
                  class="text-[#483D8B]"
                  width="40"
                  height="40"
                />
              </div>
              <p class="text-center font-bold text-[#0a015a] !font-Ubuntu">Critical Thinking</p>
              <div class="w-10 h-1 bg-[#483D8B] mt-3 rounded-full"></div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </section>

  <!-- Combined Open Positions and CTA Section -->
  <div class="!font-Ubuntu  mx-auto px-6 lg:px-20 lg:py-24 md:py-16 py-0">
    <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 md:gap-8 gap-6">
      <!-- Open Positions -->
      <section id="positions" class="rounded-2xl h-fit p-8">
        {#if visibleSections.positions}
          <div class="text-center lg:mb-12 md:mb-8 mb-5" in:fade>
            <h2
              class="lg:text-4xl text-2xl font-bold mb-4 font-heading inline-block relative pb-2"
            >
              Open Positions
              <span
                class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#6504b0] to-[#008080] rounded-full"
              ></span>
            </h2>
          </div>

          <!-- Filters -->
          <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Select.Root bind:value={selectedDepartment} type="single">
              <Select.Trigger placeholder='Department' class="w-[220px]">
                {selectedDepartment}
              </Select.Trigger>
              <Select.Content>
                {#each departments as dept}
                <Select.Item value={dept} label={dept}>{dept}</Select.Item>
              {/each}
              </Select.Content>
            </Select.Root>
            <Select.Root bind:value={selectedLocation} type="single">
              <Select.Trigger placeholder='Location' class="w-[180px]">
                {selectedLocation}
              </Select.Trigger>
              <Select.Content>
                {#each locations as loc}
                <Select.Item value={loc} label={loc}>{loc}</Select.Item>
              {/each}
              </Select.Content>
            </Select.Root>
            
          </div>

          <div class="space-y-6">
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
                    <h3
                      class="text-xl font-semibold text-gray-900 font-heading"
                    >
                      {position.title}
                    </h3>
                    <div class="flex flex-wrap gap-3 mt-2">
                      <span
                        class="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {position.type}
                      </span>
                      <span class="text-gray-600 text-sm flex items-center">
                        <Icon
                          icon="mdi:map-marker"
                          class="mr-1"
                          width="16"
                          height="16"
                        />
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
                      <h4
                        class="font-medium text-gray-900 mb-2 font-heading"
                      >
                        Position Description
                      </h4>
                      <p class="text-gray-600">{position.description}</p>
                    </div>

                    <div class="mb-6">
                      <h4
                        class="font-medium text-gray-900 mb-2 font-heading"
                      >
                        Requirements
                      </h4>
                      <ul class="list-disc pl-5 space-y-1 text-gray-600">
                        {#each position.requirements as req}
                          <li>{req}</li>
                        {/each}
                      </ul>
                    </div>

                    <a
                      href={`/careers/apply/${position.title
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
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
      </section>

      <!-- Talent Network CTA -->
      <section id="cta" class="bg-gradient-to-tl h-fit from-blue-50 to-purple-50 rounded-2xl p-8">
        {#if visibleSections.cta}
          <div
            class="relative overflow-hidden"
            in:fly={{ y: 50, duration: 800 }}
          >
            <div
              class="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full transform translate-x-1/2 -translate-y-1/3"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full transform -translate-x-1/3 translate-y-1/3"
            ></div>

            <div class="relative z-10 text-center">
              <h2
                class="lg:text-4xl text-2xl font-bold text-gray-900 mb-4 font-heading"
              >
                Join Our Creoleap Team
              </h2>
              <p class="lg:text-xl !font-Ubuntu text-base text-gray-600 max-w-3xl mx-auto mb-8">
                Not seeing the perfect role? We're always looking for exceptional
                talent to join our mission.
              </p>

              <!-- Updated Form -->
              <form
                on:submit|preventDefault={handleCTASubmit}
                class="space-y-6 !font-Ubuntu"
                enctype="multipart/form-data"
              >
                <!-- First Name and Last Name -->
                <div class="grid grid-cols-1 !font-Ubuntu sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="firstName"
                      class="block text-sm font-medium text-gray-700"
                    >
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      disabled={isCTASubmitting}
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      for="lastName"
                      class="block text-sm  !font-Ubuntu font-medium text-gray-700"
                    >
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      disabled={isCTASubmitting}
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <!-- Mobile Number and Email -->
                <div class="grid grid-cols-1 !font-Ubuntu sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="mobile"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Mobile Number*
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      inputmode="numeric"
                      pattern="\d*"
                      maxlength="10"
                      required
                      disabled={isCTASubmitting}
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      for="email"
                      class="block text-sm !font-Ubuntu font-medium text-gray-700"
                    >
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      disabled={isCTASubmitting}
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <!-- Educational Qualification -->
                <div>
                  <label
                    for="education"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Educational Qualification*
                  </label>
                  <Select.Root
                    bind:value={selectedQualification}
                    type="single"
                    disabled={isCTASubmitting}
                  >
                    <Select.Trigger
                      class="mt-1  w-full  border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-0 focus:ring-purple-500 disabled:opacity-50"
                      placeholder="Select your qualification"
                    >
                      {selectedQualification || 'Select your qualification'}
                    </Select.Trigger>
                    <Select.Content>
                      {#each qualifications as qualification}
                        <Select.Item
                          value={qualification.value}
                          disabled={isCTASubmitting}
                          class=" hover:bg-gray-100 cursor-pointer"
                        >
                          {qualification.label}
                        </Select.Item>
                      {/each}
                    </Select.Content>
                  </Select.Root>
                </div>

                <!-- Resume Upload -->
                <div>
                  <label
                    for="resume"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Upload Resume (PDF only, max 5MB)*
                  </label>
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf"
                    required
                    disabled={isCTASubmitting}
                    on:change={handleFileChange}
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  />
                </div>

                <!-- Message (Optional) -->
                <div>
                  <label
                    for="message"
                    class="block !font-Ubuntu text-sm font-medium text-gray-700"
                  >
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    disabled={isCTASubmitting}
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <div>
                  <button
                    type="submit"
                    disabled={isCTASubmitting}
                    class="w-full !font-Ubuntu bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {#if isCTASubmitting}
                      <span
                        class="flex flex-row gap-5 items-center justify-center"
                      >
                        Submitting...
                        <Icon
                          icon="mdi:loading"
                          class="animate-spin mr-2"
                          width="20"
                          height="20"
                        />
                      </span>
                    {:else}
                      Submit Application
                    {/if}
                  </button>
                </div>
              </form>

              <!-- Social Links -->
              <div class="mt-10 !font-Ubuntu">
                <p class="text-gray-600 !font-Ubuntu mb-4">Follow our journey</p>
                <div class="flex justify-center gap-6">
                  {#each [
                    { icon: "LinkedIn", svg: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" }
                  ] as social}
                    <a
                      href="/"
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
      </section>
    </div>
  </div>
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
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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


