"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookingParams {
	studio: string;
	studioName: string;
	type: string;
	packageId: string;
	packageName: string;
	price: string;
	unit: string;
}

// ─── Mock data — replace with real API ───────────────────────────────────────
// e.g. fetch(`/api/availability?studio=${studio}&date=${date}`)

const BOOKED_DATES = [10, 14, 16, 22]; // days in current month that are fully booked
const ALL_SLOTS = [
	"9:00 AM",
	"10:00 AM",
	"11:00 AM",
	"12:00 PM",
	"1:00 PM",
	"2:00 PM",
	"3:00 PM",
	"4:00 PM",
	"5:00 PM",
	"6:00 PM",
];
const UNAVAILABLE_SLOTS: Record<number, string[]> = {
	12: ["9:00 AM", "1:00 PM", "5:00 PM"],
	18: ["10:00 AM", "2:00 PM"],
	25: ["11:00 AM", "3:00 PM", "4:00 PM"],
};

// ─── Step Bar ─────────────────────────────────────────────────────────────────

function StepBar({ step }: { step: number }) {
	const steps = ["Services", "Date & Time", "Add-ons & Payment"];
	return (
		<div className='flex items-center gap-3'>
			{steps.map((label, i) => {
				const n = i + 1;
				const active = n === step;
				const done = n < step;
				return (
					<div key={label} className='flex items-center gap-2'>
						<div
							className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${active ? "bg-red-600 text-white" : done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}
						>
							{done ? "✓" : n}
						</div>
						<span
							className={`text-sm ${active ? "font-semibold text-gray-900" : "text-gray-400"}`}
						>
							{label}
						</span>
						{i < steps.length - 1 && (
							<span className='text-gray-200 ml-1'>›</span>
						)}
					</div>
				);
			})}
		</div>
	);
}

// ─── Calendar ────────────────────────────────────────────────────────────────

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function Calendar({
	selectedDate,
	onSelect,
	year,
	month,
	onPrev,
	onNext,
}: {
	selectedDate: number | null;
	onSelect: (day: number) => void;
	year: number;
	month: number;
	onPrev: () => void;
	onNext: () => void;
}) {
	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const today = new Date();
	const isCurrentMonth =
		today.getFullYear() === year && today.getMonth() === month;

	const cells: (number | null)[] = [
		...Array(firstDay).fill(null),
		...Array.from({ length: daysInMonth }, (_, i) => i + 1),
	];
	// Pad to full weeks
	while (cells.length % 7 !== 0) cells.push(null);

	return (
		<div className='bg-white border border-gray-200 rounded-xl p-6'>
			{/* Month nav */}
			<div className='flex items-center justify-between mb-6'>
				<h3 className='font-bold text-gray-900'>
					{MONTHS[month]} {year}
				</h3>
				<div className='flex gap-1'>
					<button
						onClick={onPrev}
						className='w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-red-600'
					>
						‹
					</button>
					<button
						onClick={onNext}
						className='w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-red-600'
					>
						›
					</button>
				</div>
			</div>

			{/* Day headers */}
			<div className='grid grid-cols-7 mb-2'>
				{DAYS.map((d, i) => (
					<div
						key={i}
						className='text-center text-xs font-semibold text-gray-400 py-1'
					>
						{d}
					</div>
				))}
			</div>

			{/* Date cells */}
			<div className='grid grid-cols-7 gap-1'>
				{cells.map((day, i) => {
					if (!day) return <div key={i} />;

					const isPast = isCurrentMonth && day < today.getDate();
					const isBooked = BOOKED_DATES.includes(day);
					const isSelected = selectedDate === day;
					const isToday = isCurrentMonth && day === today.getDate();
					const disabled = isPast || isBooked;

					return (
						<button
							key={i}
							disabled={disabled}
							onClick={() => onSelect(day)}
							className={`aspect-square flex items-center justify-center text-sm rounded transition-all
								${isSelected ? "bg-red-600 text-white font-bold" : ""}
								${isBooked ? "bg-gray-100 text-gray-300 cursor-not-allowed line-through" : ""}
								${isPast && !isBooked ? "text-gray-300 cursor-not-allowed" : ""}
								${!disabled && !isSelected ? "hover:bg-gray-100 text-gray-700" : ""}
								${isToday && !isSelected ? "ring-1 ring-red-400 font-semibold" : ""}
							`}
						>
							{day}
						</button>
					);
				})}
			</div>
		</div>
	);
}

// ─── Time Slots ───────────────────────────────────────────────────────────────

function TimeSlots({
	day,
	selectedTime,
	onSelect,
}: {
	day: number;
	selectedTime: string | null;
	onSelect: (t: string) => void;
}) {
	const unavailable = UNAVAILABLE_SLOTS[day] ?? [];

	return (
		<div className='mt-6'>
			<h3 className='font-bold text-gray-900 mb-4'>
				Available Slots ({MONTHS[new Date().getMonth()]} {day})
			</h3>
			<div className='flex flex-wrap gap-2'>
				{ALL_SLOTS.map((slot) => {
					const isUnavailable = unavailable.includes(slot);
					const isSelected = selectedTime === slot;
					return (
						<button
							key={slot}
							disabled={isUnavailable}
							onClick={() => onSelect(slot)}
							className={`px-3 py-2 rounded text-sm font-medium border transition-all
								${isSelected ? "border-red-600 text-red-600 bg-red-50 ring-1 ring-red-600" : ""}
								${isUnavailable ? "border-gray-200 text-gray-300 line-through cursor-not-allowed" : ""}
								${!isSelected && !isUnavailable ? "border-gray-200 text-gray-700 hover:border-gray-400" : ""}
							`}
						>
							{slot}
						</button>
					);
				})}
			</div>
		</div>
	);
}

// ─── Inner page (needs useSearchParams) ──────────────────────────────────────

function DateTimePage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const booking: BookingParams = {
		studio: searchParams.get("studio") ?? "",
		studioName: searchParams.get("studioName") ?? "",
		type: searchParams.get("type") ?? "package",
		packageId: searchParams.get("packageId") ?? "",
		packageName: searchParams.get("packageName") ?? "",
		price: searchParams.get("price") ?? "0",
		unit: searchParams.get("unit") ?? "",
	};

	const today = new Date();
	const [year, setYear] = useState(today.getFullYear());
	const [month, setMonth] = useState(today.getMonth());
	const [selectedDay, setSelectedDay] = useState<number | null>(null);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);

	const handlePrevMonth = () => {
		if (month === 0) {
			setMonth(11);
			setYear((y) => y - 1);
		} else setMonth((m) => m - 1);
	};
	const handleNextMonth = () => {
		if (month === 11) {
			setMonth(0);
			setYear((y) => y + 1);
		} else setMonth((m) => m + 1);
	};

	// Compute end time based on package unit (e.g. "2hrs" → +2 hours)
	const computeEndTime = (start: string, unit: string): string => {
		const hours = parseInt(unit) || 1;
		const [time, meridiem] = start.split(" ");
		const [h, m] = time.split(":").map(Number);
		let totalHour = h + (meridiem === "PM" && h !== 12 ? 12 : 0) + hours;
		const endMeridiem = totalHour >= 12 ? "PM" : "AM";
		if (totalHour > 12) totalHour -= 12;
		return `${totalHour} : ${String(m).padStart(2, "0")}${endMeridiem}`;
	};

	const endTime = selectedTime
		? computeEndTime(selectedTime, booking.unit)
		: null;
	const formattedDate = selectedDay
		? `${MONTHS[month]} ${selectedDay}, ${year}`
		: null;
	const canContinue = selectedDay !== null && selectedTime !== null;

	const handleContinue = () => {
		if (!canContinue) return;
		const params = new URLSearchParams({
			...Object.fromEntries(Object.entries(booking)),
			date: formattedDate!,
			time: selectedTime!,
			endTime: endTime!,
		});
		router.push(`/book/addons?${params.toString()}`);
	};

	return (
		<main className='min-h-screen bg-gray-50'>
			{/* Nav */}
			<nav className='bg-white border-b border-gray-100 px-6 py-3'>
				<div className='max-w-5xl mx-auto flex items-center justify-between'>
					<div className='flex items-center gap-2 text-sm text-gray-500'>
						{/* Back button replaces red dot */}
						<IconButton
							onClick={() => router.back()}
							size='small'
							className='!p-0'
						>
							<ArrowBackIcon fontSize='small' sx={{ color: "#dc2626" }} />
						</IconButton>

						<Link
							href={`/studios/${booking.studio}`}
							className='hover:text-gray-900 transition-colors'
						>
							Studio
						</Link>

						<span>/</span>

						<span className='text-gray-900 font-medium'>
							{booking.studioName}
						</span>
					</div>

					<StepBar step={2} />
				</div>
			</nav>

			<div className='max-w-5xl mx-auto px-6 py-10'>
				<h1 className='text-3xl font-black text-gray-950 mb-10'>
					Pick a Date &amp; Time
				</h1>

				<div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8'>
					{/* Left — Calendar + slots */}
					<div>
						<Calendar
							selectedDate={selectedDay}
							onSelect={(day) => {
								setSelectedDay(day);
								setSelectedTime(null);
							}}
							year={year}
							month={month}
							onPrev={handlePrevMonth}
							onNext={handleNextMonth}
						/>
						{selectedDay && (
							<TimeSlots
								day={selectedDay}
								selectedTime={selectedTime}
								onSelect={setSelectedTime}
							/>
						)}
					</div>

					{/* Right — Summary */}
					<div className='flex flex-col gap-4'>
						<div className='bg-white border border-gray-200 rounded-xl p-6'>
							<h3 className='font-black text-gray-900 text-lg mb-5'>
								Your Selection
							</h3>
							<div className='flex flex-col gap-3 text-sm'>
								<div className='flex justify-between items-start'>
									<span className='text-gray-500'>Studio</span>
									<span className='font-bold text-gray-900 text-right'>
										{booking.studioName}
									</span>
								</div>
								<div className='flex justify-between items-start'>
									<span className='text-gray-500'>Bundle</span>
									<span className='font-bold text-gray-900 text-right'>
										{booking.packageName} ({booking.unit})
									</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-gray-500'>Duration</span>
									<span className='font-bold text-gray-900'>
										{booking.unit}
									</span>
								</div>
								<hr className='border-gray-100' />
								<div className='flex justify-between'>
									<span className='text-gray-500'>Date</span>
									<span className='font-bold text-gray-900'>
										{formattedDate ?? "—"}
									</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-gray-500'>Time</span>
									<span className='font-bold text-red-600'>
										{selectedTime && endTime
											? `${selectedTime.replace(" ", "")} - ${endTime}`
											: "—"}
									</span>
								</div>
							</div>
						</div>

						<button
							onClick={handleContinue}
							disabled={!canContinue}
							className='w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-6 rounded text-sm transition-colors flex items-center justify-center gap-2'
						>
							Continue to Checkout →
						</button>

						<Link
							href={`/studios/${booking.studio}`}
							className='text-center text-sm text-gray-400 hover:text-gray-600 transition-colors'
						>
							← Back to Services
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}

// ─── Export with Suspense (required for useSearchParams in Next.js) ───────────

export default function DateTimePageWrapper() {
	return (
		<Suspense
			fallback={
				<div className='min-h-screen flex items-center justify-center text-gray-400 text-sm'>
					Loading…
				</div>
			}
		>
			<DateTimePage />
		</Suspense>
	);
}
