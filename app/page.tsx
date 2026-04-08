import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import About from "./components/about/About";
import Studios from "./components/studios/Studios";
import Pricing from "./components/pricing/Pricing";
import FAQ from "./components/faq/FAQ";
import Testimonials from "./components/testimonials/Testimonials";
import Footer from "./components/footer/Footer";

export default function Home() {
	return (
		<main className='min-h-screen'>
			<Navbar />
			<Hero />
			<About />
			<Studios />
			<Pricing />
			<FAQ />
			<Testimonials />
			<Footer />
		</main>
	);
}
