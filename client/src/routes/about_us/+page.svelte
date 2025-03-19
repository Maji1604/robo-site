<script>
    import Footer_2 from "../../components/Footer_2.svelte";
    // Import icons from Iconify (you'll need to install @iconify/svelte)
    import Icon from '@iconify/svelte';
</script>

<section id="about" class="bg-white text-[#080A25] py-20 mt-20">
    <div class="mx-auto px-6 lg:px-20">
        
        <!-- Title and Intro -->
        <div class="text-center mb-16">
            <h2 class="text-5xl font-bold text-[#6504b0]">About Us</h2>
            <p class="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                At Creoleap Technologies, we are transforming education by integrating AI, Robotics, and STEM learning into a dynamic, NEP-aligned curriculum based on the CCC (Curiosity, Creativity, and Critical Thinking) Method. Our mission is to empower students and educators with innovative tools, fostering a culture of inquiry-driven, hands-on learning that prepares young minds for the future.
            </p>
        </div>

        <!-- Vision & Mission -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start container">
            <div>
                <h3 class="text-3xl font-semibold text-[#0a015a] mb-4 flex items-center">
                    <Icon icon="mdi:eye-outline" class="text-[#6504b0] mr-3" width="32" height="32" />
                    Our Vision
                </h3>
                <p class="text-lg text-gray-700 mb-6">
                    Creoleap Technologies envisions a world where every student has access to future-ready education driven by AI, Robotics, and STEM. We aim to transform traditional learning into an engaging, hands-on experience that nurtures curiosity, creativity, and critical thinking. By establishing innovation hubs and smart classrooms, we strive to create a dynamic ecosystem where students and educators collaborate to solve real-world challenges and drive technological advancements.
                </p>

                <h3 class="text-3xl font-semibold text-[#0a015a] mb-4 flex items-center">
                    <Icon icon="mdi:flag-outline" class="text-[#6504b0] mr-3" width="32" height="32" />
                    Our Mission
                </h3>
                <p class="text-lg text-gray-700 mb-6">
                    Our mission is to empower educators and students with cutting-edge tools and methodologies aligned with the National Education Policy (NEP). Through our CCC-based experiential learning approach, we bridge the gap between theory and application, fostering innovation and problem-solving skills. We are committed to providing high-quality resources, mentorship, and training programs that equip the next generation with the knowledge and confidence to thrive in an ever-evolving digital world.
                </p>
            </div>

            <div class="relative">
                <div class="rounded-xl overflow-hidden shadow-lg ">
                    <video autoplay loop muted playsinline width="100%" poster="/path/to/poster-image.jpg">
                        <source src="/video/child.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div class="mt-6 grid grid-cols-3 gap-4">
                    <div class="bg-[#f0f0f0] p-4 rounded-lg shadow-md flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(255,69,0,0.4)]">
                        <Icon icon="mdi:brain" class="text-[#FF4500] mb-2" width="48" height="48" />
                        <p class="text-center font-semibold">Curiosity</p>
                    </div>
                    <div class="bg-[#f0f0f0] p-4 rounded-lg shadow-md flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(0,128,128,0.4)]">
                        <Icon icon="mdi:lightbulb-on-outline" class="text-[#008080] mb-2" width="48" height="48" />
                        <p class="text-center font-semibold">Creativity</p>
                    </div>
                    <div class="bg-[#f0f0f0] p-4 rounded-lg shadow-md flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(72,61,139,0.4)]">
                        <Icon icon="mdi:head-cog-outline" class="text-[#483D8B] mb-2" width="48" height="48" />
                        <p class="text-center font-semibold">Critical Thinking</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Why Choose Us -->
        <div class="mt-20">
            <h3 class="text-4xl font-bold text-[#6504b0] text-center mb-10">Why Choose Creoleap Technologies?</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-[#f0f0f0] p-6 rounded-lg shadow-md border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(101,4,176,0.4)] hover:border-[#f1dfff]">
                    <div class="flex items-center mb-4">
                        <Icon icon="mdi:book-education-outline" class="text-[#6504b0] mr-3" width="32" height="32" />
                        <h4 class="text-xl font-semibold text-[#0a015a]">NEP-Aligned Curriculum</h4>
                    </div>
                    <p class="text-gray-700">Our programs are designed to meet the guidelines of the National Education Policy, ensuring future-ready education.</p>
                </div>
        
                <div class="bg-[#f0f0f0] p-6 rounded-lg shadow-md border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(0,191,255,0.4)] hover:border-[#d1f1ff]">
                    <div class="flex items-center mb-4">
                        <Icon icon="mdi:atom" class="text-[#00BFFF] mr-3" width="32" height="32" />
                        <h4 class="text-xl font-semibold text-[#0a015a]">CCC Methodology</h4>
                    </div>
                    <p class="text-gray-700">We integrate Curiosity, Creativity, and Critical Thinking into every learning experience.</p>
                </div>
        
                <div class="bg-[#f0f0f0] p-6 rounded-lg shadow-md border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(255,69,0,0.4)] hover:border-[#ffdfd1]">
                    <div class="flex items-center mb-4">
                        <Icon icon="mdi:robot" class="text-[#FF4500] mr-3" width="32" height="32" />
                        <h4 class="text-xl font-semibold text-[#0a015a]">Innovative Learning Solutions</h4>
                    </div>
                    <p class="text-gray-700">We provide advanced educational products and set up future-ready STEM labs.</p>
                </div>
        
                <div class="bg-[#f0f0f0] p-6 rounded-lg shadow-md border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(50,205,50,0.4)] hover:border-[#d1ffd1]">
                    <div class="flex items-center mb-4">
                        <Icon icon="mdi:hand-extended-outline" class="text-[#32CD32] mr-3" width="32" height="32" />
                        <h4 class="text-xl font-semibold text-[#0a015a]">Hands-On Training Programs</h4>
                    </div>
                    <p class="text-gray-700">Our expert-led training sessions empower both teachers and students with practical knowledge.</p>
                </div>
        
                <div class="bg-[#f0f0f0] p-6 rounded-lg shadow-md border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(255,165,0,0.4)] hover:border-[#ffe8cc]">
                    <div class="flex items-center mb-4">
                        <Icon icon="mdi:flask-outline" class="text-[#FFA500] mr-3" width="32" height="32" />
                        <h4 class="text-xl font-semibold text-[#0a015a]">Experiential Learning Focus</h4>
                    </div>
                    <p class="text-gray-700">We prioritize real-world applications over rote memorization to enhance engagement and retention.</p>
                </div>
        
                <div class="bg-[#f0f0f0] p-6 rounded-lg shadow-md border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(128,0,128,0.4)] hover:border-[#f0d1ff]">
                    <div class="flex items-center mb-4">
                        <Icon icon="mdi:toolbox-outline" class="text-[#800080] mr-3" width="32" height="32" />
                        <h4 class="text-xl font-semibold text-[#0a015a]">Comprehensive Resources</h4>
                    </div>
                    <p class="text-gray-700">From robotics kits to AI-driven tools, we offer a diverse range of learning materials.</p>
                </div>
        
                <div class="bg-[#f0f0f0] p-6 rounded-lg shadow-md border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(30,144,255,0.4)] hover:border-[#d1e9ff]">
                    <div class="flex items-center mb-4">
                        <Icon icon="mdi:account-group" class="text-[#1E90FF] mr-3" width="32" height="32" />
                        <h4 class="text-xl font-semibold text-[#0a015a]">Expert-Led Development</h4>
                    </div>
                    <p class="text-gray-700">Our team of professionals ensures high-quality content and solutions tailored to modern education needs.</p>
                </div>
        
                <div class="bg-[#f0f0f0] p-6 rounded-lg shadow-md border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(220,20,60,0.4)] hover:border-[#ffd1d9]">
                    <div class="flex items-center mb-4">
                        <Icon icon="mdi:desktop-mac" class="text-[#DC143C] mr-3" width="32" height="32" />
                        <h4 class="text-xl font-semibold text-[#0a015a]">Smart Classrooms & Innovation Hubs</h4>
                    </div>
                    <p class="text-gray-700">We create collaborative spaces that promote creativity and technological exploration.</p>
                </div>
        
                <div class="bg-[#f0f0f0] p-6 rounded-lg shadow-md border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(46,139,87,0.4)] hover:border-[#d1e8dd]">
                    <div class="flex items-center mb-4">
                        <Icon icon="mdi:headset" class="text-[#2E8B57] mr-3" width="32" height="32" />
                        <h4 class="text-xl font-semibold text-[#0a015a]">Dedicated Support & Consultation</h4>
                    </div>
                    <p class="text-gray-700">We provide ongoing guidance to ensure seamless implementation of our solutions.</p>
                </div>
            </div>
        </div>
        

        <!-- Inspiring Innovation -->
        <div class="mt-20">
            <h3 class="text-4xl font-bold text-[#6504b0] text-center mb-10">Inspiring Innovation & Critical Thinking</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div class="order-2 md:order-1 w-full flex justify-center items-center">
                    <div class="rounded-xl overflow-hidden shadow-lg border w-3/4 ">
                        <img 
                            src="/skills.png"
                            alt="Innovation Hub"
                            class="w-full"
                        />
                    </div>
                </div>
                <div class="order-1 md:order-2">
                    <div class="mb-6">
                        <div class="flex items-center mb-2">
                            <Icon icon="mdi:magnify" class="text-[#6504b0] mr-3" width="28" height="28" />
                            <h4 class="text-2xl font-semibold text-[#0a015a]">Curiosity-Driven Learning</h4>
                        </div>
                        <p class="text-lg text-gray-700 ml-10">We encourage students to ask questions, explore concepts, and develop a deeper understanding of technology.</p>
                    </div>
                    
                    <div class="mb-6">
                        <div class="flex items-center mb-2">
                            <Icon icon="mdi:puzzle-outline" class="text-[#6504b0] mr-3" width="28" height="28" />
                            <h4 class="text-2xl font-semibold text-[#0a015a]">Creative Problem-Solving</h4>
                        </div>
                        <p class="text-lg text-gray-700 ml-10">Through hands-on activities, we nurture innovation and out-of-the-box thinking.</p>
                    </div>
                    
                    <div>
                        <div class="flex items-center mb-2">
                            <Icon icon="mdi:domain" class="text-[#6504b0] mr-3" width="28" height="28" />
                            <h4 class="text-2xl font-semibold text-[#0a015a]">Building Future-Ready Hubs</h4>
                        </div>
                        <p class="text-lg text-gray-700 ml-10">Our innovation hubs serve as incubation centers for young minds to explore, create, and bring ideas to life.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cultivating Future Leaders -->
        <!-- <div class="mt-20 bg-gradient-to-r from-blue-900 to-indigo-800 p-10 rounded-md shadow-xl">
            <div class="flex flex-col md:flex-row items-center">
                
                <div class="md:w-2/3 pr-6">
                    <h3 class="text-3xl font-semibold text-white mb-6 border-b border-blue-300 pb-3">Developing Tomorrow's Innovators</h3>
                    <div class="text-gray-100 space-y-4">
                        <p class="text-base leading-relaxed">
                            Creoleap Technologies partners with educational institutions to cultivate the next generation of innovative thinkers. Our research-backed methodologies provide educators with the essential frameworks needed to develop critical thinking and creative problem-solving skills in their students.
                        </p>
                        <p class="text-base leading-relaxed">
                            Through our NEP-aligned curriculum resources and proprietary CCC methodology, we enable educational professionals to unlock each student's potential, fostering the kind of innovation that addresses tomorrow's challenges.
                        </p>
                    </div>
                </div>
                
                <div class="md:w-1/3 flex justify-center mt-6 md:mt-0">
                    <div class="bg-white bg-opacity-10 p-6 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-blue-200">
                            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z"></path>
                            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04Z"></path>
                        </svg>
                    </div>
                </div>
            </div>
            

            <div class="mt-8 pt-4 border-t border-blue-700 text-right">
                <span class="text-blue-200 text-sm font-medium">Innovative Education Solutions</span>
            </div>
        </div> -->

        <!-- Call to Action -->
        <div class="mt-20 text-center">
            <h3 class="text-4xl font-bold text-[#6504b0] mb-6">Join the Education Revolution</h3>
            <p class="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
                Partner with Creoleap Technologies to transform your educational institution and prepare students for the future.
            </p>
            
            <div class="flex justify-center space-x-6">
                <a href="/#contact" class="bg-[#6504b0] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#5a03a0] transition-colors flex items-center">
                    <Icon icon="mdi:email-outline" class="mr-2" width="20" height="20" />
                    Contact Us
                </a>
                <a href="/" class="bg-white text-[#6504b0] font-bold py-3 px-8 rounded-lg border-2 border-[#6504b0] hover:bg-[#f8f6ff] transition-colors flex items-center">
                    <Icon icon="mdi:rocket-launch-outline" class="mr-2" width="20" height="20" />
                    Explore Solutions
                </a>
            </div>
        </div>
    </div>
</section>

<Footer_2 />