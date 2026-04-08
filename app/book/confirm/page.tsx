"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";

function generateBookingId(): string {
	const now = new Date();
	const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	const num = Math.floor(1000 + Math.random() * 9000);
	return `SS-${date}-${num}`;
}

function BookingConfirmPage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const studioName = searchParams.get("studioName") ?? "";
	const packageName = searchParams.get("packageName") ?? "";
	const unit = searchParams.get("unit") ?? "";
	const date = searchParams.get("date") ?? "";
	const time = searchParams.get("time") ?? "";
	const endTime = searchParams.get("endTime") ?? "";
	const total = searchParams.get("total") ?? "0";
	const addons = searchParams.get("addons") ?? ""; // comma-separated addon names
	const email = searchParams.get("email") ?? "";

	const [bookingId] = useState(() => generateBookingId());

	const handleDownloadReceipt = () => {
		// Wire up real PDF receipt generation here
		alert("Downloading receipt…");
	};

	const handleAddToCalendar = () => {
		// Wire up Google Calendar / iCal export here
		alert("Adding to calendar…");
	};

	const timeDisplay =
		time && endTime ? `${time.replace(" ", "")}–${endTime}` : "";
	const dateTimeDisplay =
		[date, timeDisplay].filter(Boolean).join(" (") + (timeDisplay ? ")" : "");

	return (
		<main className='min-h-screen bg-gray-50'>
			{/* Nav */}
			<nav className='bg-white border-b border-gray-100 px-6 py-3'>
				<div className='max-w-3xl mx-auto flex items-center gap-2 text-sm text-gray-500'>
					<span className='w-3 h-3 bg-red-600 rounded-full inline-block' />
					<span className='text-gray-900 font-medium'>Studio/{studioName}</span>
				</div>
			</nav>

			<div className='max-w-xl mx-auto px-6 py-14 flex flex-col items-center gap-6'>
				{/* Icon */}
				<div className='w-16 h-16 rounded-full border-2 border-green-400 flex items-center justify-center bg-white'>
					<svg
						className='w-7 h-7 text-green-500'
						fill='none'
						stroke='currentColor'
						strokeWidth={2.5}
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M5 13l4 4L19 7'
						/>
					</svg>
				</div>

				{/* Heading */}
				<div className='text-center'>
					<p className='text-red-600 text-xs font-bold uppercase tracking-widest mb-2'>
						Booking Confirmed
					</p>
					<h1 className='text-3xl font-black text-gray-950 mb-3'>
						You are all set!
					</h1>
					<p className='text-gray-500 text-sm font-mono'>
						ID: &nbsp;&nbsp;{bookingId}
					</p>
				</div>

				{/* Booking details card */}
				<div className='w-full bg-white border border-gray-200 rounded-xl p-6'>
					<div className='flex flex-col gap-3 text-sm'>
						{[
							{ label: "Service", value: studioName },
							{
								label: "Bundle",
								value: `${packageName}${unit ? ` (${unit})` : ""}`,
							},
							{ label: "Date & Time", value: dateTimeDisplay || "—" },
							{ label: "Add-ons", value: addons || "None" },
							{ label: "Paid", value: `$${total}` },
						].map(({ label, value }) => (
							<div key={label} className='flex justify-between items-start'>
								<span className='text-gray-400'>{label}</span>
								<span className='font-bold text-gray-900 text-right max-w-[60%]'>
									{value}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Status checks */}
				<div className='w-full flex flex-col gap-2'>
					{[
						email ? `Confirmation sent to ${email}` : "Confirmation email sent",
						"Client account and vault created",
					].map((msg) => (
						<div
							key={msg}
							className='flex items-center gap-2 text-sm text-gray-600'
						>
							<div className='w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center shrink-0'>
								<svg
									className='w-3 h-3 text-white'
									fill='none'
									stroke='currentColor'
									strokeWidth={3}
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M5 13l4 4L19 7'
									/>
								</svg>
							</div>
							<span>{msg}</span>
						</div>
					))}
				</div>

				{/* Primary CTAs */}
				<div className='flex gap-3 w-full'>
					<Link
						href='/portal'
						className='flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded text-sm transition-colors flex items-center justify-center gap-2'
					>
						Go to Client Portal →
					</Link>
					<button
						onClick={handleDownloadReceipt}
						className='flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded text-sm transition-colors flex items-center justify-center gap-2'
					>
						Download Receipt ↓
					</button>
				</div>

				{/* Add to calendar */}
				<button
					onClick={handleAddToCalendar}
					className='flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 rounded-lg px-5 py-2.5 bg-white hover:border-gray-400'
				>
					Add to Calendar +
				</button>
			</div>
		</main>
	);
}

export default function BookingConfirmPageWrapper() {
	return (
		<Suspense
			fallback={
				<div className='min-h-screen flex items-center justify-center text-gray-400 text-sm'>
					Loading…
				</div>
			}
		>
			<BookingConfirmPage />
		</Suspense>
	);
}
