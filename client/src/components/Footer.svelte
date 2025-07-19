<script>
    // Function to handle newsletter subscription
    function subscribeNewsletter(event) {
        event.preventDefault();
        const email = event.target.email.value;
        alert(`Thank you for subscribing, ${email}!`);
    }
</script>

<footer class="bg-gradient-to-tr from-[#080A25] to-[#0a015a] text-white lg:py-12 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
   
<div class="flex justify-center lg:pb-16 pb-10 ">
    <img src="/Logo-big.png" class=" lg:w-1/2 md:w-3/4 w-5/6" alt="logo">
</div>
    <!-- Footer Bottom -->
    <div class="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
        &copy; 2025 Creoleap Technologies. All rights reserved.
    </div>
</footer>