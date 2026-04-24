/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import LogoStrip from "../../public/images/bd278773590db110a57828a8f18c0cd44f54b711.png";

const studioText = `Studio Surikudo was born from a singular obsession: the belief that great sound begins long before the engineer hits record. Since opening our doors, we have built an environment where acoustic precision meets creative freedom — a space engineered for artists who refuse to compromise.

Our rooms are tuned to professional broadcast standards, our equipment roster curated across decades of recording science, and our team selected for their ear as much as their credentials. Every session here is a collaboration between craft and vision.

We serve artists, producers, and brands who understand that the space you record in shapes the music you make. Come build something worth hearing.`;

export default function StudioFigures() {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setVisible(true);
			},
			{ threshold: 0.1 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section className='bg-white py-0'>
			{/* Logo strip */}
			<div className='border-b border-gray-100 py-8 px-6'>
				<div className='max-w-7xl mx-auto flex items-center justify-center'>
					<Image
						src={LogoStrip}
						alt='Partner logos'
						className='w-full max-w-4xl object-contain'
						priority
					/>
				</div>
			</div>

			{/* Director's Edit content */}
			<div
				ref={ref}
				className={`max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start transition-all duration-700 ${
					visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
				}`}
			>
				{/* Left */}
				<div className='lg:sticky lg:top-24'>
					<h2 className='text-5xl font-black text-gray-950 mb-5 leading-tight'>
						Director's Edit
					</h2>
					<p className='text-gray-400 text-sm leading-relaxed max-w-xs'>
						Unleashing creativity, our team of design visionaries turns ordinary
						spaces into extraordinary experiences
					</p>
				</div>

				{/* Right — body text */}
				<div>
					<p className='text-gray-700 text-base leading-[1.9] whitespace-pre-line'>
						{studioText}
					</p>
				</div>
			</div>
		</section>
	);
}
