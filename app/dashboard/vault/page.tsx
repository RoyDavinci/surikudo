"use client";
import { useState } from "react";

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
		width='14'
		height='14'
	>
		<polygon points='5 3 19 12 5 21 5 3' />
	</svg>
);
const IconSearch = () => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		width='15'
		height='15'
	>
		<circle cx='11' cy='11' r='8' />
		<path d='M21 21l-4.35-4.35' />
	</svg>
);

type FilterType = "ALL" | "UPCOMING" | "PAST";

const tagStyles: Record<string, { bg: string; color: string; border: string }> =
	{
		PREVIEW: { bg: "#f0f4ff", color: "#3b5bdb", border: "#c5d0fa" },
		FINAL: { bg: "#f0fff4", color: "#2f9e44", border: "#b2f2bb" },
		STEMS: { bg: "#fff9f0", color: "#e67700", border: "#ffd8a8" },
	};

const files = [
	{
		name: "Session_Feb28_Final_Mix.wav",
		date: "Feb 28, 2026",
		size: "48MB",
		type: "Preview",
		room: "Digital Room",
		tracks: null,
	},
	{
		name: "Session_Feb28_Final_Mix.wav",
		date: "Feb 28, 2026",
		size: "48MB",
		type: "Final",
		room: "Digital Room",
		tracks: null,
	},
	{
		name: "Session_Feb28_Final_Mix.wav",
		date: "Feb 28, 2026",
		size: "48MB",
		type: "Final",
		room: "Digital Room",
		tracks: null,
	},
	{
		name: "Session_Feb28_Final_Mix.wav",
		date: "Feb 28, 2026",
		size: "48MB",
		type: "Preview",
		room: "Digital Room",
		tracks: null,
	},
	{
		name: "Session_Feb28_Final_Mix.wav",
		date: "Feb 28, 2026",
		size: "320MB",
		type: "Stems",
		room: null,
		tracks: "14 tracks",
	},
];

export default function VaultPage() {
	const [filter, setFilter] = useState<FilterType>("ALL");
	const [search, setSearch] = useState("");

	const filtered = files.filter((f) => {
		const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
		return matchesSearch;
	});

	const usedGB = 1.5;
	const totalGB = 5;
	const pct = (usedGB / totalGB) * 100;

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
				<h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Vault</h1>
			</div>

			{/* Storage bar */}
			<div
				style={{
					background: "#fff",
					border: "1px solid #eee",
					borderRadius: 8,
					padding: "20px 28px",
					marginBottom: 32,
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 10,
					}}
				>
					<span style={{ fontSize: 14, fontWeight: 600 }}>Storage Used</span>
					<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
						<span style={{ fontSize: 14, fontWeight: 700 }}>
							{usedGB}GB of {totalGB}GB
						</span>
						<button
							style={{
								background: "#e60000",
								color: "#fff",
								border: "none",
								padding: "8px 18px",
								fontSize: 12,
								fontWeight: 700,
								cursor: "pointer",
								borderRadius: 4,
								display: "flex",
								alignItems: "center",
								gap: 6,
							}}
						>
							Upgrade →
						</button>
					</div>
				</div>
				{/* Progress bar */}
				<div
					style={{
						height: 6,
						background: "#eee",
						borderRadius: 3,
						overflow: "hidden",
					}}
				>
					<div
						style={{
							width: `${pct}%`,
							height: "100%",
							background: "#e60000",
							borderRadius: 3,
						}}
					/>
				</div>
			</div>

			{/* Recent Content header */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 20,
				}}
			>
				<h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
					Recent Content
				</h2>
				<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
					{/* Search */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							background: "#fff",
							border: "1px solid #eee",
							borderRadius: 6,
							padding: "8px 14px",
						}}
					>
						<IconSearch />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder='Search files...'
							style={{
								border: "none",
								outline: "none",
								fontSize: 13,
								color: "#555",
								background: "transparent",
								width: 160,
							}}
						/>
					</div>
					{/* Filter tabs */}
					<div style={{ display: "flex", gap: 2 }}>
						{(["ALL", "UPCOMING", "PAST"] as FilterType[]).map((f) => (
							<button
								key={f}
								onClick={() => setFilter(f)}
								style={{
									padding: "7px 14px",
									fontSize: 12,
									fontWeight: 700,
									border: "none",
									cursor: "pointer",
									borderRadius: 3,
									background: filter === f ? "#e60000" : "transparent",
									color: filter === f ? "#fff" : "#888",
								}}
							>
								{f}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* File list */}
			<div
				style={{
					background: "#fff",
					border: "1px solid #eee",
					borderRadius: 8,
				}}
			>
				{filtered.map((f, i) => {
					const tag = f.type.toUpperCase() as keyof typeof tagStyles;
					const style = tagStyles[tag] ?? tagStyles["FINAL"];
					return (
						<div
							key={i}
							style={{
								display: "flex",
								alignItems: "center",
								padding: "18px 24px",
								borderBottom:
									i < filtered.length - 1 ? "1px solid #f0f0f0" : "none",
								gap: 16,
							}}
						>
							{/* Icon */}
							<div
								style={{
									width: 44,
									height: 44,
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

							{/* Info */}
							<div style={{ flex: 1 }}>
								<div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
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
									{f.tracks && <span>{f.tracks}</span>}
								</div>
							</div>

							{/* Tag badge */}
							<span
								style={{
									background: style.bg,
									color: style.color,
									border: `1px solid ${style.border}`,
									padding: "4px 12px",
									borderRadius: 20,
									fontSize: 11,
									fontWeight: 700,
								}}
							>
								• {tag}
							</span>

							{/* Play button */}
							<button
								style={{
									display: "flex",
									alignItems: "center",
									gap: 6,
									border: "1px solid #e60000",
									color: "#e60000",
									background: "transparent",
									padding: "7px 16px",
									fontSize: 13,
									fontWeight: 700,
									cursor: "pointer",
									borderRadius: 4,
								}}
							>
								Play <IconPlay />
							</button>

							{/* Download button */}
							<button
								style={{
									background: "#e60000",
									color: "#fff",
									border: "none",
									width: 36,
									height: 36,
									borderRadius: 6,
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									flexShrink: 0,
								}}
							>
								<IconDownload />
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}
