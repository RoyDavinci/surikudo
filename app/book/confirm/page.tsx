"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/redux/hooks";
import {
	verifyPayment,
	resetFlow,
} from "../../lib/redux/slices/bookingFlowSlice";

// ── PDF Generator ────────────────────────────────────────────────────────────
async function downloadReceipt(data: {
	reference: string;
	booking_id: string;
	studio_name: string;
	service_name: string;
	start_datetime: string;
	duration: number;
	addons: string[];
	promo_code: string | null;
	total_amount?: number;
}) {
	const jsPDF = (await import("jspdf")).default;

	const doc = new jsPDF({ unit: "pt", format: "a4" });
	const W = doc.internal.pageSize.getWidth();
	const H = doc.internal.pageSize.getHeight();

	// ── Watermark (light red simulating transparency) ──────────────────────────
	doc.setFont("helvetica", "bold");
	doc.setFontSize(60);
	doc.setTextColor(245, 180, 180); // very light red — simulates low opacity
	// jsPDF text angle is set via the options object
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
	doc.text("Booking Receipt", 40, 56);

	// ── "Booking Confirmed" badge ──────────────────────────────────────────────
	doc.setFillColor(240, 253, 244);
	doc.roundedRect(W - 165, 18, 125, 28, 6, 6, "F");
	doc.setFont("helvetica", "bold");
	doc.setFontSize(9);
	doc.setTextColor(22, 163, 74);
	doc.text("✓  BOOKING CONFIRMED", W - 152, 36);

	// ── Booking ID + Reference ─────────────────────────────────────────────────
	let y = 110;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(13);
	doc.setTextColor(17, 24, 39);
	doc.text("You're all set!", 40, y);

	y += 18;
	doc.setFont("courier", "normal");
	doc.setFontSize(9);
	doc.setTextColor(107, 114, 128);
	doc.text(`Booking ID:   ${data.booking_id}`, 40, y);
	y += 14;
	doc.text(`Payment Ref:  ${data.reference}`, 40, y);

	// ── Divider ────────────────────────────────────────────────────────────────
	y += 20;
	doc.setDrawColor(229, 231, 235);
	doc.setLineWidth(0.5);
	doc.line(40, y, W - 40, y);

	// ── Details section ────────────────────────────────────────────────────────
	y += 24;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(10);
	doc.setTextColor(220, 38, 38);
	doc.text("BOOKING DETAILS", 40, y);

	const [datePart, timePart] = (data.start_datetime ?? " ").split(" ");
	const formattedDate = datePart
		? new Date(datePart + "T00:00:00").toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			})
		: "—";

	const formatTime = (t: string) => {
		if (!t) return "—";
		const [hStr, mStr] = t.split(":");
		let h = parseInt(hStr);
		const meridiem = h >= 12 ? "PM" : "AM";
		if (h === 0) h = 12;
		else if (h > 12) h -= 12;
		return `${h}:${mStr} ${meridiem}`;
	};

	const rows: [string, string][] = [
		["Service", data.studio_name ?? "—"],
		["Package", data.service_name ?? "—"],
		["Date", formattedDate],
		["Time", formatTime(timePart)],
		["Duration", data.duration ? `${data.duration}h` : "—"],
		["Add-ons", data.addons?.join(", ") || "None"],
		["Promo Code", data.promo_code || "—"],
		["Payment Ref", data.reference || "—"],
	];

	rows.forEach(([label, value], i) => {
		y += 28;
		const rowBg: [number, number, number] =
			i % 2 === 0 ? [249, 250, 251] : [255, 255, 255];
		doc.setFillColor(...rowBg);
		doc.rect(40, y - 16, W - 80, 24, "F");

		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.setTextColor(107, 114, 128);
		doc.text(label, 52, y);

		doc.setFont("helvetica", "bold");
		doc.setTextColor(17, 24, 39);
		doc.text(value, W - 52, y, { align: "right" });
	});

	// ── Total amount ───────────────────────────────────────────────────────────
	if (data.total_amount !== undefined) {
		y += 36;
		doc.setFillColor(220, 38, 38);
		doc.roundedRect(40, y - 18, W - 80, 36, 6, 6, "F");

		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		doc.setTextColor(255, 255, 255);
		doc.text("Total Paid", 56, y);

		const formatted = new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
		}).format(data.total_amount / 100);
		doc.text(formatted, W - 56, y, { align: "right" });
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
		`Generated on ${new Date().toLocaleString("en-US", {
			dateStyle: "long",
			timeStyle: "short",
		})}`,
		W / 2,
		y,
		{ align: "center" },
	);

	doc.save(`receipt-${data.booking_id}.pdf`);
}

// ── Page ─────────────────────────────────────────────────────────────────────
function BookingConfirmPage() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const searchParams = useSearchParams();

	const reference =
		searchParams.get("trxref") ?? searchParams.get("reference") ?? "";

	const { verifyStatus, verifyError, verifiedBooking } = useAppSelector(
		(state) => state.bookingFlow,
	);

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
		if (!verifiedBooking) return;
		downloadReceipt({
			reference,
			booking_id: verifiedBooking.booking_id ?? "",
			studio_name: verifiedBooking.studio_name ?? "",
			service_name: verifiedBooking.service_name ?? "",
			start_datetime: verifiedBooking.start_datetime ?? "",
			duration: verifiedBooking.duration ?? 0,
			addons: verifiedBooking.addons ?? [],
			promo_code: verifiedBooking.promo_code ?? null,
			total_amount: verifiedBooking.total_amount,
		});
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
					{/* ── Payment reference from URL ── */}
					{reference && (
						<p className='text-gray-400 text-xs font-mono mt-1'>
							Ref: {reference}
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
							{ label: "Payment Ref", value: reference || "—" },
						].map(({ label, value }) => (
							<div key={label} className='flex justify-between items-start'>
								<span className='text-gray-400'>{label}</span>
								<span className='font-bold text-gray-900 text-right max-w-[60%] font-mono text-xs leading-5'>
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
