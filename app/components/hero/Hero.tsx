"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "../../../public/images/b0648d33c960e264e2183aa09cccdd064a30a6c7.png";
import Image from "next/image";

const avatars = [
	{ initials: "NB", bg: "#f3e8ff", color: "#7c3aed" },
	{ initials: "EM", bg: "#fef9c3", color: "#854d0e" },
	{ initials: "CW", bg: "#dbeafe", color: "#1d4ed8" },
	{ initials: "WE", bg: "#fce7f3", color: "#9d174d" },
];

export default function Hero() {
	const imgRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = imgRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) el.classList.add("hero-img-visible");
			},
			{ threshold: 0.1 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section className='min-h-screen bg-white flex items-center pt-16'>
			<div className='max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20'>
				{/* Left */}
				<div className='hero-left'>
					<h1 className='text-5xl lg:text-6xl font-black leading-tight text-gray-950 mb-6'>
						Book <span className='text-primary'>World Class</span>
						<br />
						Studios in Seconds
					</h1>
					<p className='text-lg text-gray-600 mb-4 leading-relaxed max-w-lg'>
						Professional Digital Production, Dolby Atmos, Podcast, and Photo
						Studios.
					</p>
					<p className='text-lg text-gray-600 mb-8'>
						• Real-time availability &nbsp;• Instant confirmation •&nbsp; Secure
						client portal for all your files.
					</p>

					<div className='flex items-center gap-4 mb-10'>
						<Link
							href='/#studios'
							className='bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 flex items-center gap-2 transition-colors text-sm'
						>
							Book a Session <span>→</span>
						</Link>
						<Link
							href='/services'
							className='text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors'
						>
							Explore Service
						</Link>
					</div>

					{/* Social proof */}
					<div className='flex items-center gap-3'>
						<div className='flex -space-x-2'>
							{avatars.map((a) => (
								<div
									key={a.initials}
									className='w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold'
									style={{ background: a.bg, color: a.color }}
								>
									{a.initials}
								</div>
							))}
						</div>
						<span className='text-sm text-gray-500 font-medium'>
							Trusted by creators, brands &amp; agencies
						</span>
					</div>
				</div>

				{/* Right — studio image */}
				<div
					ref={imgRef}
					className='hero-img rounded-2xl overflow-hidden shadow-2xl bg-gray-100 aspect-[4/3] flex items-center justify-center relative'
				>
					<Image src={Logo} alt='' />
				</div>
			</div>

			<style jsx>{`
				.hero-left {
					animation: fadeUp 0.8s ease both;
				}
				.hero-img {
					opacity: 0;
					transform: translateX(40px);
					transition:
						opacity 0.8s ease 0.2s,
						transform 0.8s ease 0.2s;
				}
				.hero-img-visible {
					opacity: 1;
					transform: translateX(0);
				}
				@keyframes fadeUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</section>
	);
}
