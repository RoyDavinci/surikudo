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
		<section className='relative w-full h-[600px] overflow-hidden'>
			{/* Background image */}
			<Image src={Logo} alt='Studio' fill className='object-cover' priority />

			{/* Dark overlay */}
			<div className='absolute inset-0 bg-black/55' />

			{/* Centered content */}
			<div
				ref={ref}
				className='story-section relative z-10 h-full flex flex-col items-center justify-center text-center px-6'
			>
				<h1 className='text-5xl font-black text-white mb-5 leading-tight'>
					Our Story
				</h1>
				<p className='text-white/80 text-base leading-relaxed mb-8 max-w-xl'>
					We bring your interior dreams to life with personalized designs that
					reflect your style and personality.
				</p>
				<div className='flex items-center gap-3'>
					<Link
						href='/register'
						className='bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 text-sm transition-colors rounded'
					>
						Get started
					</Link>
					<Link
						href='#team'
						className='bg-white text-gray-900 font-semibold px-6 py-2.5 text-sm hover:bg-gray-100 transition-colors rounded'
					>
						Explore features
					</Link>
				</div>
			</div>

			<style jsx>{`
				.story-section {
					opacity: 0;
					transform: translateY(20px);
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
