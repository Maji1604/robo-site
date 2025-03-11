<script>
    import chatimg from "$lib/images/chat.png"
</script>

<div class="bg-gradient-to-br from-[#080A25] to-[#0a015a] p-20 text-white">
  <!-- Grid Layout --> 
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Left Column: Contact Info -->
    <div class=" space-y-6">
        <img src={chatimg} alt="" class="w-3/4">
    </div>
    <div class="space-y-6">
        <!-- Image Placeholder -->
    
  
        <!-- Contact Form -->
        <form class="space-y-6 pr-20">
      <h2 class="text-3xl font-bold">Send me a message</h2>

          <!-- Name Field -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-[#1A023E] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-[#1A023E] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <!-- Message Field -->
          <div>
            <label for="message" class="block text-sm font-medium text-gray-300">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-[#1A023E] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
  
          <!-- Submit Button with Gradient -->
          <div>
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send message
            </button>
          </div>
        </form>
      </div>
    <div class="space-y-6">
      <h2 class="text-3xl font-bold">Get in Touch</h2>

      <div class="space-y-4">
        <!-- <h3 class="text-xl font-semibold">Get in touch</h3> -->
        <p class="text-gray-300">
          I’m very approachable and would love to speak to you. Feel free to call, send me an email, follow me on social media, or simply complete the enquiry form.
        </p>

        <!-- Contact Details -->
        <div class="space-y-2">
          <p class="text-gray-300 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
     +91 9047690808
          </p>
          <p class="text-gray-300 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
           info@creoleap.com
          </p>
          <div class="text-center sm:text-left transition-transform transform hover:scale-105">
            <h3 class="text-xl font-semibold text-[#FF6B6B] mb-4">Follow Us</h3>
            <div class="flex justify-center sm:justify-start space-x-4">
                <a href="https://twitter.com/creoleap" class="text-gray-300 hover:text-[#FF6B6B] transition-colors">
                    <!-- Twitter Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.46 5.63c-.8.36-1.66.6-2.56.71.92-.55 1.63-1.42 1.96-2.46-.86.51-1.81.88-2.83 1.08-.81-.86-1.97-1.4-3.25-1.4-2.46 0-4.45 2-4.45 4.45 0 .35.04.69.12 1.01-3.7-.19-6.98-1.96-9.18-4.66-.38.66-.6 1.43-.6 2.25 0 1.55.79 2.91 1.99 3.71-.73-.02-1.42-.22-2.02-.55v.06c0 2.16 1.53 3.96 3.56 4.37-.37.1-.76.15-1.16.15-.28 0-.56-.03-.83-.08.56 1.78 2.2 3.08 4.14 3.12-1.52 1.19-3.43 1.9-5.51 1.9-.36 0-.71-.02-1.06-.06 1.97 1.26 4.3 2 6.81 2 8.17 0 12.64-6.77 12.64-12.64 0-.19 0-.38-.01-.57.87-.63 1.62-1.42 2.22-2.32z" />
                    </svg>
                </a>
                <a href="https://linkedin.com/company/creoleap" class="text-gray-300 hover:text-[#FF6B6B] transition-colors">
                    <!-- LinkedIn Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                </a>
                <a href="https://github.com/creoleap" class="text-gray-300 hover:text-[#FF6B6B] transition-colors">
                    <!-- GitHub Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                </a>
                <a href="https://instagram.com/creoleap" class="text-gray-300 hover:text-[#FF6B6B] transition-colors">
                    <!-- Instagram Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                </a>
            </div>
        </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Contact Form and Image Placeholder -->
  
  </div>
</div>