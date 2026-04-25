/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "../../lib/redux/hooks";
import { ADMIN_EMAIL } from "../../lib/redux/slices/authSlice";

const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "Studio", href: "/studio" },
	{ label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const pathname = usePathname();

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const user = useAppSelector((state) => state.auth.user);

	const isSilentAdmin =
		user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

	const showDashboard = Boolean(user) && !isSilentAdmin;

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// ✅ Fix: only pathname in deps — closes menu on route change
	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	const isActive = (href: string) =>
		href === "/" ? pathname === "/" : pathname.startsWith(href);
	if (!mounted) return null;

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-black"
			}`}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16'>
				{/* Logo */}
				<Link
					href='/'
					className='text-white font-black text-lg sm:text-xl tracking-wider uppercase shrink-0'
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
									? "text-red-500"
									: "text-white/80 hover:text-white"
							}`}
						>
							{link.label}
						</Link>
					))}
				</div>

				{/* Right side */}
				<div className='flex items-center gap-3'>
					{/* Auth link — desktop only */}
					{showDashboard ? (
						<Link
							href='/dashboard'
							className='text-white/80 text-sm font-medium hover:text-white transition-colors hidden md:block'
						>
							Dashboard
						</Link>
					) : (
						<Link
							href='/login'
							className='text-white/80 text-sm font-medium hover:text-white transition-colors hidden md:block'
						>
							Login
						</Link>
					)}

					{/* Book CTA */}
					<Link
						href='/#studios'
						className='bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2 sm:py-2.5 flex items-center gap-1.5 transition-colors whitespace-nowrap'
					>
						Book a Session <span>→</span>
					</Link>

					{/* Hamburger */}
					<button
						className='md:hidden text-white p-1.5 -mr-1 rounded'
						onClick={() => setMobileOpen((v) => !v)}
						aria-label='Toggle menu'
					>
						{mobileOpen ? (
							<svg
								className='w-5 h-5'
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
								className='w-5 h-5'
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
				className={`md:hidden bg-black border-t border-white/10 overflow-hidden transition-all duration-300 ${
					mobileOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className='px-4 py-5 flex flex-col gap-1'>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`text-sm font-medium px-3 py-3 rounded-lg transition-colors ${
								isActive(link.href)
									? "text-red-500 bg-white/5"
									: "text-white/80 hover:text-white hover:bg-white/5"
							}`}
						>
							{link.label}
						</Link>
					))}

					<div className='border-t border-white/10 mt-2 pt-3'>
						{showDashboard ? (
							<Link
								href='/dashboard'
								className='text-sm font-medium px-3 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/5 block transition-colors'
							>
								Dashboard
							</Link>
						) : (
							<Link
								href='/login'
								className='text-sm font-medium px-3 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/5 block transition-colors'
							>
								Login
							</Link>
						)}

						<Link
							href='/#studios'
							className='mt-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-3 flex items-center justify-center gap-2 transition-colors rounded-lg'
						>
							Book a Session →
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
