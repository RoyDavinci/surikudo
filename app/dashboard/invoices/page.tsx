"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../lib/redux/hooks";
import { fetchInvoices } from "../../../lib/redux/slices/invoicesSlice";

const IconDownload = () => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		width='14'
		height='14'
	>
		<path d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3' />
	</svg>
);

const invoices = [
	{
		id: "#IN-0051",
		date: "Mar 9, 2026",
		desc: "Digital Room · Starter Pack",
		amount: "$152.00",
	},
	{
		id: "#IN-0048",
		date: "Feb 25, 2026",
		desc: "Digital Room · Pro Session + Engineer",
		amount: "$280.00",
	},
	{
		id: "#IN-0048",
		date: "Feb 25, 2026",
		desc: "Digital Room · Pro Session + Engineer",
		amount: "$280.00",
	},
	{
		id: "#IN-0048",
		date: "Feb 25, 2026",
		desc: "Digital Room · Pro Session + Engineer",
		amount: "$280.00",
	},
	{
		id: "#INV-0039",
		date: "Jan 12, 2025",
		desc: "Podcast Studio · Starter",
		amount: "$100.00",
	},
	{
		id: "#INV-0039",
		date: "Jan 12, 2025",
		desc: "Podcast Studio · Starter",
		amount: "$100.00",
	},
	{
		id: "#INV-0039",
		date: "Jan 12, 2025",
		desc: "Podcast Studio · Starter",
		amount: "$100.00",
	},
	{
		id: "#INV-0039",
		date: "Jan 12, 2025",
		desc: "Podcast Studio · Starter",
		amount: "$100.00",
	},
	{
		id: "#INV-0028",
		date: "Dec 1, 2024",
		desc: "Dolby Atmos · Full Day",
		amount: "$240.00",
	},
];

export default function InvoicesPage() {
	const dispatch = useAppDispatch();
	const { list, status, error } = useAppSelector((state) => state.invoices);

	useEffect(() => {
		dispatch(fetchInvoices());
	}, [dispatch]);

	// Inspect real response shape before swapping out static data
	useEffect(() => {
		if (status === "succeeded") {
			console.log("Invoices from API:", list);
		}
		if (status === "failed") {
			console.error("Invoices error:", error);
		}
	}, [status, list, error]);
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
				<h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Invoices</h1>
			</div>

			<div
				style={{
					background: "#fff",
					border: "1px solid #eee",
					borderRadius: 8,
					padding: "28px",
				}}
			>
				<h2
					style={{
						fontSize: 15,
						fontWeight: 800,
						letterSpacing: "0.06em",
						textTransform: "uppercase",
						marginBottom: 20,
					}}
				>
					INVOICES
				</h2>

				<table
					style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
				>
					<thead>
						<tr style={{ borderBottom: "1px solid #eee" }}>
							{["INVOICE", "DATE", "DESCRIPTION", "AMOUNT", "STATUS", ""].map(
								(h) => (
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
								),
							)}
						</tr>
					</thead>
					<tbody>
						{invoices.map((inv, i) => (
							<tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
								<td style={{ padding: "15px 12px", fontWeight: 500 }}>
									{inv.id}
								</td>
								<td style={{ padding: "15px 12px", color: "#555" }}>
									{inv.date}
								</td>
								<td style={{ padding: "15px 12px" }}>{inv.desc}</td>
								<td style={{ padding: "15px 12px", fontWeight: 600 }}>
									{inv.amount}
								</td>
								<td style={{ padding: "15px 12px" }}>
									<span
										style={{
											border: "1px solid #22c55e",
											color: "#22c55e",
											padding: "4px 10px",
											borderRadius: 4,
											fontSize: 11,
											fontWeight: 700,
										}}
									>
										• PAID
									</span>
								</td>
								<td style={{ padding: "15px 12px" }}>
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
											display: "flex",
											alignItems: "center",
											gap: 6,
										}}
									>
										Download <IconDownload />
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
