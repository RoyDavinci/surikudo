/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "../../../public/images/b0648d33c960e264e2183aa09cccdd064a30a6c7.png";

const BASE_URL = "https://dev.studiosurikudo.com/api/v2";

interface Studio {
	apiId: string; // e.g. "SERV-2602-0001"
	slug: string; // derived from service_name
	service_name: string;
	description: string;
	price: string;
	tags: string[];
}

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

function toSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

function stripHtml(html: string): string {
	return html?.replace(/<[^>]*>/g, "").trim() ?? "";
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
	return (
		<div className='border border-gray-100 rounded-xl overflow-hidden bg-white animate-pulse'>
			{/* Image placeholder */}
			<div className='h-44 w-full bg-gray-100' />
			<div className='p-5 flex flex-col gap-3'>
				{/* Title */}
				<div className='h-5 bg-gray-100 rounded w-2/3' />
				{/* Description lines */}
				<div className='h-3 bg-gray-100 rounded w-full' />
				<div className='h-3 bg-gray-100 rounded w-4/5' />
				{/* Tags */}
				<div className='flex gap-2'>
					<div className='h-5 bg-gray-100 rounded w-16' />
					<div className='h-5 bg-gray-100 rounded w-20' />
					<div className='h-5 bg-gray-100 rounded w-14' />
				</div>
				{/* Footer */}
				<div className='flex items-center justify-between pt-3 border-t border-gray-100'>
					<div className='h-6 bg-gray-100 rounded w-24' />
					<div className='h-8 bg-gray-100 rounded w-28' />
				</div>
			</div>
		</div>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Studios() {
	const ref = useRef<HTMLDivElement>(null);
	const [studios, setStudios] = useState<Studio[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Animate cards when they appear
	useEffect(() => {
		if (loading || studios.length === 0) return;
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
	}, [loading, studios]);

	useEffect(() => {
		const fetchStudios = async () => {
			try {
				setLoading(true);
				setError(null);

				const params = new URLSearchParams({
					fields: JSON.stringify([
						"name",
						"service_name",
						"description",
						"base_price",
						"price_per_hour",
						"duration",
						"service_category",
					]),
					start: "0",
					limit: "10",
				});

				const res = await fetch(
					`${BASE_URL}/document/Studio Service?${params.toString()}`,
					{
						method: "GET",
						headers: {
							Authorization: "token ab7528f977f3a64:bfa2f842eca1082",
							"Content-Type": "application/json",
						},
					},
				);

				if (!res.ok) throw new Error("Failed to fetch studios");

				const result = await res.json();

				console.log("result", result);

				const mapped: Studio[] = (result.data ?? []).map((item: any) => {
					const price = item.price_per_hour || 0;
					return {
						apiId: item.name,
						slug: toSlug(item.service_name ?? item.name),
						service_name: item.service_name ?? item.name,
						description: stripHtml(item.description ?? ""),
						price: `₦${price.toLocaleString()}${item.price_per_hour ? "/hr" : ""}`,
						tags: [
							item.service_category,
							item.duration ? `${item.duration}h` : null,
						].filter(Boolean) as string[],
					};
				});

				setStudios(mapped);
			} catch (err) {
				console.error("Failed to fetch studios:", err);
				setError("Could not load studios. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchStudios();
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
						Three world-class experiences, one seamless booking.
					</p>
				</div>

				{/* Error state */}
				{error && (
					<div className='text-center py-12'>
						<p className='text-red-500 text-sm mb-4'>{error}</p>
						<button
							onClick={() => window.location.reload()}
							className='text-xs font-semibold text-gray-500 border border-gray-200 px-4 py-2 rounded hover:border-gray-400 transition-colors'
						>
							Retry
						</button>
					</div>
				)}

				{/* Studio Cards — skeleton while loading, real cards when done */}
				{!error && (
					<div
						ref={ref}
						className='max-w-6xl mx-auto px-4 md:px-6 lg:px-2 grid grid-cols-1 md:grid-cols-4 gap-6 mb-20'
					>
						{loading
							? Array.from({ length: 4 }).map((_, i) => (
									<SkeletonCard key={i} />
								))
							: studios.map((studio, i) => (
									<Link
										key={studio.apiId}
										href={`/studios/${studio.slug}?id=${studio.apiId}&price=${studio.price}`}
										className='studio-card border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block'
										style={{ animationDelay: `${i * 0.1}s` }}
									>
										{/* Image */}
										<div className='relative h-44 w-full'>
											<Image
												src={Logo}
												alt={studio.service_name}
												fill
												className='object-cover'
												priority={i === 0}
											/>
										</div>

										<div className='p-5'>
											<h3 className='font-bold text-gray-900 text-lg mb-1'>
												{studio.service_name}
											</h3>

											<p className='text-gray-500 text-sm mb-3 leading-relaxed line-clamp-2'>
												{studio.description || "World-class studio experience."}
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
												<span className='text-md font-bold text-gray-900'>
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
				)}

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
						box-shadow 0.3s ease;
				}
				.card-visible {
					opacity: 1;
					transform: translateY(0);
				}
			`}</style>
		</section>
	);
}
