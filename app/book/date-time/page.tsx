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
	setDuration,
	setSelection,
} from "../../lib/redux/slices/bookingFlowSlice";

const BOOKED_DATES = [10, 14, 16, 22];

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
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ─── Step Bar ─────────────────────────────────────────────────────────────────

function StepBar({ step }: { step: number }) {
	const steps = ["Services", "Date & Time", "Payment"];
	return (
		<div className='flex items-center gap-2'>
			{steps.map((label, i) => {
				const n = i + 1;
				const active = n === step;
				const done = n < step;
				return (
					<div key={label} className='flex items-center gap-1.5'>
						<div
							className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
								active
									? "bg-red-600 text-white"
									: done
										? "bg-green-500 text-white"
										: "bg-gray-200 text-gray-400"
							}`}
						>
							{done ? "✓" : n}
						</div>
						<span
							className={`text-xs ${active ? "font-semibold text-gray-900" : "text-gray-400"}`}
						>
							{label}
						</span>
						{i < steps.length - 1 && (
							<span className='text-gray-300 ml-1 text-xs'>›</span>
						)}
					</div>
				);
			})}
		</div>
	);
}

// ─── Compact Calendar ────────────────────────────────────────────────────────

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
	while (cells.length % 7 !== 0) cells.push(null);

	return (
		<div>
			{/* Month nav */}
			<div className='flex items-center justify-between mb-3'>
				<h3 className='font-bold text-gray-900 text-sm'>
					{MONTHS[month]} {year}
				</h3>
				<div className='flex gap-0.5'>
					<button
						onClick={onPrev}
						className='w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-red-600 text-lg leading-none'
					>
						‹
					</button>
					<button
						onClick={onNext}
						className='w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-red-600 text-lg leading-none'
					>
						›
					</button>
				</div>
			</div>

			{/* Day headers */}
			<div className='grid grid-cols-7 mb-1'>
				{DAYS.map((d, i) => (
					<div
						key={i}
						className='text-center text-[10px] font-semibold text-gray-400 py-0.5'
					>
						{d}
					</div>
				))}
			</div>

			{/* Date cells — compact 32px squares */}
			<div className='grid grid-cols-7 gap-0.5'>
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
							className={`h-8 w-full flex items-center justify-center text-xs rounded transition-all
								${isSelected ? "bg-red-600 text-white font-bold" : ""}
								${isBooked ? "bg-gray-100 text-gray-300 cursor-not-allowed line-through" : ""}
								${isPast && !isBooked ? "text-gray-300 cursor-not-allowed" : ""}
								${!disabled && !isSelected ? "hover:bg-red-50 hover:text-red-600 text-gray-700" : ""}
								${isToday && !isSelected ? "ring-1 ring-red-400 font-semibold text-red-600" : ""}
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

// ─── Duration Picker ──────────────────────────────────────────────────────────

function DurationPicker({
	baseDuration,
	pricePerHour,
	selected,
	onChange,
}: {
	baseDuration: number;
	pricePerHour: number;
	selected: number;
	onChange: (hours: number) => void;
}) {
	// Build options: base duration up to 12h, in 0.5h increments
	const options: number[] = [];
	for (let h = 0.5; h <= 12; h += 0.5) {
		if (h >= baseDuration) options.push(h); // can't go below base
	}

	return (
		<div className='mt-4'>
			<p className='text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2'>
				Duration
			</p>
			<div className='flex flex-wrap gap-1.5'>
				{options.map((h) => (
					<button
						key={h}
						onClick={() => onChange(h)}
						className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
							selected === h
								? "border-red-600 bg-red-600 text-white"
								: "border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600"
						}`}
					>
						{h % 1 === 0 ? `${h}h` : `${h}h`}
					</button>
				))}
			</div>
			<p className='text-xs text-gray-400 mt-2'>
				Min. {baseDuration}h · ₦{pricePerHour.toLocaleString()} / hr
			</p>
		</div>
	);
}

// ─── Time Slots ───────────────────────────────────────────────────────────────

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
			<div className='mt-4 flex gap-2 flex-wrap'>
				{[...Array(6)].map((_, i) => (
					<div key={i} className='h-8 w-20 bg-gray-100 rounded animate-pulse' />
				))}
			</div>
		);
	}

	if (status === "failed") {
		return (
			<p className='mt-4 text-xs text-red-500'>
				Could not load slots. Try another date.
			</p>
		);
	}

	if (status === "succeeded" && slots.length === 0) {
		return (
			<p className='mt-4 text-xs text-gray-500'>
				No slots available for this date.
			</p>
		);
	}

	if (status === "idle" || slots.length === 0) return null;

	return (
		<div className='mt-4'>
			<p className='text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2'>
				Available Times
			</p>
			<div className='flex flex-wrap gap-1.5'>
				{slots.map((slot) => {
					const isSelected = selectedSlot?.start_time === slot.start_time;
					return (
						<button
							key={slot.start_time}
							disabled={!slot.available}
							onClick={() => onSelect(slot)}
							className={`px-3 py-1.5 rounded text-xs font-medium border transition-all
								${
									isSelected
										? "border-red-600 bg-red-600 text-white"
										: slot.available
											? "border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600"
											: "border-gray-100 text-gray-300 line-through cursor-not-allowed"
								}`}
						>
							{slot.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}

function formatTime(time24: string): string {
	const [hStr, mStr] = (time24 ?? "00:00").split(":");
	let h = parseInt(hStr);
	const meridiem = h >= 12 ? "PM" : "AM";
	if (h === 0) h = 12;
	else if (h > 12) h -= 12;
	return `${h}:${mStr ?? "00"} ${meridiem}`;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function DateTimePage() {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const {
		selection,
		selectedDate,
		selectedSlot,
		slots,
		slotsStatus,
		selectedDuration,
	} = useAppSelector((state) => state.bookingFlow);

	const today = new Date();
	const [year, setYear] = useState(today.getFullYear());
	const [month, setMonth] = useState(today.getMonth());

	if (!selection) {
		router.replace("/#studios");
		return null;
	}
	const baseDuration = selection.durationHours ?? 1;
	const pricePerHour = selection.price; // price IS per-hour for services
	const activeDuration = selectedDuration ?? baseDuration;
	const totalPrice = Math.round(pricePerHour * activeDuration);

	const handleDurationChange = (hours: number) => {
		dispatch(setDuration(hours));
	};

	const isHourly = selection.type === "service";

	const handleDaySelect = (day: number) => {
		const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
		dispatch(setDate(dateStr));
		if (selection?.studioRoomId) {
			dispatch(
				fetchAvailableSlots({
					studioRoomId: selection.studioRoomId,
					date: dateStr,
				}),
			);
		}
	};

	const canContinue = selectedDate !== null && selectedSlot !== null;

	const selectedDay = selectedDate
		? parseInt(selectedDate.split("-")[2])
		: null;
	const selectedCalMonth = selectedDate
		? parseInt(selectedDate.split("-")[1]) - 1
		: null;
	const calSelectedDay = selectedCalMonth === month ? selectedDay : null;

	const formattedDate = selectedDate
		? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: null;

	const handleContinue = () => {
		if (!canContinue) return;

		// If duration changed, update selection price before navigating
		if (isHourly && activeDuration !== baseDuration) {
			dispatch(
				setSelection({
					...selection,
					price: totalPrice,
					durationHours: activeDuration,
					unit: `${activeDuration}h`,
				}),
			);
		}

		router.push("/book/addons");
	};

	return (
		<main className='min-h-screen bg-gray-50 flex flex-col'>
			{/* Nav */}
			<nav className='bg-white border-b border-gray-100 px-6 py-3 shrink-0'>
				<div className='max-w-4xl mx-auto flex items-center justify-between'>
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

			{/* Body — fixed height, no scroll */}
			<div className='flex-1 max-w-4xl mx-auto w-full px-6 py-6 flex flex-col'>
				<h1 className='text-xl font-black text-gray-950 mb-5'>
					Pick a Date &amp; Time
				</h1>

				<div className='flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 min-h-0'>
					{/* Left — calendar + slots in one card */}
					<div className='bg-white border border-gray-200 h-[600px] rounded-xl p-5 flex flex-col'>
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

						{/* Divider only when date is selected */}
						{selectedDate && <div className='border-t border-gray-100 mt-4' />}

						<TimeSlots
							slots={slots}
							status={slotsStatus}
							selectedSlot={selectedSlot}
							onSelect={(slot) => dispatch(setSlot(slot))}
						/>
						{isHourly && (
							<>
								<div className='border-t border-gray-100 mt-4' />
								<DurationPicker
									baseDuration={baseDuration}
									pricePerHour={pricePerHour}
									selected={activeDuration}
									onChange={handleDurationChange}
								/>
							</>
						)}
					</div>

					{/* Right — summary + CTA */}
					<div className='flex flex-col gap-3'>
						<div className='bg-white border border-gray-200 rounded-xl p-5'>
							<p className='text-xs font-bold text-gray-400 uppercase tracking-wide mb-3'>
								Your Selection
							</p>
							<div className='flex flex-col gap-2 text-sm'>
								{[
									{ label: "Studio", value: selection.studioName },
									{ label: "Package", value: selection.name },
									{
										label: "Duration",
										value: `${activeDuration}h`,
										red: isHourly && activeDuration !== baseDuration,
									},
									{ label: "Date", value: formattedDate ?? "—" },
									{
										label: "Time",
										value: selectedSlot
											? `${selectedSlot.label} – ${formatTime(selectedSlot.end_time)}`
											: "—",
										red: true,
									},
								].map(({ label, value, red }) => (
									<div
										key={label}
										className='flex justify-between items-start gap-2'
									>
										<span className='text-gray-400 shrink-0'>{label}</span>
										<span
											className={`font-semibold text-right text-xs ${red ? "text-red-600" : "text-gray-900"}`}
										>
											{value}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Price pill — live calculation */}
						<div className='bg-gray-900 rounded-xl px-5 py-4'>
							<div className='flex items-center justify-between mb-1'>
								<span className='text-xs text-gray-400'>Total</span>
								<span className='text-white font-black text-lg'>
									₦{(isHourly ? totalPrice : selection.price).toLocaleString()}
								</span>
							</div>
							{isHourly && (
								<p className='text-gray-500 text-[10px]'>
									₦{pricePerHour.toLocaleString()} × {activeDuration}h
								</p>
							)}
						</div>

						<button
							onClick={handleContinue}
							disabled={!canContinue}
							className='w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded text-sm transition-colors'
						>
							{canContinue ? "Continue to Checkout →" : "Select a date & time"}
						</button>

						<button
							onClick={() => router.back()}
							className='text-center text-xs text-gray-400 hover:text-gray-600'
						>
							← Back to Services
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}

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
