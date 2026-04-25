"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import { fetchInvoices } from "../../lib/redux/slices/invoicesSlice";

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

export default function InvoicesPage() {
	const dispatch = useAppDispatch();
	const { list, status, error } = useAppSelector((state) => state.invoices);
	console.log("invoice", list);

	useEffect(() => {
		dispatch(fetchInvoices());
	}, [dispatch]);

	return (
		<div style={{ padding: "40px 48px" }}>
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
				<h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Receipts</h1>
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
					RECEIPTS
				</h2>

				{status === "loading" && (
					<p
						style={{
							fontSize: 14,
							color: "#aaa",
							textAlign: "center",
							padding: "40px 0",
						}}
					>
						Loading invoices…
					</p>
				)}

				{status === "failed" && (
					<p
						style={{
							fontSize: 14,
							color: "#e60000",
							textAlign: "center",
							padding: "40px 0",
						}}
					>
						{error}
					</p>
				)}

				{status === "succeeded" && list.length === 0 && (
					<p
						style={{
							fontSize: 14,
							color: "#aaa",
							textAlign: "center",
							padding: "40px 0",
						}}
					>
						No invoices found.
					</p>
				)}

				{status === "succeeded" && list.length > 0 && (
					<table
						style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
					>
						<thead>
							<tr style={{ borderBottom: "1px solid #eee" }}>
								{["INVOICE", "DATE", "BOOKING", "AMOUNT", "STATUS", ""].map(
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
							{list.map((inv, i) => (
								<tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
									<td style={{ padding: "15px 12px", fontWeight: 500 }}>
										{inv.id}
									</td>
									<td style={{ padding: "15px 12px", color: "#555" }}>
										{formatDate(inv.date)}
									</td>
									<td style={{ padding: "15px 12px" }}>{inv.desc}</td>
									<td style={{ padding: "15px 12px", fontWeight: 600 }}>
										{formatAmount(inv.amount as unknown as number)}
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
											• {inv.status?.toUpperCase()}
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
				)}
			</div>
		</div>
	);
}
