"use client";
import { useState } from "react";

type NotifChannel = "EMAIL" | "SMS" | "BOTH";

export default function AccountSettingsPage() {
	const [displayName, setDisplayName] = useState("@roydavinci");
	const [fullName, setFullName] = useState("Roy Mathias");
	const [email, setEmail] = useState(() => {
		if (typeof window === "undefined") return "";
		return localStorage.getItem("userEmail") || "emsthias33@gmail.com";
	});
	const [phone, setPhone] = useState("9159403602");
	const [saved, setSaved] = useState(false);

	const [notifs, setNotifs] = useState<Record<string, NotifChannel>>({
		"Content Ready": "EMAIL",
		"Booking Reminders": "EMAIL",
		"Marketing & Promos": "EMAIL",
	});

	// useEffect(() => {
	// 	setEmail(localStorage.getItem("userEmail") || "emsthias33@gmail.com");
	// }, []);

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		setSaved(true);
		setTimeout(() => setSaved(false), 2500);
	};

	const setNotifChannel = (key: string, channel: NotifChannel) => {
		setNotifs((prev) => ({ ...prev, [key]: channel }));
	};

	const inputStyle = {
		width: "100%",
		padding: "13px 14px",
		border: "1px solid #e5e5e5",
		borderRadius: 6,
		fontSize: 14,
		color: "#333",
		outline: "none",
		background: "#fff",
		boxSizing: "border-box" as const,
	};
	const labelStyle = {
		fontSize: 13,
		fontWeight: 600,
		color: "#222",
		display: "block" as const,
		marginBottom: 8,
	};

	return (
		<div style={{ padding: "40px 48px" }}>
			{/* Page title */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 10,
					marginBottom: 36,
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
				<h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
					Account Settings
				</h1>
			</div>

			{/* Profile form */}
			<div
				style={{
					background: "#fff",
					border: "1px solid #eee",
					borderRadius: 10,
					padding: "32px",
					maxWidth: 540,
					marginBottom: 28,
				}}
			>
				<form
					onSubmit={handleSave}
					style={{ display: "flex", flexDirection: "column", gap: 22 }}
				>
					{/* Display Name */}
					<div>
						<label style={labelStyle}>Display Name</label>
						<input
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							style={inputStyle}
							placeholder='@username'
						/>
					</div>

					{/* Full Name */}
					<div>
						<label style={labelStyle}>Full Name</label>
						<input
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							style={inputStyle}
							placeholder='Your full name'
						/>
					</div>

					{/* Email */}
					<div>
						<label style={labelStyle}>Email</label>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							style={inputStyle}
							placeholder='your@email.com'
						/>
					</div>

					{/* Phone */}
					<div>
						<label style={labelStyle}>Phone Number</label>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								border: "1px solid #e5e5e5",
								borderRadius: 6,
								overflow: "hidden",
							}}
						>
							<span
								style={{
									padding: "13px 14px",
									fontSize: 14,
									color: "#e60000",
									fontWeight: 600,
									borderRight: "1px solid #e5e5e5",
									background: "#fff",
									whiteSpace: "nowrap",
								}}
							>
								+234
							</span>
							<input
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								style={{ ...inputStyle, border: "none", borderRadius: 0 }}
								placeholder='8000000000'
							/>
						</div>
					</div>

					{/* Save */}
					<button
						type='submit'
						style={{
							background: "#e60000",
							color: "#fff",
							border: "none",
							padding: "15px",
							fontWeight: 700,
							fontSize: 14,
							cursor: "pointer",
							borderRadius: 6,
							marginTop: 4,
							transition: "background 0.2s",
						}}
					>
						{saved ? "Saved ✓" : "Save Profile"}
					</button>
				</form>
			</div>

			{/* Notification preferences */}
			<div
				style={{
					background: "#fff",
					border: "1px solid #eee",
					borderRadius: 10,
					padding: "28px",
					maxWidth: 540,
				}}
			>
				{Object.entries(notifs).map(([key, active], i, arr) => (
					<div
						key={key}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							paddingBottom: i < arr.length - 1 ? 22 : 0,
							marginBottom: i < arr.length - 1 ? 22 : 0,
							borderBottom: i < arr.length - 1 ? "1px solid #f5f5f5" : "none",
						}}
					>
						<span style={{ fontSize: 14, fontWeight: 500 }}>{key}</span>
						<div style={{ display: "flex", gap: 4 }}>
							{(["EMAIL", "SMS", "BOTH"] as NotifChannel[]).map((ch) => (
								<button
									key={ch}
									onClick={() => setNotifChannel(key, ch)}
									style={{
										padding: "6px 14px",
										fontSize: 12,
										fontWeight: 700,
										border: "none",
										cursor: "pointer",
										borderRadius: 3,
										background: active === ch ? "#e60000" : "transparent",
										color: active === ch ? "#fff" : "#aaa",
									}}
								>
									{ch}
								</button>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
