"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import {
	fetchAvailableSlots,
	setDate,
	setSlot,
	TimeSlot,
} from "../../lib/redux/slices/bookingFlowSlice";

// ─── Mock data for calendar — replace with real API ───────────────────────────
const BOOKED_DATES = [10, 14, 16, 22]; // days in current month that are fully booked

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

// ─── Time Slots with API integration ─────────────────────────────────────────

function TimeSlots({
	slots,
	status,
	selectedSlot,
	onSelect,
}: {
	slots: TimeSlot[];
	status: string;
	selectedSlot: TimeSlot | null;
	onSelect: (s: TimeSlot) => void;
}) {
	if (status === "loading") {
		return (
			<div className='mt-6'>
				<p className='text-sm text-gray-400 animate-pulse'>
					Loading available slots…
				</p>
			</div>
		);
	}

	if (status === "failed") {
		return (
			<div className='mt-6'>
				<p className='text-sm text-red-500'>
					Could not load slots. Please try another date.
				</p>
			</div>
		);
	}

	if (status === "succeeded" && slots.length === 0) {
		return (
			<div className='mt-6'>
				<p className='text-sm text-gray-500'>
					No available slots for this date.
				</p>
			</div>
		);
	}

	return (
		<div className='mt-6'>
			<h3 className='font-bold text-gray-900 mb-4'>Available Slots</h3>
			<div className='flex flex-wrap gap-2'>
				{slots.map((slot) => {
					const isSelected = selectedSlot?.start_time === slot.start_time;
					return (
						<button
							key={slot.start_time}
							disabled={!slot.available}
							onClick={() => onSelect(slot)}
							className={`px-3 py-2 rounded text-sm font-medium border transition-all
                ${isSelected ? "border-red-600 text-red-600 bg-red-50 ring-1 ring-red-600" : ""}
                ${!slot.available ? "border-gray-200 text-gray-300 line-through cursor-not-allowed" : ""}
                ${!isSelected && slot.available ? "border-gray-200 text-gray-700 hover:border-gray-400" : ""}
              `}
						>
							{slot.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}

// ─── Helper function to format time ──────────────────────────────────────────

function formatTime(time24: string): string {
	const [hStr, mStr] = (time24 ?? "00:00").split(":");
	let h = parseInt(hStr);
	const meridiem = h >= 12 ? "PM" : "AM";
	if (h === 0) h = 12;
	else if (h > 12) h -= 12;
	return `${h}:${mStr ?? "00"} ${meridiem}`;
}

// ─── Inner page ──────────────────────────────────────────────────────────────

function DateTimePage() {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const { selection, selectedDate, selectedSlot, slots, slotsStatus } =
		useAppSelector((state) => state.bookingFlow);

	console.log(selection, slots);

	const today = new Date();
	const [year, setYear] = useState(today.getFullYear());
	const [month, setMonth] = useState(today.getMonth());

	// If user lands here without a selection (e.g. direct URL), send them back
	if (!selection) {
		router.replace("/#studios");
		return null;
	}

	const handleDaySelect = (day: number) => {
		const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
		dispatch(setDate(dateStr));
		// Fetch real slots from API
		if (selection?.studioRoomId) {
			dispatch(
				fetchAvailableSlots({
					studioRoomId: selection.studioRoomId,
					date: dateStr,
				}),
			);
		}
	};

	const handleSlotSelect = (slot: TimeSlot) => {
		dispatch(setSlot(slot));
	};

	const canContinue = selectedDate !== null && selectedSlot !== null;

	const handleContinue = () => {
		if (!canContinue) return;
		router.push("/book/addons");
	};

	// Parse selectedDate back to a day number for Calendar highlight
	const selectedDay = selectedDate
		? parseInt(selectedDate.split("-")[2])
		: null;
	const selectedCalMonth = selectedDate
		? parseInt(selectedDate.split("-")[1]) - 1
		: null;
	const calSelectedDay = selectedCalMonth === month ? selectedDay : null;

	const formattedDate = selectedDate
		? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			})
		: null;

	const timeDisplay = selectedSlot
		? `${selectedSlot.label} – ${formatTime(selectedSlot.end_time)}`
		: null;

	return (
		<main className='min-h-screen bg-gray-50'>
			{/* Nav */}
			<nav className='bg-white border-b border-gray-100 px-6 py-3'>
				<div className='max-w-5xl mx-auto flex items-center justify-between'>
					<div className='flex items-center gap-2 text-sm text-gray-500'>
						<IconButton
							onClick={() => router.back()}
							size='small'
							className='!p-0'
						>
							<ArrowBackIcon fontSize='small' sx={{ color: "#dc2626" }} />
						</IconButton>

						<Link
							href={`/studios/${selection.studioName.toLowerCase().replace(/\s+/g, "-")}`}
							className='hover:text-gray-900 transition-colors'
						>
							Studio
						</Link>

						<span>/</span>

						<span className='text-gray-900 font-medium'>
							{selection.studioName}
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
							selectedDate={calSelectedDay}
							onSelect={handleDaySelect}
							year={year}
							month={month}
							onPrev={() => {
								if (month === 0) {
									setMonth(11);
									setYear((y) => y - 1);
								} else setMonth((m) => m - 1);
							}}
							onNext={() => {
								if (month === 11) {
									setMonth(0);
									setYear((y) => y + 1);
								} else setMonth((m) => m + 1);
							}}
						/>
						{selectedDate && (
							<TimeSlots
								slots={slots}
								status={slotsStatus}
								selectedSlot={selectedSlot}
								onSelect={handleSlotSelect}
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
								{[
									{ label: "Studio", value: selection?.studioName },
									{
										label: "Package",
										value: `${selection?.name} (${selection?.unit})`,
									},
									{ label: "Duration", value: selection?.unit },
									{ label: "Date", value: formattedDate ?? "—" },
									{ label: "Time", value: timeDisplay ?? "—", red: true },
								].map(({ label, value, red }) => (
									<div key={label} className='flex justify-between items-start'>
										<span className='text-gray-500'>{label}</span>
										<span
											className={`font-bold text-right ${red ? "text-red-600" : "text-gray-900"}`}
										>
											{value}
										</span>
									</div>
								))}
							</div>
						</div>

						<button
							onClick={handleContinue}
							disabled={!canContinue}
							className='w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-6 rounded text-sm transition-colors'
						>
							Continue to Checkout →
						</button>

						<button
							onClick={() => router.back()}
							className='text-center text-sm text-gray-400 hover:text-gray-600'
						>
							← Back to Services
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}

// ─── Export with Suspense (kept from old code for consistency) ───────────────

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
