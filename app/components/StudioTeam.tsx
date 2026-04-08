"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Image from "next/image";
import TeamImg from "../../public/images/ac9d25e4ffdd485787aebef78dd4aac2b283439e.png";

const team = [
	{
		name: "Daniel Rodriguez",
		role: "Lead Engineer",
		bio: "A master of code and innovation, Daniel brings projects to fruition with precision and creativity.",
	},
	{
		name: "Sophia Liu",
		role: "Audio Director",
		bio: "Sophia brings narratives to life through evocative visual compositions and storytelling.",
	},
	{
		name: "Emma Carter",
		role: "Studio Designer",
		bio: "A visionary designer crafting seamless experiences that captivate and inspire.",
	},
	// {
	// 	name: "Marcus Webb",
	// 	role: "Dolby Atmos Specialist",
	// 	bio: "Marcus shapes immersive sonic landscapes that transport listeners into new dimensions.",
	// },
	// {
	// 	name: "Aisha Okonkwo",
	// 	role: "Podcast Producer",
	// 	bio: "Aisha ensures every voice is captured with clarity and character.",
	// },
	// {
	// 	name: "James Harrington",
	// 	role: "Operations Manager",
	// 	bio: "James keeps every session running smoothly from booking to delivery.",
	// },
];

function TeamCard({
	member,
	delay,
}: {
	member: (typeof team)[0];
	delay: number;
}) {
	return (
		<div
			className='team-card group relative rounded-2xl overflow-hidden'
			style={{ "--delay": `${delay}s` } as React.CSSProperties}
		>
			{/* Image */}
			<div className='relative h-[420px] w-full'>
				<Image
					src={TeamImg}
					alt={member.name}
					fill
					className='object-cover transition-transform duration-700 group-hover:scale-105'
				/>
			</div>

			{/* Gradient overlay */}
			<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition duration-500' />

			{/* Content */}
			<div className='absolute inset-0 flex flex-col justify-end p-6'>
				{/* Default (visible always) */}
				<div className='transition-all duration-500 group-hover:-translate-y-6'>
					<h3 className='text-white text-xl font-semibold'>{member.name}</h3>
					<p className='text-white/70 text-sm'>{member.role}</p>
				</div>

				{/* Hidden bio → slides up on hover */}
				<div className='mt-3 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100'>
					<p className='text-white/80 text-sm leading-relaxed'>{member.bio}</p>
				</div>
			</div>

			<style jsx>{`
				.team-card {
					opacity: 0;
					transform: translateY(30px);
					animation: cardIn 0.6s ease var(--delay) forwards;
				}
				@keyframes cardIn {
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</div>
	);
}

export default function StudioTeam() {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) el.classList.add("section-visible");
			},
			{ threshold: 0.1 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section className='py-24 bg-white' id='team'>
			<div className='max-w-7xl mx-auto px-6'>
				{/* Header */}
				<div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14'>
					<div>
						<p className='text-gray-500 text-sm mb-3'>Pure talent</p>

						<h2 className='text-5xl font-semibold text-gray-950 mb-4'>
							Our Team
						</h2>

						<p className='text-gray-500 max-w-sm'>
							A collective of creatives, engineers, and visionaries shaping the
							future of studio experiences.
						</p>
					</div>

					<div className='flex items-center gap-4'>
						<Link
							href='/book'
							className='bg-black text-white px-5 py-2.5 text-sm hover:bg-gray-800 transition'
						>
							Get started
						</Link>

						<Link
							href='/studio'
							className='text-gray-600 text-sm hover:text-black transition'
						>
							Explore
						</Link>
					</div>
				</div>

				{/* Grid */}
				<div
					ref={ref}
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
				>
					{team.map((member, i) => (
						<TeamCard key={member.name} member={member} delay={i * 0.1} />
					))}
				</div>
			</div>
		</section>
	);
}
