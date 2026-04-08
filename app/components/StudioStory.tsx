"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Logo from "../../public/images/b0648d33c960e264e2183aa09cccdd064a30a6c7.png";
import Image from "next/image";

export default function StudioStory() {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) el.classList.add("story-visible");
			},
			{ threshold: 0.15 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section className='pt-32 pb-24 bg-white'>
			<div className='max-w-7xl mx-auto px-6'>
				<div
					ref={ref}
					className='story-section grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'
				>
					{/* Left */}
					<div>
						<h1 className='text-6xl font-black text-gray-950 mb-6 leading-tight'>
							Our Story
						</h1>
						<p className='text-gray-500 text-lg leading-relaxed mb-8 max-w-md'>
							We bring your creative vision to life with world-class facilities,
							professional engineers, and seamless digital infrastructure that
							reflect your artistry and ambition.
						</p>
						<div className='flex items-center gap-4'>
							<Link
								href='/book'
								className='bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 text-sm transition-colors flex items-center gap-2'
							>
								Get started
							</Link>
							<Link
								href='#team'
								className='text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors'
							>
								Explore features
							</Link>
						</div>
					</div>

					{/* Right — studio image */}
					{/* Right — studio image */}
					<div className='relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]'>
						<Image
							src={Logo}
							alt='Studio'
							fill
							className='object-cover'
							priority
						/>

						{/* Overlay (optional - keeps your design vibe) */}
						<div
							className='absolute inset-0 opacity-20'
							style={{
								backgroundImage: `radial-gradient(circle at 25% 60%, #7c3aed 0%, transparent 55%),
            radial-gradient(circle at 75% 20%, #1d4ed8 0%, transparent 50%)`,
							}}
						/>

						{/* Top LED strip */}
						<div className='absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-80' />
					</div>
				</div>
			</div>

			<style jsx>{`
				.story-section {
					opacity: 0;
					transform: translateY(30px);
					transition:
						opacity 0.8s ease,
						transform 0.8s ease;
				}
				.story-visible {
					opacity: 1;
					transform: translateY(0);
				}
			`}</style>
		</section>
	);
}
