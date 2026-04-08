"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "../../../public/images/b0648d33c960e264e2183aa09cccdd064a30a6c7.png";

const studios = [
	{
		slug: "digital-production",
		name: "Digital Production",
		description:
			"SSL Console recording suite. Up to 8 musician. Full mixing & mastering",
		tags: ["SSL AWS 924", "Pro Tools HDX", "Neve 1073"],
		price: "80$/hr",
		emoji: "🎛️",
	},
	{
		slug: "dolby-atmos",
		name: "Dolby Atmos",
		description:
			"Certified 7.1.4 immersive mixing. Spatial audio for music, & film.",
		tags: ["Dolby Certified", "7.1.4 setup"],
		price: "120$/hr",
		emoji: "🔊",
	},
	{
		slug: "podcast-studio",
		name: "Podcast Studio",
		description:
			"Acoustically treated. 4 hosts. Multitrack recording + live stream ready",
		tags: ["4 hosts", "Livestream", "Multitrack"],
		price: "50$/hr",
		emoji: "🎙️",
	},
	{
		slug: "photo-studio",
		name: "Photo Studio",
		description:
			"Acoustically treated. 4 hosts. Multitrack recording + live stream ready",
		tags: ["4 hosts", "Livestream", "Multitrack"],
		price: "50$/hr",
		emoji: "🎙️",
	},
];

const features = [
	{
		icon: "🎵",
		title: "Digital Studio:",
		desc: "Engineered For Music Production, Recording, And Mixing.",
	},
	{
		icon: "🎭",
		title: "Dolby Atmos Studio:",
		desc: "Cinematic-Grade Immersive Audio Environment.",
	},
	{
		icon: "🎤",
		title: "Podcast Studio:",
		desc: "Professional Voice Capture In A Clean Acoustic Space.",
	},
	{
		icon: "📸",
		title: "Photo Studio:",
		desc: "Controlled Lighting. Professional Backdrops. Ideal For Portraits, Branding, And Editorial Shoots.",
	},
];

export default function Studios() {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const cards = ref.current?.querySelectorAll(".studio-card");
		if (!cards) return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) entry.target.classList.add("card-visible");
				});
			},
			{ threshold: 0.1 },
		);
		cards.forEach((c) => observer.observe(c));
		return () => observer.disconnect();
	}, []);

	return (
		<section className='py-24 bg-white' id='studios'>
			<div className='max-w-7xl mx-auto px-6'>
				{/* Header */}
				<div className='text-center mb-16'>
					<h2 className='text-5xl font-black text-gray-950 mb-4'>
						Choose Your Studio
					</h2>
					<p className='text-gray-500 text-lg'>
						Three world-class experience, one seamless booking.
					</p>
				</div>

				{/* Studio Cards */}
				<div
					ref={ref}
					className='max-w-6xl mx-auto px-4 md:px-6 lg:px-2 grid grid-cols-1 md:grid-cols-4 gap-6 mb-20'
				>
					{studios.map((studio, i) => (
						<Link
							key={studio.slug}
							href={`/studios/${studio.slug}`}
							className='studio-card border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block'
							style={{ animationDelay: `${i * 0.1}s` }}
						>
							{/* Image */}
							<div className='relative h-44 w-full'>
								<Image
									src={Logo}
									alt={studio.name}
									fill
									className='object-cover'
									priority={i === 0}
								/>
							</div>

							<div className='p-5'>
								<h3 className='font-bold text-gray-900 text-lg mb-1'>
									{studio.name}
								</h3>

								<p className='text-gray-500 text-sm mb-3 leading-relaxed'>
									{studio.description}
								</p>

								<div className='flex flex-wrap gap-2 mb-4'>
									{studio.tags.map((tag) => (
										<span
											key={tag}
											className='text-xs text-gray-500 border border-gray-200 px-2 py-0.5 rounded'
										>
											{tag}
										</span>
									))}
								</div>

								<div className='flex items-center justify-between pt-3 border-t border-gray-100'>
									<span className='text-xl font-bold text-gray-900'>
										{studio.price}
									</span>

									<span className='border border-red-600 text-red-600 text-xs font-semibold px-3 py-1.5 hover:bg-red-600 hover:text-white transition-colors flex items-center gap-1'>
										Book a session <span>→</span>
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>

				{/* Features Grid */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{/* Left features */}
					<div className='flex flex-col gap-6'>
						{features.slice(0, 2).map((f) => (
							<div
								key={f.title}
								className='border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow'
							>
								<div className='text-4xl mb-4'>{f.icon}</div>
								<p className='text-sm text-gray-700 leading-relaxed'>
									<strong>{f.title}</strong> {f.desc}
								</p>
							</div>
						))}
					</div>

					{/* Center CTA */}
					<div className='border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50'>
						<h3 className='text-3xl font-black text-gray-950 mb-4'>
							More than a studio 🤩!
						</h3>
						<p className='text-gray-600 text-sm leading-relaxed mb-6'>
							Premium Studios. Professional Talent. Secure Content Delivery.
							Everything You Need To Produce At The Highest Level, In One
							System.
						</p>
						<Link
							href='/#studios'
							className='bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 flex items-center gap-2 transition-colors text-sm'
						>
							Book A Session <span>→</span>
						</Link>
					</div>

					{/* Right features */}
					<div className='flex flex-col gap-6'>
						{features.slice(2, 4).map((f) => (
							<div
								key={f.title}
								className='border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow'
							>
								<div className='text-4xl mb-4'>{f.icon}</div>
								<p className='text-sm text-gray-700 leading-relaxed'>
									<strong>{f.title}</strong> {f.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<style jsx>{`
				.studio-card {
					opacity: 0;
					transform: translateY(20px);
					transition:
						opacity 0.5s ease,
						transform 0.5s ease,
						box-shadow 0.3s ease,
						translate 0.3s ease;
				}
				.card-visible {
					opacity: 1;
					transform: translateY(0);
				}
			`}</style>
		</section>
	);
}
