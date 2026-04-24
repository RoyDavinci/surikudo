/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import { fetchUpcomingBookings } from "../../lib/redux/slices/bookingSlice";

type FilterType = "ALL" | "UPCOMING" | "PAID" | "UNPAID";

const statusStyles: Record<string, { bg: string; color: string }> = {
	UPCOMING: { bg: "#fff3cd", color: "#856404" },
	COMPLETED: { bg: "#d4edda", color: "#155724" },
	CANCELLED: { bg: "#f8d7da", color: "#721c24" },
	DRAFT: { bg: "#e2e3e5", color: "#383d41" },
};

const paymentStyles: Record<string, { bg: string; color: string }> = {
	Paid: { bg: "#d4edda", color: "#155724" },
	Unpaid: { bg: "#f8d7da", color: "#721c24" },
};

function formatDate(datetime: string): string {
	if (!datetime) return "—";
	return new Date(datetime).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function formatTime(datetime: string): string {
	if (!datetime) return "";
	return new Date(datetime).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
	return (
		<tr className='border-b border-gray-50'>
			{Array.from({ length: 8 }).map((_, i) => (
				<td key={i} className='px-3 py-4'>
					<div className='h-3 bg-gray-100 rounded animate-pulse w-full max-w-[80px]' />
				</td>
			))}
		</tr>
	);
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
	booking,
	onClose,
}: {
	booking: any;
	onClose: () => void;
}) {
	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className='bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative'>
				<button
					onClick={onClose}
					className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl'
				>
					✕
				</button>

				<div className='flex items-center gap-2 mb-6'>
					<div className='w-1.5 h-1.5 rounded-full bg-red-600' />
					<h2 className='text-lg font-bold text-gray-900'>Booking Details</h2>
				</div>

				<div className='flex flex-col gap-3 text-sm'>
					{[
						{ label: "Booking ID", value: booking.name },
						{ label: "Service", value: booking.service ?? "—" },
						{ label: "Studio Room", value: booking.studio_room ?? "—" },
						{ label: "Date", value: formatDate(booking.start_datetime) },
						{ label: "Start Time", value: formatTime(booking.start_datetime) },
						{ label: "End Time", value: formatTime(booking.end_datetime) },
						{ label: "Duration", value: `${booking.duration_hours}h` },
						{ label: "Package", value: booking.package ?? "—" },
						{ label: "Bundle", value: booking.bundle ?? "—" },
						{
							label: "Total",
							value: `₦${(booking.total_amount ?? 0).toLocaleString()}`,
						},
						{ label: "Status", value: booking.status },
						{ label: "Payment", value: booking.payment_status },
					].map(({ label, value }) => (
						<div key={label} className='flex justify-between items-start'>
							<span className='text-gray-400 w-28 shrink-0'>{label}</span>
							<span className='font-semibold text-gray-900 text-right'>
								{value}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BookingsPage() {
	const dispatch = useAppDispatch();
	const { upcoming, status, error } = useAppSelector((s) => s.bookings);

	const [filter, setFilter] = useState<FilterType>("ALL");
	const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

	useEffect(() => {
		dispatch(fetchUpcomingBookings());
	}, [dispatch]);

	const filtered = (upcoming ?? []).filter((b: any) => {
		if (filter === "ALL") return true;
		if (filter === "UPCOMING") return b.status === "UPCOMING";
		if (filter === "PAID") return b.payment_status === "Paid";
		if (filter === "UNPAID") return b.payment_status === "Unpaid";
		return true;
	});

	const isLoading = status === "loading" || status === "idle";

	return (
		<div className='px-12 py-10'>
			{/* Detail Modal */}
			{selectedBooking && (
				<DetailModal
					booking={selectedBooking}
					onClose={() => setSelectedBooking(null)}
				/>
			)}

			{/* Page title */}
			<div className='flex items-center gap-2.5 mb-8'>
				<div className='w-1.5 h-1.5 rounded-full bg-red-600' />
				<h1 className='text-xl font-bold text-gray-900'>Bookings</h1>
			</div>

			<div className='bg-white border border-gray-100 rounded-xl p-7'>
				{/* Header row */}
				<div className='flex justify-between items-center mb-6'>
					<div>
						<h2 className='text-base font-bold text-gray-900'>My Bookings</h2>
						{!isLoading && (
							<p className='text-xs text-gray-400 mt-0.5'>
								{filtered.length} booking{filtered.length !== 1 ? "s" : ""}
							</p>
						)}
					</div>
					<div className='flex gap-1'>
						{(["ALL", "UPCOMING", "PAID", "UNPAID"] as FilterType[]).map(
							(f) => (
								<button
									key={f}
									onClick={() => setFilter(f)}
									className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
										filter === f
											? "bg-red-600 text-white"
											: "text-gray-400 hover:text-gray-700"
									}`}
								>
									{f}
								</button>
							),
						)}
					</div>
				</div>

				{/* Error */}
				{status === "failed" && (
					<p className='text-sm text-red-500 text-center py-8'>
						{error ?? "Failed to load bookings."}
					</p>
				)}

				{/* Table */}
				{status !== "failed" && (
					<div className='overflow-x-auto'>
						<table className='w-full text-sm border-collapse'>
							<thead>
								<tr className='border-b border-gray-100'>
									{[
										"DATE",
										"TIME",
										"SERVICE",
										"ROOM",
										"DURATION",
										"TOTAL",
										"PAYMENT",
										"STATUS",
										"",
									].map((h) => (
										<th
											key={h}
											className='px-3 py-2.5 text-left text-xs font-semibold text-gray-400 tracking-wider whitespace-nowrap'
										>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{isLoading ? (
									Array.from({ length: 5 }).map((_, i) => (
										<SkeletonRow key={i} />
									))
								) : filtered.length === 0 ? (
									<tr>
										<td
											colSpan={9}
											className='text-center text-gray-400 text-sm py-16'
										>
											No bookings found.
										</td>
									</tr>
								) : (
									filtered.map((b: any) => {
										const statusStyle =
											statusStyles[b.status] ?? statusStyles.DRAFT;
										const payStyle =
											paymentStyles[b.payment_status] ?? paymentStyles.Unpaid;

										return (
											<tr
												key={b.name}
												className='border-b border-gray-50 hover:bg-gray-50/50 transition-colors'
											>
												<td className='px-3 py-4 font-medium text-gray-900 whitespace-nowrap'>
													{formatDate(b.start_datetime)}
												</td>
												<td className='px-3 py-4 text-gray-500 whitespace-nowrap'>
													{formatTime(b.start_datetime)}
												</td>
												<td className='px-3 py-4 text-gray-700 whitespace-nowrap'>
													{b.service ?? "—"}
												</td>
												<td className='px-3 py-4 text-gray-500 whitespace-nowrap'>
													{b.studio_room ?? "—"}
												</td>
												<td className='px-3 py-4 text-gray-700'>
													{b.duration_hours}h
												</td>
												<td className='px-3 py-4 font-bold text-gray-900'>
													₦{(b.total_amount ?? 0).toLocaleString()}
												</td>
												<td className='px-3 py-4'>
													<span
														className='px-2.5 py-1 rounded text-xs font-bold border whitespace-nowrap'
														style={payStyle}
													>
														{b.payment_status}
													</span>
												</td>
												<td className='px-3 py-4'>
													<span
														className='px-2.5 py-1 rounded text-xs font-bold border whitespace-nowrap'
														style={statusStyle}
													>
														• {b.status}
													</span>
												</td>
												<td className='px-3 py-4'>
													<button
														onClick={() => setSelectedBooking(b)}
														className='bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded transition-colors whitespace-nowrap'
													>
														Details →
													</button>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
