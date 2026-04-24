"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function About() {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) el.classList.add("about-visible");
			},
			{ threshold: 0.2 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section className='py-24 bg-white'>
			<div
				ref={ref}
				className='about-section max-w-4xl mx-auto px-6 text-center'
			>
				<p className='text-3xl md:text-4xl font-black text-gray-950 leading-tight mb-6'>
					From music production to immersive Dolby Atmos mixing, from podcasts
					to photography, we provide structured creative environments powered by
					professional support and seamless digital access.
				</p>
				<p className='text-3xl md:text-4xl font-black text-primary leading-snug mb-10'>
					This is not space rental.
					<br />
					This is creative infrastructure.
				</p>
				<div className='flex items-center justify-center gap-4'>
					<Link
						href='/#studios'
						className='bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 flex items-center gap-2 transition-colors text-sm'
					>
						Book a Session <span>→</span>
					</Link>
					<Link
						href='studio'
						className='text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors underline underline-offset-4'
					>
						Learn more
					</Link>
				</div>
			</div>

			<style jsx>{`
				.about-section {
					opacity: 0;
					transform: translateY(30px);
					transition:
						opacity 0.7s ease,
						transform 0.7s ease;
				}
				.about-visible {
					opacity: 1;
					transform: translateY(0);
				}
			`}</style>
		</section>
	);
}
