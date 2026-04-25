import Link from "next/link";

const footerLinks = {
	Company: [
		{ label: "FAQs", href: "#faq" },
		{ label: "Contact", href: "/contact" },
		{ label: "Pricing", href: "#pricing" },
	],
	Legal: [
		{ label: "Privacy Policy", href: "/" },
		{ label: "Terms of Service", href: "/" },
		{ label: "Privacy Policy", href: "/" },
	],
};

const socials = [
	{
		label: "Facebook",
		href: "#",
		icon: (
			<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
				<path d='M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' />
			</svg>
		),
	},
	{
		label: "Twitter",
		href: "#",
		icon: (
			<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
				<path d='M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' />
			</svg>
		),
	},
	{
		label: "Instagram",
		href: "#",
		icon: (
			<svg
				className='w-4 h-4'
				fill='none'
				stroke='currentColor'
				strokeWidth={2}
				viewBox='0 0 24 24'
			>
				<rect x='2' y='2' width='20' height='20' rx='5' ry='5' />
				<circle cx='12' cy='12' r='4' />
				<circle cx='17.5' cy='6.5' r='0.5' fill='currentColor' />
			</svg>
		),
	},
	{
		label: "LinkedIn",
		href: "#",
		icon: (
			<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
				<path d='M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' />
				<circle cx='4' cy='4' r='2' />
			</svg>
		),
	},
];

export default function Footer() {
	return (
		<footer className='bg-primary text-white'>
			<div className='max-w-7xl mx-auto px-6 py-16'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-10'>
					{/* Logo */}
					<div className='md:col-span-1'>
						<h2 className='text-4xl font-black uppercase leading-tight'>
							Studio
							<br />
							Surikudo
						</h2>
					</div>

					{/* Links */}
					{Object.entries(footerLinks).map(([category, links]) => (
						<div key={category}>
							<h4 className='font-semibold text-white mb-4 pb-2 border-b border-white/20'>
								{category}
							</h4>
							<ul className='space-y-3'>
								{links.map((link) => (
									<li key={link.label + link.href}>
										<Link
											href={link.href}
											className='text-white/70 text-sm hover:text-white transition-colors'
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}

					{/* Social */}
					<div>
						<h4 className='font-semibold text-white mb-4 pb-2 border-b border-white/20'>
							Social
						</h4>
						<div className='flex gap-4 flex-wrap'>
							{socials.map((s) => (
								<Link
									key={s.label}
									href={s.href}
									aria-label={s.label}
									className='text-white/70 hover:text-white transition-colors'
								>
									{s.icon}
								</Link>
							))}
						</div>
					</div>
				</div>

				<div className='mt-12 pt-6 border-t border-white/20 text-center text-white/50 text-xs'>
					© {new Date().getFullYear()} Studio Surikudo. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
