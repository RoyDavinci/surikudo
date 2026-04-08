"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "Studio", href: "/studio" },
	{ label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const effect = () => {
			setMobileOpen(false);
		};

		effect();
	}, [pathname]);

	const isActive = (href: string) =>
		href === "/" ? pathname === "/" : pathname.startsWith(href);

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-black"
			}`}
		>
			<div className='max-w-7xl mx-auto px-6 flex items-center justify-between h-16'>
				{/* Logo */}
				<Link
					href='/'
					className='text-white font-black text-xl tracking-wider uppercase'
				>
					Studio Surikudo
				</Link>

				{/* Desktop Nav */}
				<div className='hidden md:flex items-center gap-8'>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`font-medium text-sm transition-colors ${
								isActive(link.href)
									? "text-primary"
									: "text-white/80 hover:text-white"
							}`}
						>
							{link.label}
						</Link>
					))}
				</div>

				{/* CTA */}
				<div className='flex items-center gap-4'>
					<Link
						href='/login'
						className='text-white/80 text-sm font-medium hover:text-white transition-colors hidden md:block'
					>
						Login
					</Link>
					<Link
						href='/#studios'
						className='bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-5 py-2.5 flex items-center gap-2 transition-colors'
					>
						Book a Session <span>→</span>
					</Link>
					{/* Mobile hamburger */}
					<button
						className='md:hidden text-white p-1'
						onClick={() => setMobileOpen(!mobileOpen)}
					>
						{mobileOpen ? (
							<svg
								className='w-6 h-6'
								fill='none'
								stroke='currentColor'
								strokeWidth={2}
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						) : (
							<svg
								className='w-6 h-6'
								fill='none'
								stroke='currentColor'
								strokeWidth={2}
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M4 6h16M4 12h16M4 18h16'
								/>
							</svg>
						)}
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			<div
				className={`md:hidden bg-black border-t border-white/10 overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-64" : "max-h-0"}`}
			>
				<div className='px-6 py-4 flex flex-col gap-4'>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`text-sm font-medium ${isActive(link.href) ? "text-primary" : "text-white/80"}`}
						>
							{link.label}
						</Link>
					))}
					<Link href='/login' className='text-white/80 text-sm font-medium'>
						Login
					</Link>
				</div>
			</div>
		</nav>
	);
}
