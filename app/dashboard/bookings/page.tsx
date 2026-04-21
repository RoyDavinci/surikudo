"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import {
	fetchUpcomingBookings,
	fetchPreviousBookings,
} from "../../lib/redux/slices/bookingSlice";

type FilterType = "ALL" | "UPCOMING" | "PAST";

const bookings = [
	{
		date: "Mar 12, 2026",
		studio: "Digital",
		bundle: "Starter",
		duration: "2hrs",
		addons: "Vocal Booth",
		total: "$152",
		status: "UPCOMING",
	},
	{
		date: "Feb 28, 2026",
		studio: "Digital",
		bundle: "Pro Session",
		duration: "4hrs",
		addons: "Engineer",
		total: "$280",
		status: "COMPLETE",
	},
	{
		date: "Jan 15, 2026",
		studio: "Podcast",
		bundle: "Starter",
		duration: "2hrs",
		addons: "-",
		total: "$100",
		status: "COMPLETE",
	},
	{
		date: "Dec 4, 2025",
		studio: "Dolby",
		bundle: "Full Day",
		duration: "8hrs",
		addons: "Engineer",
		total: "$480",
		status: "COMPLETE",
	},
];

const statusStyles: Record<string, { bg: string; color: string }> = {
	UPCOMING: { bg: "#fff3cd", color: "#856404" },
	COMPLETE: { bg: "#d4edda", color: "#155724" },
};

export default function BookingsPage() {
	const [filter, setFilter] = useState<FilterType>("ALL");

	const dispatch = useAppDispatch();
	const { upcoming, previous, status, error } = useAppSelector(
		(state) => state.bookings,
	);

	const filtered = bookings.filter((b) => {
		if (filter === "ALL") return true;
		if (filter === "UPCOMING") return b.status === "UPCOMING";
		if (filter === "PAST") return b.status === "COMPLETE";
		return true;
	});
	useEffect(() => {
		dispatch(fetchUpcomingBookings());
		dispatch(fetchPreviousBookings());
	}, [dispatch]);

	// Log to console so you can inspect the real response shape
	useEffect(() => {
		if (status === "succeeded") {
			console.log("Upcoming:", upcoming);
			console.log("Previous:", previous);
		}
	}, [status, upcoming, previous]);

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
				<h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Bookings</h1>
			</div>

			<div
				style={{
					background: "#fff",
					border: "1px solid #eee",
					borderRadius: 8,
					padding: "28px",
				}}
			>
				{/* Header row */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 24,
					}}
				>
					<h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
						My Bookings
					</h2>
					<div style={{ display: "flex", gap: 4 }}>
						{(["ALL", "UPCOMING", "PAST"] as FilterType[]).map((f) => (
							<button
								key={f}
								onClick={() => setFilter(f)}
								style={{
									padding: "6px 14px",
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

				{/* Table */}
				<table
					style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
				>
					<thead>
						<tr style={{ borderBottom: "1px solid #eee" }}>
							{[
								"DATE",
								"STUDIO",
								"BUNDLE",
								"DURATION",
								"ADD-ONS",
								"TOTAL",
								"STATUS",
								"",
							].map((h) => (
								<th
									key={h}
									style={{
										padding: "8px 12px",
										textAlign: "left",
										fontSize: 11,
										fontWeight: 600,
										color: "#aaa",
										letterSpacing: "0.05em",
									}}
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filtered.map((b, i) => (
							<tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
								<td style={{ padding: "16px 12px", fontWeight: 500 }}>
									{b.date}
								</td>
								<td style={{ padding: "16px 12px" }}>{b.studio}</td>
								<td style={{ padding: "16px 12px" }}>{b.bundle}</td>
								<td style={{ padding: "16px 12px" }}>{b.duration}</td>
								<td style={{ padding: "16px 12px" }}>{b.addons}</td>
								<td style={{ padding: "16px 12px", fontWeight: 600 }}>
									{b.total}
								</td>
								<td style={{ padding: "16px 12px" }}>
									<span
										style={{
											...statusStyles[b.status],
											padding: "4px 10px",
											borderRadius: 4,
											fontSize: 11,
											fontWeight: 700,
											border: `1px solid ${statusStyles[b.status].color}`,
										}}
									>
										• {b.status}
									</span>
								</td>
								<td style={{ padding: "16px 12px" }}>
									<button
										style={{
											background: "#e60000",
											color: "#fff",
											border: "none",
											padding: "8px 16px",
											fontSize: 12,
											fontWeight: 700,
											cursor: "pointer",
											borderRadius: 4,
										}}
									>
										Details →
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
