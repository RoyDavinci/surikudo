import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import FAQ from "../components/faq/FAQ";
import StudioStory from "../components/StudioStory";
import StudioFigures from "../components/StudioFigures";
import StudioTeam from "../components/StudioTeam";

export const metadata = {
	title: "Studio — Studio Surikudo",
	description:
		"Learn about Studio Surikudo — our story, our figures, and the team behind the world-class creative spaces.",
};

export default function StudioPage() {
	return (
		<main className='min-h-screen'>
			<Navbar />
			<StudioStory />
			<StudioFigures />
			<StudioTeam />
			<FAQ />
			<Footer />
		</main>
	);
}
