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
	export let data;
</script>
<svelte:head>
    <title>{data.seo.title}</title>
    <meta name="description" content={data.seo.description} />
    <meta property="og:title" content={data.seo.title} />
    <meta property="og:description" content={data.seo.description} />
    <meta property="og:image" content={data.seo.ogImage} />
    <meta name="keywords" content={data.seo.keywords} />
</svelte:head>
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
<div class="lg:pb-32 md:pb-20 pb-12  ">
	<Innovation />
</div>
<Chatbot />
<!-- <Footer /> -->
<div id="contact">
	<Contact />
</div>

<Footer_2 />

</main>
