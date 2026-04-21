"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "../lib/redux/slices/authSlice";

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

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();

	const dispatch = useDispatch();
	const handleLogout = () => {
		dispatch(logout());
		router.push("/login");
	};

	return (
		<div
			style={{
				display: "flex",
				minHeight: "100vh",
				background: "#f7f7f7",
				fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
			}}
		>
			{/* Sidebar */}
			<aside
				style={{
					width: 256,
					minHeight: "100vh",
					background: "#e60000",
					display: "flex",
					flexDirection: "column",
					flexShrink: 0,
					position: "sticky",
					top: 0,
					height: "100vh",
				}}
			>
				{/* Logo */}
				<div
					style={{
						padding: "28px 24px 32px",
						borderBottom: "1px solid rgba(255,255,255,0.15)",
					}}
				>
					<Link href='/' style={{ textDecoration: "none" }}>
						<span
							style={{
								color: "#fff",
								fontWeight: 900,
								fontSize: 20,
								letterSpacing: "-0.03em",
								textTransform: "uppercase",
							}}
						>
							STUDIO&nbsp; SURIKUDO
						</span>
					</Link>
				</div>

				{/* Nav */}
				<nav style={{ flex: 1, padding: "16px 0" }}>
					{NAV.map(({ href, label, icon }) => {
						const active = pathname === href;
						return (
							<Link
								key={href}
								href={href}
								style={{
									display: "flex",
									alignItems: "center",
									gap: 12,
									padding: "13px 24px",
									textDecoration: "none",
									background: active ? "rgba(0,0,0,0.2)" : "transparent",
									color: active ? "#fff" : "rgba(255,255,255,0.75)",
									fontSize: 14,
									fontWeight: active ? 600 : 400,
									borderLeft: active
										? "3px solid #fff"
										: "3px solid transparent",
								}}
							>
								{icon} {label}
							</Link>
						);
					})}
				</nav>

				{/* Book a session */}
				<div style={{ padding: "0 16px" }}>
					<Link
						href='/book'
						style={{
							display: "block",
							textAlign: "center",
							padding: "13px",
							background: "#fff",
							color: "#e60000",
							fontWeight: 700,
							fontSize: 14,
							borderRadius: 4,
							textDecoration: "none",
						}}
					>
						Book a session
					</Link>
				</div>

				{/* Logout */}
				<div
					style={{
						marginTop: 24,
						borderTop: "1px solid rgba(255,255,255,0.15)",
						paddingTop: 16,
					}}
				>
					<button
						onClick={handleLogout}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							padding: "10px 24px",
							background: "transparent",
							border: "none",
							color: "rgba(255,255,255,0.75)",
							cursor: "pointer",
							fontSize: 14,
						}}
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
					</button>
				</div>
			</aside>

			{/* Page content */}
			<main style={{ flex: 1, overflow: "auto" }}>{children}</main>
		</div>
	);
}
