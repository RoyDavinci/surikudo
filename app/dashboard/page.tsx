/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { fetchInvoices } from "../lib/redux/slices/invoicesSlice";

// Helper functions from your InvoicesPage
function formatDate(raw: string) {
	if (!raw) return "—";
	return new Date(raw + "T00:00:00").toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function formatAmount(amount: number) {
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

export default function DashboardPage() {
	const dispatch = useAppDispatch();
	const { list, status } = useAppSelector((state) => state.invoices);

	const [name, setName] = useState(() => {
		if (typeof window === "undefined") return "";
		try {
			const raw = localStorage.getItem("auth_user");
			if (!raw) return "";
			const user = JSON.parse(raw);
			return user.full_name || user.customer?.first_name || user.email;
		} catch {
			return "";
		}
	});

	useEffect(() => {
		dispatch(fetchInvoices());
	}, [dispatch]);

	// Get only the first 3 invoices
	const recentInvoices = list.slice(0, 3);

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

			{name && (
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
					Welcome back, <strong style={{ color: "#e60000" }}>{name}</strong>
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
				<div style={{ flex: 1 }}>
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
						}}
					>
						View details →
					</button>
				</div>
			</div>

			{/* Recent Receipts Section */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 16,
				}}
			>
				<h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
					Recent Receipts
				</h2>
				<Link href='/dashboard/invoices'>
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
						View all →
					</button>
				</Link>
			</div>

			<div
				style={{
					background: "#fff",
					border: "1px solid #eee",
					borderRadius: 8,
					padding: "12px 0",
					marginBottom: 32,
				}}
			>
				{status === "loading" && (
					<p style={{ padding: "20px", fontSize: 14, color: "#aaa" }}>
						Loading...
					</p>
				)}

				{status === "succeeded" && recentInvoices.length > 0 ? (
					<table
						style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
					>
						<tbody>
							{recentInvoices.map((inv, i) => (
								<tr
									key={inv.id}
									style={{
										borderBottom:
											i < recentInvoices.length - 1
												? "1px solid #f5f5f5"
												: "none",
									}}
								>
									<td style={{ padding: "16px 24px", fontWeight: 600 }}>
										{inv.id}
									</td>
									<td style={{ padding: "16px 24px", color: "#555" }}>
										{formatDate(inv.date)}
									</td>
									<td style={{ padding: "16px 24px", color: "#888" }}>
										{inv.desc}
									</td>
									<td
										style={{
											padding: "16px 24px",
											fontWeight: 700,
											textAlign: "right",
										}}
									>
										{formatAmount(inv.amount as any)}
									</td>
									<td style={{ padding: "16px 24px", textAlign: "right" }}>
										<span
											style={{
												color: "#22c55e",
												fontSize: 11,
												fontWeight: 700,
											}}
										>
											• {inv.status?.toUpperCase()}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					status === "succeeded" && (
						<p style={{ padding: "20px", fontSize: 14, color: "#aaa" }}>
							No recent receipts.
						</p>
					)
				)}
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
				<Link href='/dashboard/vault'>
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
				</Link>
			</div>
		</div>
	);
}

// ("use client");
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
// import { fetchInvoices } from "../../lib/redux/slices/invoicesSlice";
// import { fetchUpcomingBookings } from "../../lib/redux/slices/bookingSlice";

// // --- Helpers ---
// function formatDate(datetime: string) {
// 	if (!datetime) return "—";
// 	return new Date(datetime).toLocaleDateString("en-US", {
// 		month: "short",
// 		day: "numeric",
// 		year: "numeric",
// 	});
// }

// function formatTime(datetime: string) {
// 	if (!datetime) return "";
// 	return new Date(datetime).toLocaleTimeString("en-US", {
// 		hour: "numeric",
// 		minute: "2-digit",
// 		hour12: true,
// 	});
// }

// function formatAmount(amount: number) {
// 	return new Intl.NumberFormat("en-NG", {
// 		style: "currency",
// 		currency: "NGN",
// 		minimumFractionDigits: 0,
// 		maximumFractionDigits: 0,
// 	}).format(amount);
// }

// // --- Detail Modal Component ---
// function DetailModal({
// 	booking,
// 	onClose,
// }: {
// 	booking: any;
// 	onClose: () => void;
// }) {
// 	return (
// 		<div
// 			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'
// 			onClick={(e) => e.target === e.currentTarget && onClose()}
// 		>
// 			<div className='bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative'>
// 				<button
// 					onClick={onClose}
// 					className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl'
// 				>
// 					✕
// 				</button>
// 				<div className='flex items-center gap-2 mb-6'>
// 					<div className='w-1.5 h-1.5 rounded-full bg-red-600' />
// 					<h2 className='text-lg font-bold text-gray-900'>Booking Details</h2>
// 				</div>
// 				<div className='flex flex-col gap-3 text-sm'>
// 					{[
// 						{ label: "Booking ID", value: booking.name },
// 						{ label: "Service", value: booking.service ?? "—" },
// 						{ label: "Studio Room", value: booking.studio_room ?? "—" },
// 						{ label: "Date", value: formatDate(booking.start_datetime) },
// 						{
// 							label: "Time",
// 							value: `${formatTime(booking.start_datetime)} – ${formatTime(booking.end_datetime)}`,
// 						},
// 						{
// 							label: "Total",
// 							value: `₦${(booking.total_amount ?? 0).toLocaleString()}`,
// 						},
// 						{ label: "Status", value: booking.status },
// 						{ label: "Payment", value: booking.payment_status },
// 					].map(({ label, value }) => (
// 						<div key={label} className='flex justify-between items-start'>
// 							<span className='text-gray-400 w-28 shrink-0'>{label}</span>
// 							<span className='font-semibold text-gray-900 text-right'>
// 								{value}
// 							</span>
// 						</div>
// 					))}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default function DashboardPage() {
// 	const dispatch = useAppDispatch();
// 	const { list: invoices, status: invStatus } = useAppSelector(
// 		(state) => state.invoices,
// 	);
// 	const { upcoming: bookings, status: bookStatus } = useAppSelector(
// 		(state) => state.bookings,
// 	);

// 	const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
// 	const [name, setName] = useState("");

// 	useEffect(() => {
// 		dispatch(fetchInvoices());
// 		dispatch(fetchUpcomingBookings());

// 		const raw = localStorage.getItem("auth_user");
// 		if (raw) {
// 			const user = JSON.parse(raw);
// 			setName(user.full_name || user.customer?.first_name || user.email);
// 		}
// 	}, [dispatch]);

// 	// Find the next upcoming session (closest to now)
// 	const nextSession = [...(bookings || [])]
// 		.filter((b) => new Date(b.start_datetime) >= new Date())
// 		.sort(
// 			(a, b) =>
// 				new Date(a.start_datetime).getTime() -
// 				new Date(b.start_datetime).getTime(),
// 		)[0];

// 	return (
// 		<div style={{ padding: "40px 48px" }}>
// 			{selectedBooking && (
// 				<DetailModal
// 					booking={selectedBooking}
// 					onClose={() => setSelectedBooking(null)}
// 				/>
// 			)}

// 			{/* Title */}
// 			<div
// 				style={{
// 					display: "flex",
// 					alignItems: "center",
// 					gap: 10,
// 					marginBottom: 32,
// 				}}
// 			>
// 				<div
// 					style={{
// 						width: 6,
// 						height: 6,
// 						borderRadius: "50%",
// 						background: "#e60000",
// 					}}
// 				/>
// 				<h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Dashboard</h1>
// 			</div>

// 			{name && (
// 				<div
// 					style={{
// 						background: "#fff9f9",
// 						border: "1px solid #fde",
// 						borderRadius: 6,
// 						padding: "14px 20px",
// 						marginBottom: 24,
// 						fontSize: 14,
// 						color: "#555",
// 					}}
// 				>
// 					Welcome back, <strong style={{ color: "#e60000" }}>{name}</strong>
// 				</div>
// 			)}

// 			{/* Dynamic Upcoming Session Card */}
// 			{nextSession ? (
// 				<div
// 					style={{
// 						background: "#fff",
// 						border: "1px solid #eee",
// 						borderRadius: 8,
// 						padding: "24px 28px",
// 						marginBottom: 32,
// 						display: "flex",
// 						alignItems: "center",
// 						justifyContent: "space-between",
// 					}}
// 				>
// 					<div>
// 						<div
// 							style={{
// 								color: "#e60000",
// 								fontSize: 13,
// 								fontWeight: 600,
// 								marginBottom: 6,
// 							}}
// 						>
// 							Upcoming Session
// 						</div>
// 						<div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
// 							{nextSession.service} ({nextSession.studio_room})
// 						</div>
// 						<div
// 							style={{ fontSize: 13, color: "#888", display: "flex", gap: 24 }}
// 						>
// 							<span>{formatDate(nextSession.start_datetime)}</span>
// 							<span>
// 								{formatTime(nextSession.start_datetime)} –{" "}
// 								{formatTime(nextSession.end_datetime)}
// 							</span>
// 							{nextSession.package && <span>{nextSession.package}</span>}
// 						</div>
// 					</div>
// 					<button
// 						onClick={() => setSelectedBooking(nextSession)}
// 						style={{
// 							background: "#e60000",
// 							color: "#fff",
// 							border: "none",
// 							padding: "12px 22px",
// 							fontWeight: 700,
// 							fontSize: 13,
// 							cursor: "pointer",
// 							borderRadius: 4,
// 						}}
// 					>
// 						View details →
// 					</button>
// 				</div>
// 			) : (
// 				bookStatus === "succeeded" && (
// 					<div
// 						style={{
// 							background: "#f9f9f9",
// 							border: "1px dashed #ddd",
// 							borderRadius: 8,
// 							padding: "30px",
// 							textAlign: "center",
// 							marginBottom: 32,
// 						}}
// 					>
// 						<p style={{ color: "#888", fontSize: 14, margin: 0 }}>
// 							No upcoming sessions scheduled.
// 						</p>
// 					</div>
// 				)
// 			)}

// 			{/* Recent Receipts Section */}
// 			<div
// 				style={{
// 					display: "flex",
// 					alignItems: "center",
// 					justifyContent: "space-between",
// 					marginBottom: 16,
// 				}}
// 			>
// 				<h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
// 					Recent Receipts
// 				</h2>
// 				<Link href='/invoices'>
// 					<button
// 						style={{
// 							border: "1px solid #e60000",
// 							color: "#e60000",
// 							background: "transparent",
// 							padding: "6px 16px",
// 							fontSize: 12,
// 							fontWeight: 600,
// 							cursor: "pointer",
// 							borderRadius: 4,
// 						}}
// 					>
// 						View all →
// 					</button>
// 				</Link>
// 			</div>

// 			<div
// 				style={{
// 					background: "#fff",
// 					border: "1px solid #eee",
// 					borderRadius: 8,
// 					padding: "12px 0",
// 					marginBottom: 32,
// 				}}
// 			>
// 				{invStatus === "succeeded" &&
// 					invoices.slice(0, 3).map((inv, i) => (
// 						<div
// 							key={inv.id}
// 							style={{
// 								display: "flex",
// 								alignItems: "center",
// 								justifyContent: "space-between",
// 								padding: "16px 24px",
// 								borderBottom: i < 2 ? "1px solid #f5f5f5" : "none",
// 							}}
// 						>
// 							<div style={{ display: "flex", gap: 20, fontSize: 14 }}>
// 								<span style={{ fontWeight: 600 }}>{inv.id}</span>
// 								<span style={{ color: "#888" }}>{formatDate(inv.date)}</span>
// 								<span style={{ color: "#555" }}>{inv.desc}</span>
// 							</div>
// 							<div style={{ fontWeight: 700 }}>
// 								{formatAmount(inv.amount as any)}
// 							</div>
// 						</div>
// 					))}
// 			</div>
// 		</div>
// 	);
// }
