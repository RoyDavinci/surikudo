"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
	{
		href: "/dashboard",
		label: "Dashboard",
		icon: (
			<svg
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.8'
				width='18'
				height='18'
			>
				<circle cx='12' cy='8' r='4' />
				<path d='M6 20v-1a6 6 0 0112 0v1' />
			</svg>
		),
	},
	{
		href: "/dashboard/bookings",
		label: "My Bookings",
		icon: (
			<svg
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.8'
				width='18'
				height='18'
			>
				<rect x='3' y='4' width='18' height='18' rx='2' />
				<path d='M16 2v4M8 2v4M3 10h18' />
			</svg>
		),
	},
	{
		href: "/dashboard/vault",
		label: "Content Vault",
		icon: (
			<svg
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.8'
				width='18'
				height='18'
			>
				<rect x='2' y='5' width='20' height='14' rx='2' />
				<path d='M8 12h8M12 9v6' />
			</svg>
		),
	},
	{
		href: "/dashboard/invoices",
		label: "Invoices",
		icon: (
			<svg
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.8'
				width='18'
				height='18'
			>
				<rect x='4' y='2' width='16' height='20' rx='2' />
				<path d='M8 7h8M8 12h8M8 17h5' />
			</svg>
		),
	},
	{
		href: "/dashboard/membership",
		label: "Membership",
		icon: (
			<svg
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.8'
				width='18'
				height='18'
			>
				<circle cx='12' cy='12' r='10' />
				<path d='M12 8v4l3 3' />
			</svg>
		),
	},
	{
		href: "/dashboard/settings",
		label: "Account Settings",
		icon: (
			<svg
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.8'
				width='18'
				height='18'
			>
				<circle cx='12' cy='12' r='3' />
				<path d='M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12' />
			</svg>
		),
	},
];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className='w-64 min-h-screen bg-primary flex flex-col shrink-0 sticky top-0'>
			{/* Logo */}
			<div className='px-6 py-7 border-b border-white/15'>
				<span className='text-white font-black text-xl tracking-tighter uppercase'>
					STUDIO&nbsp; SURIKUDO
				</span>
			</div>

			{/* Nav */}
			<nav className='flex-1 py-4'>
				{NAV.map(({ href, label, icon }) => {
					const active = pathname === href;
					return (
						<Link
							key={href}
							href={href}
							className={`
                flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all duration-150
                border-l-[3px]
                ${
									active
										? "bg-black/20 text-white border-white font-semibold"
										: "text-white/75 border-transparent hover:text-white hover:bg-black/10"
								}
              `}
						>
							{icon}
							{label}
						</Link>
					);
				})}
			</nav>

			{/* Book a session */}
			<div className='px-4 pb-4'>
				<Link
					href='/dashboard/book'
					className='block w-full text-center py-3 bg-white text-primary font-bold text-sm rounded hover:bg-gray-100 transition-colors'
				>
					Book a session
				</Link>
			</div>

			{/* Logout */}
			<div className='mt-4 pt-4 border-t border-white/15'>
				<Link
					href='/login'
					className='flex items-center gap-2.5 px-6 py-2.5 text-white/75 hover:text-white text-sm transition-colors'
				>
					<svg
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='1.8'
						width='18'
						height='18'
					>
						<path d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9' />
					</svg>
					Log out
				</Link>
			</div>
		</aside>
	);
}
