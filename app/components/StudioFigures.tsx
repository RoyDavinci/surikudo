"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const figures = [
	{
		value: 95,
		suffix: "%",
		label: "Client Retention Rate",
		desc: "Building lasting relationships by demonstrating our clients' trust and satisfaction",
	},
	{
		value: 300,
		suffix: "+",
		label: "Consultations Conducted",
		desc: "Providing expert advice in over 300 consultations, helping clients realize their design dreams.",
	},
	// {
	// 	value: 12,
	// 	suffix: "+",
	// 	label: "Years of Experience",
	// 	desc: "Over a decade of crafting world-class audio environments for artists and brands worldwide.",
	// },
	// {
	// 	value: 500,
	// 	suffix: "+",
	// 	label: "Projects Completed",
	// 	desc: "From indie albums to major film scores — every session delivered with precision and care.",
	// },
];

function useCountUp(target: number, duration = 1800, active: boolean) {
	const [count, setCount] = useState(0);
	useEffect(() => {
		if (!active) return;
		let start = 0;
		const step = target / (duration / 16);
		const timer = setInterval(() => {
			start += step;
			if (start >= target) {
				setCount(target);
				clearInterval(timer);
			} else setCount(Math.floor(start));
		}, 16);
		return () => clearInterval(timer);
	}, [target, duration, active]);
	return count;
}

function StatItem({
	value,
	suffix,
	label,
	desc,
	active,
}: (typeof figures)[0] & { active: boolean }) {
	const count = useCountUp(value, 1600, active);
	return (
		<div className='py-8 border-b border-gray-200 last:border-0'>
			<p className='text-4xl font-black text-primary mb-1'>
				{count}
				{suffix}
			</p>
			<p className='font-bold text-gray-900 mb-1'>{label}</p>
			<p className='text-gray-500 text-sm leading-relaxed'>{desc}</p>
		</div>
	);
}

export default function StudioFigures() {
	const ref = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setActive(true);
			},
			{ threshold: 0.2 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section className='py-24 bg-gray-50'>
			<div className='max-w-7xl mx-auto px-6'>
				<div
					ref={ref}
					className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-start'
				>
					{/* Left */}
					<div className='lg:sticky lg:top-24'>
						<p className='text-green-600 font-semibold text-sm mb-3 bg-green-50 inline-block px-3 py-1 rounded-full'>
							Success in numbers
						</p>
						<h2 className='text-5xl font-black text-gray-950 mb-5'>
							Our Figures
						</h2>
						<p className='text-gray-500 leading-relaxed mb-8 max-w-sm'>
							From the number of clients served to our award-winning projects,
							these metrics tell the story of our commitment to excellence and
							creativity.
						</p>
						<div className='flex items-center gap-4'>
							<Link
								href='/book'
								className='bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 text-sm transition-colors'
							>
								Get started
							</Link>
							<Link
								href='/studio#team'
								className='text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors'
							>
								Explore features
							</Link>
						</div>
					</div>

					{/* Right — stats */}
					<div>
						{figures.map((fig) => (
							<StatItem key={fig.label} {...fig} active={active} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
