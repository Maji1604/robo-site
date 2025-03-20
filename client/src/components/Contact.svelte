<script lang="ts">
  import * as Select from "$lib/components/ui/select";
  import chatimg from "$lib/images/chat.png";
  import Icon from "@iconify/svelte";
  import map from "$lib/images/map.png";
  import { toast } from "svelte-sonner";

  // Track the selected values for the custom select (multiple)
  let selectedServices: string[] = [];

  // Track form submission state
  let isSubmitting = false;

  // Function to handle form submission
  async function handleSubmit(event: { preventDefault: () => void; target: HTMLFormElement | undefined; }) {
    event.preventDefault();

    // Disable the form and show loading state
    isSubmitting = true;

    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());

    // Validate required fields
    if (!formValues.name || !formValues.email || !formValues.mobile || selectedServices.length === 0) {
      toast.error("Please fill out all required fields.");
      isSubmitting = false;
      return;
    }

    const payload = {
      service_id: 'service_d1pb0w7',
      template_id: 'template_5eda1rn',
      user_id: 'CdswteZ6BTKu2ZOE3',
      template_params: {
        name: formValues.name,
        email: formValues.email,
        mobile: formValues.mobile,
        interestedServices: selectedServices.join(", "), // Convert array to string
        message: formValues.message || 'N/A',
      },
    };

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (response.ok) {
        toast.success('Your message has been sent successfully!');
        // Reset the form after successful submission
        event.target.reset();
        selectedServices = []; // Reset the selected services
      } else {
        console.error('Server response:', responseText);
        toast.error(`Failed to send email. Status: ${response.status}. Please check console for details.`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('An error occurred while sending the email.');
    } finally {
      // Re-enable the form
      isSubmitting = false;
    }
  }

  // Function to open Google Maps in a new tab
  function openGoogleMaps() {
    window.open('https://maps.app.goo.gl/kUjsAFRMcU9PRVkM9?g_st=com.google.maps.preview.copy', '_blank');
  }
</script>

<div class="bg-gradient-to-br from-[#080A25] to-[#0a015a] p-4 sm:p-8 md:p-12 lg:p-20 text-white">
  <!-- Grid Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
    <!-- Left Column: Image -->
    <div class="flex justify-center items-center">
      <img src={chatimg} alt="Contact illustration" class="w-full" />
    </div>

    <!-- Middle Column: Contact Form -->
    <div class="space-y-6">
      <form class="space-y-6 pr-0 md:pr-8 lg:pr-20" on:submit={handleSubmit}>
        <h2 class="text-2xl sm:text-3xl font-bold">Book a Quick consultation with Us</h2>

        <!-- Name Field -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300">Name / Company Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={isSubmitting}
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-[#1A023E] text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
          />
        </div>

        <!-- Mobile Number Field -->
        <div>
          <label for="mobile" class="block text-sm font-medium text-gray-300">Mobile Number*</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            inputmode="numeric"
            pattern="\d*"
            maxlength="10"
            required
            disabled={isSubmitting}
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-[#1A023E] text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
          />
        </div>

        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300">Email Id*</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={isSubmitting}
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-[#1A023E] text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
          />
        </div>

        <!-- Interested Services Dropdown (Custom Select) -->
        <div>
          <label for="interestedServices" class="block text-sm font-medium text-gray-300">
            Interested Services*
          </label>
          <Select.Root type="multiple" bind:value={selectedServices} name="interestedServices" disabled={isSubmitting}>
            <Select.Trigger class="w-full mt-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-[#1A023E] text-white focus:outline-none focus:ring-0 disabled:opacity-50">
              {selectedServices.length > 0 ? selectedServices.join(", ") : "Select options"}
            </Select.Trigger>
            <Select.Content class="bg-[#1A023E] border border-gray-600 rounded-md shadow-sm text-white">
              <Select.Item value="Robotics Labs" class="px-8 py-2 hover:bg-[#2A045A]">Robotics Lab</Select.Item>
              <Select.Item value="STEM Lab" class="px-8 py-2 hover:bg-[#2A045A]">STEM Lab</Select.Item>
              <Select.Item value="ATAL Tinkering Lab" class="px-8 py-2 hover:bg-[#2A045A]">ATAL Tinkering Lab</Select.Item>
              <Select.Item value="Electronic Labs" class="px-8 py-2 hover:bg-[#2A045A]">Electronics Lab</Select.Item>
              <Select.Item value="Workshops" class="px-8 py-2 hover:bg-[#2A045A]">Workshop</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        <!-- Message Field (Optional) -->
        <div>
          <label for="message" class="block text-sm font-medium text-gray-300">Requirements</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            disabled={isSubmitting}
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-[#1A023E] text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
          ></textarea>
        </div>

        <!-- Submit Button with Gradient -->
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isSubmitting}
              
            <span class="flex flex-row gap-5 items-center justify-center">  Sending...
              <Icon icon="mdi:loading" class="animate-spin mr-2" width="20" height="20" /></span>
            {:else}
              Send message
            {/if}
          </button>
        </div>
      </form>
    </div>

    <!-- Right Column: Contact Info -->
    <div class="space-y-6">
      <h2 class="text-2xl sm:text-3xl font-bold">Get in Touch</h2>

      <div class="space-y-4">
        <p class="text-gray-300">
          Bringing the future of education to your institution! We're just a message away — let's discuss your needs!
        </p>

        <!-- Contact Details -->
        <div class="space-y-4">
          <p class="text-gray-300 flex items-center">
            <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span>+91 9047690808</span>
          </p>
          <p class="text-gray-300 flex items-center">
            <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>info@creoleap.com</span>
          </p>

          <div class="pt-2">
            <h3 class="text-xl font-semibold text-[#FF6B6B] mb-4">Follow Us</h3>
            <div class="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/creoleap/?viewAsMember=true"
                class="text-gray-300 hover:text-[#FF6B6B] transition-colors"
                aria-label="LinkedIn"
                target="_blank"
              >
                <Icon icon="mdi:linkedin" width="24" height="24" />
              </a>
              <a
                href="/"
                class="text-gray-300 hover:text-[#FF6B6B] transition-colors"
                aria-label="Instagram"
              >
                <Icon icon="mdi:instagram" width="24" height="24" />
              </a>
              <a
                href="/"
                class="text-gray-300 hover:text-[#FF6B6B] transition-colors"
                aria-label="WhatsApp"
              >
                <Icon icon="mdi:whatsapp" width="24" height="24" />
              </a>
            </div>
          </div>
          
          <!-- Google Map Section -->
          <div class="pt-6">
            <h3 class="text-xl font-semibold mb-4">Visit Us</h3>
            <div class="mt-4 relative">
              <div class="w-full h-64 rounded-lg overflow-hidden cursor-pointer" on:click={openGoogleMaps}>
                <!-- Location Icon Overlay -->
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-30 transition-all">
                  <div class="text-center">
                    <Icon icon="mdi:map-marker" width="40" height="40" class="text-[#FF6B6B] mx-auto" />
                    <p class="text-white font-semibold mt-2">Click to view on Google Maps</p>
                  </div>
                </div>
                <!-- Map placeholder -->
                <img 
                  src={map} 
                  alt="Location Map"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  [role="option"][data-state="checked"]::after {
    content: none !important;
  }
</style>