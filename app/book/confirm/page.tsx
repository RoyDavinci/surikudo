"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/redux/hooks";
import {
	verifyPayment,
	resetFlow,
} from "../../lib/redux/slices/bookingFlowSlice";

function BookingConfirmPage() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const searchParams = useSearchParams();

	// Paystack appends both; trxref is the canonical one
	const reference =
		searchParams.get("trxref") ?? searchParams.get("reference") ?? "";

	const { verifyStatus, verifyError, verifiedBooking } = useAppSelector(
		(state) => state.bookingFlow,
	);

	// On mount, verify if we have a reference and haven't verified yet
	useEffect(() => {
		if (reference && verifyStatus === "idle") {
			dispatch(verifyPayment(reference));
		}
	}, [reference, verifyStatus, dispatch]);

	const handleGoToDashboard = () => {
		dispatch(resetFlow());
		router.push("/dashboard/bookings");
	};

	// ── Loading ──────────────────────────────────────────────────────────────
	if (verifyStatus === "idle" || verifyStatus === "loading") {
		return (
			<main className='min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4'>
				<div className='w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
				<p className='text-sm text-gray-400 animate-pulse'>
					Verifying your payment…
				</p>
			</main>
		);
	}

	// ── Error ────────────────────────────────────────────────────────────────
	if (verifyStatus === "failed") {
		return (
			<main className='min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4 px-6 text-center'>
				<div className='w-16 h-16 rounded-full border-2 border-red-300 flex items-center justify-center bg-white text-2xl'>
					✕
				</div>
				<h1 className='text-xl font-black text-gray-900'>
					Payment Verification Failed
				</h1>
				<p className='text-sm text-red-500 max-w-sm'>{verifyError}</p>
				<div className='flex gap-3 mt-2'>
					<button
						onClick={() => router.push("/book/addons")}
						className='bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded text-sm'
					>
						Try Again
					</button>
					<button
						onClick={() => router.push("/")}
						className='text-sm text-gray-400 hover:text-gray-600 px-4'
					>
						Return Home
					</button>
				</div>
			</main>
		);
	}

	// ── Success ──────────────────────────────────────────────────────────────
	// Parse start_datetime "2026-04-18 09:00:00" into readable parts
	const [datePart, timePart] = (verifiedBooking?.start_datetime ?? " ").split(
		" ",
	);
	const formattedDate = datePart
		? new Date(datePart + "T00:00:00").toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			})
		: "—";

	// Format time "09:00:00" → "9:00 AM"
	const formatTime = (t: string) => {
		if (!t) return "—";
		const [hStr, mStr] = t.split(":");
		let h = parseInt(hStr);
		const meridiem = h >= 12 ? "PM" : "AM";
		if (h === 0) h = 12;
		else if (h > 12) h -= 12;
		return `${h}:${mStr} ${meridiem}`;
	};

	const addonNames = verifiedBooking?.addons?.join(", ") || "None";

	return (
		<main className='min-h-screen bg-gray-50'>
			<nav className='bg-white border-b border-gray-100 px-6 py-3'>
				<div className='max-w-3xl mx-auto flex items-center gap-2 text-sm text-gray-500'>
					<span className='w-3 h-3 bg-red-600 rounded-full inline-block' />
					<span className='text-gray-900 font-medium'>
						Studio/{verifiedBooking?.studio_name ?? "—"}
					</span>
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

				<div className='text-center'>
					<p className='text-red-600 text-xs font-bold uppercase tracking-widest mb-2'>
						Booking Confirmed
					</p>
					<h1 className='text-3xl font-black text-gray-950 mb-3'>
						You are all set!
					</h1>
					{verifiedBooking?.booking_id && (
						<p className='text-gray-500 text-sm font-mono'>
							ID: {verifiedBooking.booking_id}
						</p>
					)}
				</div>

				{/* Details */}
				<div className='w-full bg-white border border-gray-200 rounded-xl p-6'>
					<div className='flex flex-col gap-3 text-sm'>
						{[
							{ label: "Service", value: verifiedBooking?.studio_name },
							{ label: "Package", value: verifiedBooking?.service_name },
							{ label: "Date", value: formattedDate },
							{ label: "Time", value: formatTime(timePart) },
							{
								label: "Duration",
								value: verifiedBooking?.duration
									? `${verifiedBooking.duration}h`
									: "—",
							},
							{ label: "Add-ons", value: addonNames },
							{ label: "Promo", value: verifiedBooking?.promo_code || "—" },
						].map(({ label, value }) => (
							<div key={label} className='flex justify-between items-start'>
								<span className='text-gray-400'>{label}</span>
								<span className='font-bold text-gray-900 text-right max-w-[60%]'>
									{value ?? "—"}
								</span>
							</div>
						))}
					</div>
				</div>

				<div className='flex gap-3 w-full'>
					<button
						onClick={handleGoToDashboard}
						className='flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded text-sm transition-colors flex items-center justify-center gap-2'
					>
						View My Bookings →
					</button>
					<button
						onClick={() => alert("Downloading receipt…")}
						className='flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded text-sm transition-colors'
					>
						Download Receipt ↓
					</button>
				</div>
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
