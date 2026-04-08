"use client";
import { useEffect, useState } from "react";

const IconMusic = () => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		width='20'
		height='20'
	>
		<path d='M9 18V5l12-2v13' />
		<circle cx='6' cy='18' r='3' />
		<circle cx='18' cy='16' r='3' />
	</svg>
);
const IconDownload = () => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		width='16'
		height='16'
	>
		<path d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3' />
	</svg>
);
const IconPlay = () => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		width='16'
		height='16'
	>
		<polygon points='5 3 19 12 5 21 5 3' />
	</svg>
);

const recentFiles = [
	{
		name: "Session_Feb28_Final_Mix.wav",
		date: "Feb 28, 2026",
		size: "48MB",
		type: "Final",
		room: "Digital Room",
		isNew: true,
		action: "Download",
	},
	{
		name: "Session_Feb28_Final_Mix.wav",
		date: "Feb 28, 2026",
		size: "48MB",
		type: "Final",
		room: "Digital Room",
		isNew: true,
		action: "Download",
	},
	{
		name: "Session_Feb28_Preview.mp3",
		date: "Feb 28, 2026",
		size: "8MB",
		type: "Preview",
		room: "",
		isNew: false,
		action: "Play",
	},
	{
		name: "Session_Feb28_Preview.mp3",
		date: "Feb 28, 2026",
		size: "8MB",
		type: "Preview",
		room: "",
		isNew: false,
		action: "Play",
	},
];

export default function DashboardPage() {
	const [email, setEmail] = useState(() => {
		if (typeof window === "undefined") return "";
		return localStorage.getItem("userEmail") || "";
	});

	return (
		<div style={{ padding: "40px 48px" }}>
			{/* Page title */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 10,
					marginBottom: 32,
				}}
			>
				<div
					style={{
						width: 6,
						height: 6,
						borderRadius: "50%",
						background: "#e60000",
					}}
				/>
				<h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Dashboard</h1>
			</div>

			{/* Welcome */}
			{email && (
				<div
					style={{
						background: "#fff9f9",
						border: "1px solid #fde",
						borderRadius: 6,
						padding: "14px 20px",
						marginBottom: 24,
						fontSize: 14,
						color: "#555",
					}}
				>
					Welcome back, <strong style={{ color: "#e60000" }}>{email}</strong>
				</div>
			)}

			{/* Upcoming session */}
			<div
				style={{
					background: "#fff",
					border: "1px solid #eee",
					borderRadius: 8,
					padding: "24px 28px",
					marginBottom: 32,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<div>
					<div
						style={{
							color: "#e60000",
							fontSize: 13,
							fontWeight: 600,
							marginBottom: 6,
						}}
					>
						Upcoming Session
					</div>
					<div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
						Digital Room (Starter Pack)
					</div>
					<div
						style={{ fontSize: 13, color: "#888", display: "flex", gap: 24 }}
					>
						<span>March 12, 2026</span>
						<span>11:00AM – 01:00PM</span>
						<span>Vocal Booth add-on</span>
					</div>
				</div>
				<div style={{ display: "flex", alignItems: "center", gap: 20 }}>
					<span style={{ fontSize: 15, fontWeight: 500 }}>in 3 days</span>
					<button
						style={{
							background: "#e60000",
							color: "#fff",
							border: "none",
							padding: "12px 22px",
							fontWeight: 700,
							fontSize: 13,
							cursor: "pointer",
							borderRadius: 4,
							display: "flex",
							alignItems: "center",
							gap: 8,
						}}
					>
						View details →
					</button>
				</div>
			</div>

			{/* Order Summary */}
			<h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
				Order Summary
			</h2>
			<div
				style={{
					background: "#fff",
					border: "1px solid #eee",
					borderRadius: 8,
					marginBottom: 32,
				}}
			>
				{[
					{
						text: "Your content from the February 28 session is ready",
						extra: true,
						time: "2hrs ago",
					},
					{
						text: "Booking confirmed - Digital Room (March 12)",
						time: "3 days ago",
					},
					{ text: "Invoice #INV-0051 paid - $152", time: "3 days ago" },
				].map((item, i) => (
					<div
						key={i}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							padding: "18px 24px",
							borderBottom: i < 2 ? "1px solid #f0f0f0" : "none",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: 14,
								fontSize: 14,
							}}
						>
							{item.text}
							{item.extra && (
								<button
									style={{
										border: "1px solid #e60000",
										color: "#e60000",
										background: "transparent",
										padding: "4px 14px",
										fontSize: 12,
										fontWeight: 600,
										cursor: "pointer",
										borderRadius: 4,
									}}
								>
									View in vault →
								</button>
							)}
						</div>
						<span
							style={{
								fontSize: 13,
								color: "#aaa",
								whiteSpace: "nowrap",
								marginLeft: 24,
							}}
						>
							{item.time}
						</span>
					</div>
				))}
			</div>

			{/* Recent Content */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 16,
				}}
			>
				<h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
					Recent Content
				</h2>
				<button
					style={{
						border: "1px solid #e60000",
						color: "#e60000",
						background: "transparent",
						padding: "6px 16px",
						fontSize: 12,
						fontWeight: 600,
						cursor: "pointer",
						borderRadius: 4,
					}}
				>
					View vault →
				</button>
			</div>
			<div
				style={{
					background: "#fff",
					border: "1px solid #eee",
					borderRadius: 8,
				}}
			>
				{recentFiles.map((f, i) => (
					<div
						key={i}
						style={{
							display: "flex",
							alignItems: "center",
							padding: "16px 24px",
							borderBottom:
								i < recentFiles.length - 1 ? "1px solid #f0f0f0" : "none",
							gap: 16,
						}}
					>
						<div
							style={{
								width: 42,
								height: 42,
								borderRadius: "50%",
								background: "#fff0f0",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "#e60000",
								flexShrink: 0,
							}}
						>
							<IconMusic />
						</div>
						<div style={{ flex: 1 }}>
							<div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
								{f.name}
							</div>
							<div
								style={{
									fontSize: 12,
									color: "#aaa",
									display: "flex",
									gap: 16,
								}}
							>
								<span>{f.date}</span>
								<span>{f.size}</span>
								<span>{f.type}</span>
								{f.room && <span>{f.room}</span>}
							</div>
						</div>
						{f.isNew && (
							<span
								style={{
									border: "1px solid #22c55e",
									color: "#22c55e",
									fontSize: 11,
									fontWeight: 700,
									padding: "3px 10px",
									borderRadius: 20,
								}}
							>
								NEW
							</span>
						)}
						<button
							style={{
								display: "flex",
								alignItems: "center",
								gap: 8,
								background: "transparent",
								border: "none",
								cursor: "pointer",
								fontSize: 14,
								fontWeight: 600,
								color: "#222",
							}}
						>
							{f.action === "Download" ? (
								<>
									<span>Download</span>
									<IconDownload />
								</>
							) : (
								<>
									<span>Play</span>
									<IconPlay />
								</>
							)}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
