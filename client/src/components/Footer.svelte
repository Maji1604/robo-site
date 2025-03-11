<script>
    // Function to handle newsletter subscription
    function subscribeNewsletter(event) {
        event.preventDefault();
        const email = event.target.email.value;
        alert(`Thank you for subscribing, ${email}!`);
    }
</script>

<footer class="bg-gradient-to-tr from-[#080A25] to-[#0a015a] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
   
<div class="flex justify-center pb-16">
    <img src="/Logo-big.png" class=" w-1/2" alt="logo">
</div>
    <!-- Footer Bottom -->
    <div class="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
        &copy; 2023 CreoLeap Technologies. All rights reserved.
    </div>
</footer>