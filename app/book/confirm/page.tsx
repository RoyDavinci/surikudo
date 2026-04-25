"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/redux/hooks";
import {
	verifyPayment,
	resetFlow,
} from "../../lib/redux/slices/bookingFlowSlice";

// ── Types ─────────────────────────────────────────────────────────────────────
interface BookingSummary {
	booking_id: string;
	studio_name: string;
	service_name: string;
	start_datetime: string;
	duration: number;
	addons: string[];
	promo_code: string | null;
	total_amount?: number;
	is_gift?: boolean;
	gift_recipient_name?: string;
	gift_recipient_email?: string;
	gift_message?: string;
	gift_sender_name?: string;
	gift_send_date?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(t: string) {
	if (!t) return "—";
	const [hStr, mStr] = t.split(":");
	let h = parseInt(hStr);
	const meridiem = h >= 12 ? "PM" : "AM";
	if (h === 0) h = 12;
	else if (h > 12) h -= 12;
	return `${h}:${mStr} ${meridiem}`;
}

function formatDate(datePart: string) {
	if (!datePart) return "—";
	return new Date(datePart + "T00:00:00").toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

function formatNaira(amount: number) {
	// amount is already in full naira (e.g. 40000 = ₦40,000)
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

// ── PDF Generator ─────────────────────────────────────────────────────────────
async function downloadReceipt(data: {
	reference: string;
	summary: BookingSummary;
}) {
	const jsPDF = (await import("jspdf")).default;
	const { reference, summary } = data;

	const doc = new jsPDF({ unit: "pt", format: "a4" });
	const W = doc.internal.pageSize.getWidth();
	const H = doc.internal.pageSize.getHeight();

	// ── Watermark ──────────────────────────────────────────────────────────────
	doc.setFont("helvetica", "bold");
	doc.setFontSize(58);
	doc.setTextColor(245, 180, 180);
	doc.text("Studio Surikudo", W / 2, H / 2, {
		align: "center",
		angle: 45,
		renderingMode: "fill",
	});

	// ── Header bar ─────────────────────────────────────────────────────────────
	doc.setFillColor(220, 38, 38);
	doc.rect(0, 0, W, 70, "F");
	doc.setFont("helvetica", "bold");
	doc.setFontSize(22);
	doc.setTextColor(255, 255, 255);
	doc.text("Studio Surikudo", 40, 38);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.setTextColor(255, 200, 200);
	doc.text(
		summary.is_gift ? "Gift Booking Receipt" : "Booking Receipt",
		40,
		56,
	);

	// ── IDs ────────────────────────────────────────────────────────────────────
	let y = 100;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(13);
	doc.setTextColor(17, 24, 39);
	doc.text(
		summary.is_gift ? "Gift Booking — All set!" : "You're all set!",
		40,
		y,
	);

	y += 18;
	doc.setFont("courier", "normal");
	doc.setFontSize(9);
	doc.setTextColor(107, 114, 128);
	doc.text(`Booking ID:   ${summary.booking_id}`, 40, y);
	y += 14;
	doc.text(`Payment Ref:  ${reference}`, 40, y);

	// ── Divider ────────────────────────────────────────────────────────────────
	y += 20;
	doc.setDrawColor(229, 231, 235);
	doc.setLineWidth(0.5);
	doc.line(40, y, W - 40, y);

	// ── Gift recipient block (if gift) ─────────────────────────────────────────
	if (summary.is_gift) {
		y += 24;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(10);
		doc.setTextColor(220, 38, 38);
		doc.text("GIFT DETAILS", 40, y);

		const giftRows: [string, string][] = [
			["Gift For", summary.gift_recipient_name ?? "—"],
			["Recipient Email", summary.gift_recipient_email ?? "—"],
			["From", summary.gift_sender_name || "—"],
			["Send Date", summary.gift_send_date || "—"],
		];
		if (summary.gift_message) giftRows.push(["Message", summary.gift_message]);

		giftRows.forEach(([label, value], i) => {
			y += 26;
			const bg: [number, number, number] =
				i % 2 === 0 ? [255, 245, 245] : [255, 255, 255];
			doc.setFillColor(...bg);
			doc.rect(40, y - 15, W - 80, 22, "F");
			doc.setFont("helvetica", "normal");
			doc.setFontSize(9.5);
			doc.setTextColor(107, 114, 128);
			doc.text(label, 52, y);
			doc.setFont("helvetica", "bold");
			doc.setTextColor(17, 24, 39);
			// wrap long values (like message)
			const lines = doc.splitTextToSize(value, W - 200);
			doc.text(lines[0], W - 52, y, { align: "right" });
		});

		y += 20;
		doc.setDrawColor(229, 231, 235);
		doc.line(40, y, W - 40, y);
	}

	// ── Booking details ────────────────────────────────────────────────────────
	y += 24;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(10);
	doc.setTextColor(220, 38, 38);
	doc.text("BOOKING DETAILS", 40, y);

	const [datePart, timePart] = (summary.start_datetime ?? " ").split(" ");

	const rows: [string, string][] = [
		["Service", summary.studio_name ?? "—"],
		["Package", summary.service_name ?? "—"],
		["Date", formatDate(datePart)],
		["Time", formatTime(timePart)],
		["Duration", summary.duration ? `${summary.duration}h` : "—"],
		["Add-ons", summary.addons?.join(", ") || "None"],
		["Promo Code", summary.promo_code || "—"],
		["Payment Ref", reference || "—"],
	];

	rows.forEach(([label, value], i) => {
		y += 27;
		const rowBg: [number, number, number] =
			i % 2 === 0 ? [249, 250, 251] : [255, 255, 255];
		doc.setFillColor(...rowBg);
		doc.rect(40, y - 15, W - 80, 23, "F");
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.setTextColor(107, 114, 128);
		doc.text(label, 52, y);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(17, 24, 39);
		doc.text(value, W - 52, y, { align: "right" });
	});

	// ── Total ──────────────────────────────────────────────────────────────────
	if (summary.total_amount !== undefined) {
		y += 36;
		doc.setFillColor(220, 38, 38);
		doc.roundedRect(40, y - 20, W - 80, 38, 6, 6, "F");
		doc.setFont("helvetica", "bold");
		doc.setFontSize(12);
		doc.setTextColor(255, 255, 255);
		doc.text("Total Paid", 56, y);
		// total_amount is already full naira
		doc.text(formatNaira(summary.total_amount), W - 56, y, { align: "right" });
	}

	// ── Footer ─────────────────────────────────────────────────────────────────
	y = H - 60;
	doc.setDrawColor(229, 231, 235);
	doc.line(40, y, W - 40, y);
	y += 16;
	doc.setFont("helvetica", "normal");
	doc.setFontSize(8);
	doc.setTextColor(156, 163, 175);
	doc.text(
		"Thank you for booking with Studio Surikudo. Please keep this receipt for your records.",
		W / 2,
		y,
		{ align: "center" },
	);
	y += 12;
	doc.text(
		`Generated on ${new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}`,
		W / 2,
		y,
		{ align: "center" },
	);

	doc.save(`receipt-${summary.booking_id}.pdf`);
}

// ── Page ──────────────────────────────────────────────────────────────────────
function BookingConfirmPage() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const searchParams = useSearchParams();

	const reference =
		searchParams.get("trxref") ?? searchParams.get("reference") ?? "";

	const { verifyStatus, verifyError, verifiedBooking } = useAppSelector(
		(state) => state.bookingFlow,
	);

	// Read gift/session data from sessionStorage
	const sessionRaw =
		typeof window !== "undefined"
			? sessionStorage.getItem("bookingSummary")
			: null;
	const sessionData: BookingSummary | null = sessionRaw
		? JSON.parse(sessionRaw)
		: null;

	// Merge verifiedBooking (API) with sessionData (local, has gift fields + total)
	const booking: BookingSummary | null = verifiedBooking
		? {
				booking_id: verifiedBooking.booking_id ?? sessionData?.booking_id ?? "",
				studio_name:
					verifiedBooking.studio_name ?? sessionData?.studio_name ?? "",
				service_name:
					verifiedBooking.service_name ?? sessionData?.service_name ?? "",
				start_datetime:
					verifiedBooking.start_datetime ?? sessionData?.start_datetime ?? "",
				duration: verifiedBooking.duration ?? sessionData?.duration ?? 0,
				addons: verifiedBooking.addons ?? sessionData?.addons ?? [],
				promo_code:
					verifiedBooking.promo_code ?? sessionData?.promo_code ?? null,
				total_amount: verifiedBooking.total_amount ?? sessionData?.total_amount,
				// Gift fields only come from session
				is_gift: sessionData?.is_gift,
				gift_recipient_name: sessionData?.gift_recipient_name,
				gift_recipient_email: sessionData?.gift_recipient_email,
				gift_message: sessionData?.gift_message,
				gift_sender_name: sessionData?.gift_sender_name,
				gift_send_date: sessionData?.gift_send_date,
			}
		: null;

	useEffect(() => {
		if (reference && verifyStatus === "idle") {
			dispatch(verifyPayment(reference));
		}
	}, [reference, verifyStatus, dispatch]);

	const handleGoToDashboard = () => {
		dispatch(resetFlow());
		router.push("/dashboard/bookings");
	};

	const handleDownload = () => {
		if (!booking) return;
		downloadReceipt({ reference, summary: booking });
	};

	// ── Loading ────────────────────────────────────────────────────────────────
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

	// ── Error ──────────────────────────────────────────────────────────────────
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

	// ── Success ────────────────────────────────────────────────────────────────
	const [datePart, timePart] = (booking?.start_datetime ?? " ").split(" ");
	const addonNames = booking?.addons?.join(", ") || "None";
	const isGift = booking?.is_gift;

	const detailRows = [
		{ label: "Service", value: booking?.studio_name },
		{ label: "Package", value: booking?.service_name },
		{ label: "Date", value: formatDate(datePart) },
		{ label: "Time", value: formatTime(timePart) },
		{
			label: "Duration",
			value: booking?.duration ? `${booking.duration}h` : "—",
		},
		{ label: "Add-ons", value: addonNames },
		{ label: "Promo", value: booking?.promo_code || "—" },
		{ label: "Payment Ref", value: reference || "—" },
		...(booking?.total_amount !== undefined
			? [{ label: "Total Paid", value: formatNaira(booking.total_amount) }]
			: []),
	];

	return (
		<main className='min-h-screen bg-gray-50'>
			<nav className='bg-white border-b border-gray-100 px-6 py-3'>
				<div className='max-w-3xl mx-auto flex items-center gap-2 text-sm text-gray-500'>
					<span className='w-3 h-3 bg-red-600 rounded-full inline-block' />
					<span className='text-gray-900 font-medium'>
						Studio/{booking?.studio_name ?? "—"}
					</span>
				</div>
			</nav>

			<div className='max-w-xl mx-auto px-6 py-14 flex flex-col items-center gap-6'>
				{/* Icon */}
				<div
					className={`w-16 h-16 rounded-full border-2 flex items-center justify-center bg-white text-2xl ${isGift ? "border-pink-400" : "border-green-400"}`}
				>
					{isGift ? (
						"🎁"
					) : (
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
					)}
				</div>

				<div className='text-center'>
					<p className='text-red-600 text-xs font-bold uppercase tracking-widest mb-2'>
						{isGift ? "Gift Booking Confirmed" : "Booking Confirmed"}
					</p>
					<h1 className='text-3xl font-black text-gray-950 mb-3'>
						{isGift
							? `Gift sent to ${booking?.gift_recipient_name}!`
							: "You are all set!"}
					</h1>
					{booking?.booking_id && (
						<p className='text-gray-500 text-sm font-mono'>
							ID: {booking.booking_id}
						</p>
					)}
					{reference && (
						<p className='text-gray-400 text-xs font-mono mt-1'>
							Ref: {reference}
						</p>
					)}
				</div>

				{/* Gift recipient card */}
				{isGift && (
					<div className='w-full bg-pink-50 border border-pink-100 rounded-xl p-5'>
						<p className='text-xs font-bold text-pink-500 uppercase tracking-widest mb-3'>
							Gift Recipient
						</p>
						<div className='flex flex-col gap-2 text-sm'>
							{[
								{ label: "Name", value: booking?.gift_recipient_name },
								{ label: "Email", value: booking?.gift_recipient_email },
								{ label: "From", value: booking?.gift_sender_name || "—" },
								{ label: "Send Date", value: booking?.gift_send_date || "—" },
								...(booking?.gift_message
									? [{ label: "Message", value: `"${booking.gift_message}"` }]
									: []),
							].map(({ label, value }) => (
								<div
									key={label}
									className='flex justify-between items-start gap-4'
								>
									<span className='text-pink-400 shrink-0'>{label}</span>
									<span className='font-semibold text-gray-800 text-right'>
										{value ?? "—"}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Booking details */}
				<div className='w-full bg-white border border-gray-200 rounded-xl p-6'>
					<div className='flex flex-col gap-3 text-sm'>
						{detailRows.map(({ label, value }) => (
							<div key={label} className='flex justify-between items-start'>
								<span className='text-gray-400 shrink-0'>{label}</span>
								<span
									className={`font-bold text-right max-w-[60%] ${label === "Total Paid" ? "text-gray-900 text-base" : "text-gray-900 font-mono text-xs leading-5"}`}
								>
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
						onClick={handleDownload}
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
