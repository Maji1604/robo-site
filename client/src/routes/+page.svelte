<script>
	import About from "../components/About.svelte";
	import Chatbot from "../components/Chatbot.svelte";
	import Contact from "../components/Contact.svelte";
	import Faq from "../components/Faq.svelte";
	import First from "../components/First.svelte";
	import Footer from "../components/Footer.svelte";
	import Footer_2 from "../components/Footer_2.svelte";
import Home from "../components/Home.svelte"
	import Innovation from "../components/innovation.svelte";
import NavBar from "../components/NavBar.svelte";
	import OurSolution from "../components/OurSolution.svelte";
	import Sample from "../components/sample.svelte";
	import NewHome from "../components/Solution.svelte";
	import { toast, Toaster } from 'svelte-sonner';
</script>

<main class="">
	<Toaster position="top-center" />
    <First />
	<About />

	<div id="solution">
		<NewHome />
	</div>
    <!-- <Home /> -->

<!-- <Sample /> -->
<!-- <OurSolution /> -->

<Faq />
<Innovation />
<Chatbot />
<!-- <Footer /> -->
<div id="contact">
	<Contact />
</div>

<Footer_2 />

</main>
