"use client";
import { useState } from "react";
import Link from "next/link";

const plans = [
	{
		name: "Essential Plan",
		monthlyPrice: 500,
		annualPrice: 400,
		description:
			"A perfect starter package for those looking to refresh their space with expert guidance.",
		currency: "€",
		features: [
			{ text: "Mood board creation", included: true },
			{
				text: "Access to a curated list of decor recommendations",
				included: true,
			},
			{ text: "Email support throughout the project", included: true },
			{ text: "Two design revisions", included: true },
			{ text: "Space planning and layout suggestions", included: false },
			{ text: "Personalized color palette selection", included: false },
			{ text: "Basic furniture arrangement tips", included: false },
			{
				text: "Personalized color palette and materials selection",
				included: false,
			},
		],
		popular: false,
		cta: "Get started",
	},
	{
		name: "Starter Plan",
		monthlyPrice: 1500,
		annualPrice: 1200,
		description:
			"A perfect starter package for those looking to refresh their space with expert guidance.",
		currency: "€",
		features: [
			{ text: "Two design revisions", included: true },
			{ text: "Email support throughout the project", included: true },
			{ text: "Personalized color palette selection", included: true },
			{ text: "Basic furniture arrangement tips", included: true },
			{ text: "Mood board creation", included: true },
			{
				text: "Access to a curated list of decor recommendations",
				included: true,
			},
			{
				text: "Personalized color palette and materials selection",
				included: false,
			},
			{ text: "Space planning and layout suggestions", included: false },
		],
		popular: true,
		cta: "Get started",
	},
	{
		name: "Luxury Plan",
		monthlyPrice: 3000,
		annualPrice: 2400,
		description:
			"Our all-inclusive package for those seeking a luxurious, tailored design experience.",
		currency: "€",
		features: [
			{ text: "Mood board creation", included: true },
			{
				text: "Access to a curated list of decor recommendations",
				included: true,
			},
			{
				text: "Personalized color palette and materials selection",
				included: true,
			},
			{ text: "Space planning and layout suggestions", included: true },
			{ text: "Personalized color palette selection", included: true },
			{ text: "Basic furniture arrangement tips", included: true },
			{ text: "Two design revisions", included: true },
			{ text: "Email support throughout the project", included: true },
		],
		popular: false,
		cta: "Get started",
	},
];

const logos = ["Nexera", "Cyfuse", "Orbital", "Velion"];

export default function Pricing() {
	const [annual, setAnnual] = useState(true);

	return (
		<section className='py-24 bg-white' id='pricing'>
			<div className='max-w-6xl mx-auto px-6'>
				<div className='text-center mb-10'>
					<h2 className='text-5xl font-black text-gray-950 mb-3'>
						Choose a membership plan
					</h2>
					{/* <p className='text-gray-400 text-sm'>Pay once, get access forever.</p> */}
				</div>

				{/* Toggle */}
				<div className='flex items-center justify-center gap-3 mb-12'>
					<span
						className={`text-sm font-medium ${!annual ? "text-gray-900" : "text-gray-400"}`}
					>
						Mothly
					</span>
					<button
						onClick={() => setAnnual(!annual)}
						className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? "bg-primary" : "bg-gray-300"}`}
					>
						<span
							className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
								annual ? "translate-x-6" : "translate-x-0"
							}`}
						/>
					</button>
					<span
						className={`text-sm font-medium ${annual ? "text-gray-900" : "text-gray-400"}`}
					>
						Anually
					</span>
				</div>

				{/* Plans */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`rounded-xl border-2 p-6 flex flex-col transition-all duration-200 ${
								plan.popular
									? "border-primary shadow-xl scale-[1.02]"
									: "border-gray-200 hover:border-gray-300 hover:shadow-md"
							}`}
						>
							<div className='mb-4'>
								<div className='flex items-center gap-2 mb-1'>
									<h3 className='font-bold text-gray-900 text-lg'>
										{plan.name}
									</h3>
									{plan.popular && (
										<span className='bg-red-100 text-primary text-xs font-semibold px-2 py-0.5 rounded'>
											Most popular
										</span>
									)}
								</div>
								<p className='text-gray-500 text-sm leading-relaxed'>
									{plan.description}
								</p>
							</div>

							<div className='mb-6'>
								<span className='text-5xl font-black text-gray-950'>
									{(annual
										? plan.annualPrice
										: plan.monthlyPrice
									).toLocaleString()}
								</span>
								<span className='text-lg text-gray-500 ml-1'>
									{plan.currency}
									<span className='text-sm'>/month</span>
								</span>
							</div>

							<hr className='border-gray-100 mb-5' />

							<ul className='flex-1 space-y-3 mb-6'>
								{plan.features.map((f) => (
									<li key={f.text} className='flex items-start gap-2.5 text-sm'>
										{f.included ? (
											<svg
												className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={2.5}
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M5 13l4 4L19 7'
												/>
											</svg>
										) : (
											<svg
												className='w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={2}
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M6 18L18 6M6 6l12 12'
												/>
											</svg>
										)}
										<span
											className={f.included ? "text-gray-700" : "text-gray-400"}
										>
											{f.text}
										</span>
									</li>
								))}
							</ul>

							<button
								className={`w-full py-3 text-sm font-semibold transition-colors ${
									plan.popular
										? "bg-primary hover:bg-primary-dark text-white"
										: "bg-gray-100 hover:bg-gray-200 text-gray-700"
								}`}
							>
								{plan.cta}
							</button>
						</div>
					))}
				</div>

				{/* Logos */}
				<div className='flex items-center justify-center gap-8 flex-wrap'>
					{logos.map((logo) => (
						<span
							key={logo}
							className='text-gray-400 font-semibold text-sm flex items-center gap-2'
						>
							<span className='w-5 h-5 rounded-full bg-gray-200 inline-block' />
							{logo}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
