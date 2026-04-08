"use client";
import { useState } from "react";

const faqs = [
	{
		question: "What is Studio Surikudo?",
		answer:
			"Studio Surikudo is a world-class creative facility offering Digital Production, Dolby Atmos mixing, Podcast recording, and Photo Studio spaces. We provide professional equipment, real-time booking, and a secure client portal for all your project files.",
	},
	{
		question: "Our target audience?",
		answer:
			"We serve musicians, podcasters, content creators, filmmakers, brands, and agencies who need professional studio access without long-term commitments. Whether you're an independent artist or a major label, Studio Surikudo has a space for you.",
	},
	{
		question: "How to Integrate our API?",
		answer:
			"Our API allows platforms to embed real-time studio availability and booking flows. Visit our developer documentation at docs.surikudo.com to find authentication guides, endpoints, and code samples in multiple languages.",
	},
	{
		question: "Payment Plans",
		answer:
			"We offer hourly rates starting from $50/hr for podcast sessions, $80/hr for digital production, and $120/hr for Dolby Atmos. Monthly membership packages are also available for regular clients with discounted rates.",
	},
];

export default function FAQ() {
	const [open, setOpen] = useState<number | null>(0);

	return (
		<section className='py-24 bg-gray-50' id='faq'>
			<div className='max-w-3xl mx-auto px-6'>
				<div className='text-center mb-12'>
					<h2 className='text-5xl font-black text-gray-950 mb-4'>
						Frequently asked questions
					</h2>
					<p className='text-gray-500 text-sm leading-relaxed'>
						Our products are integrated seamlessly into any digital platform or
						website
					</p>
				</div>

				<div className='space-y-3'>
					{faqs.map((faq, i) => (
						<div
							key={faq.question}
							className={`border rounded-xl transition-all duration-200 overflow-hidden ${
								open === i
									? "border-primary/50 bg-white"
									: "border-gray-200 bg-white hover:border-gray-300"
							}`}
						>
							<button
								onClick={() => setOpen(open === i ? null : i)}
								className='w-full flex items-center justify-between px-6 py-5 text-left'
							>
								<span className='font-bold text-gray-900 text-base'>
									{faq.question}
								</span>
								<span
									className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-200 ${
										open === i
											? "border-primary text-primary"
											: "border-gray-400 text-gray-400"
									}`}
								>
									{open === i ? (
										<svg
											className='w-3.5 h-3.5'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
											strokeWidth={2.5}
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M20 12H4'
											/>
										</svg>
									) : (
										<svg
											className='w-3.5 h-3.5'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
											strokeWidth={2.5}
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M12 4v16m8-8H4'
											/>
										</svg>
									)}
								</span>
							</button>

							<div
								className={`transition-all duration-300 ease-in-out ${
									open === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
								} overflow-hidden`}
							>
								<p className='px-6 pb-5 text-gray-500 text-sm leading-relaxed'>
									{faq.answer}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
