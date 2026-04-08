"use client";
import { useState } from "react";

const IconCheck = () => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2.5'
		width='14'
		height='14'
	>
		<polyline points='20 6 9 17 4 12' />
	</svg>
);
const IconX = () => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2.5'
		width='14'
		height='14'
	>
		<line x1='18' y1='6' x2='6' y2='18' />
		<line x1='6' y1='6' x2='18' y2='18' />
	</svg>
);

const plans = [
	{
		name: "Essential Plan",
		monthlyPrice: 500,
		annualPrice: 420,
		desc: "A perfect starter package for those looking to refresh their space with expert guidance.",
		features: [
			{ ok: true, text: "50gb Storage" },
			{ ok: true, text: "1 week retention" },
			{ ok: true, text: "Email support throughout the project" },
			{ ok: true, text: "Two monthly revisions" },
			{ ok: false, text: "Ocassional Offers" },
			{ ok: false, text: "Client Sharing Links" },
			{ ok: false, text: "Extended studio hours access" },
			{ ok: false, text: "Unlimited master revision" },
		],
		cta: "Get started",
		highlight: false,
	},
	{
		name: "Premium Plan",
		monthlyPrice: 1500,
		annualPrice: 1260,
		badge: "Most popular",
		desc: "A complete design solution for transforming your space into a stylish and functional haven.",
		features: [
			{ ok: true, text: "100gb Storage" },
			{ ok: true, text: "1 month retention" },
			{ ok: true, text: "Personalized color palette selection" },
			{ ok: true, text: "Project collaboration tools" },
			{ ok: true, text: "Occasional Offers" },
			{ ok: true, text: "Client Sharing Links" },
			{ ok: false, text: "Extended studio hours access" },
			{ ok: false, text: "Unlimited master revision" },
		],
		cta: "Subscribe",
		highlight: true,
	},
	{
		name: "Luxury Plan",
		monthlyPrice: 3000,
		annualPrice: 2520,
		desc: "Our all-inclusive package for those seeking a luxurious, tailored design experience.",
		features: [
			{ ok: true, text: "1 Terabyte Storage" },
			{ ok: true, text: "Lifetime access to project files" },
			{ ok: true, text: "Dedicated account manager" },
			{ ok: true, text: "Free monthly studio hours" },
			{ ok: true, text: "Revenue opportunities through talent marketplace" },
			{ ok: true, text: "Private events / networking" },
			{ ok: true, text: "Studio equipment reservation priority" },
			{ ok: true, text: "Unlimited master revision" },
		],
		cta: "Get started",
		highlight: false,
	},
];

export default function MembershipPage() {
	const [annual, setAnnual] = useState(true);

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
				<h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Membership</h1>
			</div>

			{/* Monthly / Annual toggle */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 14,
					marginBottom: 36,
				}}
			>
				<span
					style={{
						fontSize: 14,
						color: annual ? "#aaa" : "#222",
						fontWeight: annual ? 400 : 600,
					}}
				>
					Monthly
				</span>
				<button
					onClick={() => setAnnual(!annual)}
					style={{
						width: 44,
						height: 24,
						borderRadius: 12,
						background: "#e60000",
						border: "none",
						cursor: "pointer",
						position: "relative",
						display: "flex",
						alignItems: "center",
						padding: "0 3px",
						justifyContent: annual ? "flex-end" : "flex-start",
						transition: "justify-content 0.2s",
					}}
				>
					<div
						style={{
							width: 18,
							height: 18,
							borderRadius: "50%",
							background: "#fff",
						}}
					/>
				</button>
				<span
					style={{
						fontSize: 14,
						color: annual ? "#222" : "#aaa",
						fontWeight: annual ? 600 : 400,
					}}
				>
					Annually
				</span>
			</div>

			{/* Plan cards */}
			<div
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}
			>
				{plans.map((plan) => {
					const price = annual ? plan.annualPrice : plan.monthlyPrice;
					return (
						<div
							key={plan.name}
							style={{
								background: "#fff",
								border: plan.highlight
									? "2px solid #e60000"
									: "1px solid #e5e5e5",
								borderRadius: 10,
								padding: "28px 24px",
								boxShadow: plan.highlight
									? "0 4px 24px rgba(230,0,0,0.1)"
									: "none",
							}}
						>
							{/* Plan name + badge */}
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 10,
									marginBottom: 10,
								}}
							>
								<h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
									{plan.name}
								</h3>
								{plan.badge && (
									<span
										style={{
											background: "#e60000",
											color: "#fff",
											fontSize: 10,
											fontWeight: 700,
											padding: "3px 8px",
											borderRadius: 4,
										}}
									>
										{plan.badge}
									</span>
								)}
							</div>

							<p
								style={{
									fontSize: 13,
									color: "#777",
									marginBottom: 20,
									lineHeight: 1.5,
								}}
							>
								{plan.desc}
							</p>

							{/* Price */}
							<div style={{ marginBottom: 20 }}>
								<span
									style={{
										fontSize: 44,
										fontWeight: 800,
										letterSpacing: "-0.02em",
									}}
								>
									{price.toLocaleString()}
								</span>
								<span style={{ fontSize: 16, color: "#888" }}>€</span>
								<span style={{ fontSize: 13, color: "#888" }}>/month</span>
							</div>

							{/* Features */}
							<div
								style={{
									borderTop: "1px solid #f0f0f0",
									paddingTop: 20,
									marginBottom: 24,
								}}
							>
								{plan.features.map((f, i) => (
									<div
										key={i}
										style={{
											display: "flex",
											alignItems: "center",
											gap: 10,
											marginBottom: 10,
											opacity: f.ok ? 1 : 0.45,
										}}
									>
										<span
											style={{
												color: f.ok ? "#22c55e" : "#aaa",
												flexShrink: 0,
											}}
										>
											{f.ok ? <IconCheck /> : <IconX />}
										</span>
										<span
											style={{ fontSize: 13, color: f.ok ? "#333" : "#aaa" }}
										>
											{f.text}
										</span>
									</div>
								))}
							</div>

							{/* CTA */}
							<button
								style={{
									width: "100%",
									padding: "14px",
									border: plan.highlight ? "none" : "1px solid #ddd",
									background: plan.highlight ? "#e60000" : "transparent",
									color: plan.highlight ? "#fff" : "#333",
									fontWeight: 700,
									fontSize: 14,
									cursor: "pointer",
									borderRadius: 6,
								}}
							>
								{plan.cta}
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}
