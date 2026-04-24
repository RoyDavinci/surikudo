"use client";
import Link from "next/link";

const testimonials = [
	{
		text: "The team was professional, creative, and delivered outstanding results on time. They truly brought our vision to life and exceeded every expectation.",
		name: "Owen Brooks",
		role: "Architect",
	},
	{
		text: "Their dedication and expertise were evident from day one. They understood our goals perfectly and delivered a solution that has transformed how we operate.",
		name: "Laura Bennett",
		role: "Designer",
	},
	{
		text: "We were impressed by the level of professionalism, creativity, and timely delivery. Their work exceeded our expectations and truly captured our vision.",
		name: "Noah Blake",
		role: "Engineer",
	},
	{
		text: "From the start, their commitment and knowledge shone through. They grasped our objectives effortlessly and provided a transformative solution that reshaped our approach.",
		name: "Luke Evans",
		role: "Product Manager",
	},
	{
		text: "Their attention to detail, innovative approach, and punctual delivery stood out. They not only met but surpassed our expectations, bringing our vision to reality.",
		name: "Zoe Carter",
		role: "Developer",
	},
	{
		text: "Impressed by their professionalism, creativity, and adherence to deadlines. Their work went above and beyond, fully realizing our vision and exceeding all expectations.",
		name: "Mia Collins",
		role: "Artist",
	},
	{
		text: "Their dedication, expertise, and efficiency were remarkable. They comprehended our goals thoroughly and offered a solution that revolutionized our workflow.",
		name: "Ethan Cole",
		role: "Creative Director",
	},
	{
		text: "Noteworthy for their professionalism, creativity, and timely deliverables. Their execution went beyond expectations, perfectly translating our vision into reality.",
		name: "Ryan Pierce",
		role: "Art Director",
	},
	{
		text: "The team demonstrated exceptional professionalism, creativity, and punctuality. Their work exceeded our expectations, bringing our vision to life seamlessly.",
		name: "Ella James",
		role: "Brand Manager",
	},
];

function Stars() {
	return (
		<div className='flex gap-0.5 mb-4'>
			{[...Array(5)].map((_, i) => (
				<svg
					key={i}
					className='w-5 h-5 text-yellow-400'
					fill='currentColor'
					viewBox='0 0 20 20'
				>
					<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
				</svg>
			))}
		</div>
	);
}

function Avatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("");
	const colors = [
		"#dbeafe",
		"#fce7f3",
		"#dcfce7",
		"#fef9c3",
		"#f3e8ff",
		"#ffedd5",
	];
	const textColors = [
		"#1d4ed8",
		"#9d174d",
		"#166534",
		"#854d0e",
		"#7c3aed",
		"#9a3412",
	];
	const idx = name.charCodeAt(0) % colors.length;
	return (
		<div
			className='w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0'
			style={{ background: colors[idx], color: textColors[idx] }}
		>
			{initials}
		</div>
	);
}

export default function Testimonials() {
	return (
		<section className='py-24 bg-gray-50' id='testimonials'>
			<div className='max-w-6xl mx-auto px-6'>
				<div className='text-center mb-10'>
					<h2 className='text-5xl font-black text-gray-950 mb-4'>
						See what people are saying
					</h2>
					<p className='text-gray-500 text-sm max-w-md mx-auto leading-relaxed'>
						Discover the experiences of our satisfied clients. Read their
						testimonials to see how Studio Surikudo has transformed their
						creative process.
					</p>
					<div className='flex items-center justify-center gap-4 mt-6'>
						<Link
							href='/register'
							className='bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 text-sm transition-colors'
						>
							Get started
						</Link>
						<Link
							href='/features'
							className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors'
						>
							Explore features
						</Link>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
					{testimonials.map((t, i) => (
						<div
							key={t.name}
							className={`bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow ${
								i >= 6 ? "opacity-50" : ""
							}`}
						>
							<Stars />
							<p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4'>
								{t.text}
							</p>
							<div className='flex items-center gap-3'>
								<Avatar name={t.name} />
								<div>
									<p className='font-semibold text-gray-900 text-sm'>
										{t.name}
									</p>
									<p className='text-gray-400 text-xs'>{t.role}</p>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className='text-center mt-8'>
					<button className='border border-gray-300 text-gray-600 text-sm font-medium px-5 py-2.5 hover:border-gray-400 hover:text-gray-900 transition-all rounded'>
						See all testimonials
					</button>
				</div>
			</div>
		</section>
	);
}
