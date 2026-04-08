/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Addon {
	id: string;
	name: string;
	description: string;
	price: number;
	unit: string;
}

const ADDONS: Addon[] = [
	{
		id: "engineer",
		name: "Sound Engineer",
		description: "On-site professional for your session",
		price: 60,
		unit: "hr",
	},
	{
		id: "vocal-booth",
		name: "Vocal Booth",
		description: "Dedicated isolation booth add-on",
		price: 60,
		unit: "hr",
	},
	{
		id: "livestream",
		name: "Live Stream Setup",
		description: "HD Output podcast/video session",
		price: 40,
		unit: "hr",
	},
];

const VALID_PROMO_CODES: Record<string, number> = {
	SURIKUDO20: 0.2,
	STUDIO10: 0.1,
};

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

function AddonsPage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const studio = searchParams.get("studio") ?? "";
	const studioName = searchParams.get("studioName") ?? "";
	const packageName = searchParams.get("packageName") ?? "";
	const price = Number(searchParams.get("price") ?? 0);
	const date = searchParams.get("date") ?? "";
	const time = searchParams.get("time") ?? "";
	const endTime = searchParams.get("endTime") ?? "";
	const unit = searchParams.get("unit") ?? "";

	const [addedAddons, setAddedAddons] = useState<Set<string>>(new Set());
	const [promoInput, setPromoInput] = useState("");
	const [promoCode, setPromoCode] = useState("");
	const [promoDiscount, setPromoDiscount] = useState(0);
	const [promoStatus, setPromoStatus] = useState<"idle" | "valid" | "invalid">(
		"idle",
	);
	const [specialNote, setSpecialNote] = useState("");

	const toggleAddon = (id: string) => {
		setAddedAddons((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const handleApplyPromo = () => {
		const discount = VALID_PROMO_CODES[promoInput.toUpperCase()];
		if (discount) {
			setPromoCode(promoInput.toUpperCase());
			setPromoDiscount(discount);
			setPromoStatus("valid");
		} else {
			setPromoStatus("invalid");
			setPromoDiscount(0);
		}
	};

	const addonsTotal = ADDONS.filter((a) => addedAddons.has(a.id)).reduce(
		(sum, a) => sum + a.price,
		0,
	);
	const subtotal = price + addonsTotal;
	const discountAmount = Math.round(subtotal * promoDiscount);
	const total = subtotal - discountAmount;
	const addonNames = ADDONS.filter((a) => addedAddons.has(a.id))
		.map((a) => a.name)
		.join(", ");

	// Shared params passed forward to both confirm and gift pages
	const sharedParams = {
		studio,
		studioName,
		packageName,
		unit,
		date,
		time,
		endTime,
		price: String(price),
		total: String(total),
		addons: addonNames,
		promoCode,
	};

	const handleConfirm = () => {
		router.push(
			`/book/confirm?${new URLSearchParams(sharedParams).toString()}`,
		);
	};

	const giftHref = `/book/gift?${new URLSearchParams(sharedParams).toString()}`;
	const backHref = `/book/date-time?studio=${studio}&studioName=${encodeURIComponent(studioName)}&packageName=${encodeURIComponent(packageName)}&price=${price}&unit=${encodeURIComponent(unit)}`;

	return (
		<main className='min-h-screen bg-gray-50'>
			<nav className='bg-white border-b border-gray-100 px-6 py-3'>
				<div className='max-w-5xl mx-auto flex items-center justify-between'>
					<div className='flex items-center gap-2 text-sm text-gray-500'>
						{/* Back button replaces red dot */}
						<IconButton
							onClick={() => router.back()}
							size='small'
							className='!p-0'
						>
							<ArrowBackIcon
								fontSize='small'
								sx={{ color: "#dc2626" }} // red arrow
							/>
						</IconButton>

						<Link
							href={`/studios/${studio}`}
							className='hover:text-gray-900 transition-colors'
						>
							Studio
						</Link>

						<span>/</span>

						<span className='text-gray-900 font-medium'>{studioName}</span>
					</div>

					<StepBar step={3} />
				</div>
			</nav>

			<div className='max-w-5xl mx-auto px-6 py-10'>
				<h1 className='text-3xl font-black text-gray-950 mb-10'>
					Add-ons &amp; Payment
				</h1>

				<div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8'>
					{/* ── Left ──────────────────────────────────────────── */}
					<div className='flex flex-col gap-8'>
						{/* Add-ons */}
						<section>
							<h2 className='font-bold text-gray-900 mb-4'>Optional Add-ons</h2>
							<div className='flex flex-col gap-3'>
								{ADDONS.map((addon) => {
									const added = addedAddons.has(addon.id);
									return (
										<div
											key={addon.id}
											className={`bg-white border rounded-xl p-4 flex items-center justify-between transition-all ${added ? "border-red-200 bg-red-50/30" : "border-gray-200"}`}
										>
											<div>
												<p className='font-semibold text-gray-900 text-sm'>
													{addon.name}
												</p>
												<p className='text-gray-500 text-xs mt-0.5'>
													{addon.description}
												</p>
											</div>
											<div className='flex items-center gap-3 shrink-0 ml-4'>
												<span className='text-sm text-gray-600 font-medium'>
													${addon.price}/{addon.unit}
												</span>
												<button
													onClick={() => toggleAddon(addon.id)}
													className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition-all ${
														added
															? "bg-gray-900 text-white"
															: "bg-red-600 hover:bg-red-700 text-white"
													}`}
												>
													{added ? (
														<>
															<span>✓</span> Added
														</>
													) : (
														<>
															<span>+</span> Add
														</>
													)}
												</button>
											</div>
										</div>
									);
								})}
							</div>
						</section>

						{/* Special Preference */}
						<section>
							<h2 className='font-bold text-gray-900 mb-3'>
								Special Preference
							</h2>
							<textarea
								value={specialNote}
								onChange={(e) => setSpecialNote(e.target.value)}
								placeholder='e.g Vintage plate reverb, two vocal mics, low monitor volume...'
								rows={4}
								className='w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-red-400 transition-colors resize-none'
							/>
						</section>

						{/* Promo Code */}
						<section>
							<h2 className='font-bold text-gray-900 mb-3'>Promo Code</h2>
							<div className='flex gap-2'>
								<input
									type='text'
									value={promoInput}
									onChange={(e) => {
										setPromoInput(e.target.value);
										setPromoStatus("idle");
									}}
									placeholder='Enter promo code'
									className='flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-red-400 transition-colors'
								/>
								<button
									onClick={handleApplyPromo}
									className='bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors'
								>
									Apply
								</button>
							</div>
							{promoStatus === "valid" && (
								<p className='mt-2 text-xs text-green-600 flex items-center gap-1'>
									<span>✓</span> Code valid — {Math.round(promoDiscount * 100)}%
									discount applied
								</p>
							)}
							{promoStatus === "invalid" && (
								<p className='mt-2 text-xs text-red-500 flex items-center gap-1'>
									<span>✕</span> Invalid promo code
								</p>
							)}
						</section>

						{/* Gift link — navigates to /book/gift page */}
						<Link
							href={giftHref}
							className='flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors'
						>
							Book this session as a Gift 🎁
						</Link>
					</div>

					{/* ── Right — Order Summary ─────────────────────────── */}
					<div className='flex flex-col gap-4'>
						<div className='bg-white border border-gray-200 rounded-xl p-6'>
							<h3 className='font-black text-gray-900 text-lg mb-5'>
								Order Summary
							</h3>
							<div className='flex flex-col gap-3 text-sm'>
								<div className='flex justify-between'>
									<span className='text-gray-500'>
										{studioName} ({packageName})
									</span>
									<span className='font-semibold text-gray-900'>${price}</span>
								</div>
								{ADDONS.filter((a) => addedAddons.has(a.id)).map((a) => (
									<div key={a.id} className='flex justify-between'>
										<span className='text-gray-500'>{a.name} add-on</span>
										<span className='font-semibold text-gray-900'>
											${a.price}
										</span>
									</div>
								))}
								{promoStatus === "valid" && (
									<div className='flex justify-between'>
										<button
											onClick={() => {
												setPromoStatus("idle");
												setPromoDiscount(0);
												setPromoCode("");
											}}
											className='text-green-600 hover:underline text-left'
										>
											Promo code ({promoCode})
										</button>
										<span className='font-semibold text-green-600'>
											-${discountAmount}
										</span>
									</div>
								)}
								<hr className='border-gray-100' />
								<div className='flex justify-between'>
									<span className='text-gray-700 font-semibold'>Total</span>
									<span className='font-black text-gray-900'>${total}</span>
								</div>
							</div>
						</div>

						{date && (
							<div className='bg-white border border-gray-100 rounded-xl p-4 text-xs text-gray-500 flex flex-col gap-1.5'>
								<div className='flex justify-between'>
									<span>Date</span>
									<span className='font-semibold text-gray-700'>{date}</span>
								</div>
								<div className='flex justify-between'>
									<span>Time</span>
									<span className='font-semibold text-red-600'>
										{time} — {endTime}
									</span>
								</div>
								<div className='flex justify-between'>
									<span>Duration</span>
									<span className='font-semibold text-gray-700'>{unit}</span>
								</div>
							</div>
						)}

						{/* Personal booking — goes straight to confirm */}
						<button
							onClick={handleConfirm}
							className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded text-sm transition-colors flex items-center justify-center gap-2'
						>
							Confirm and Pay ${total} →
						</button>

						<Link
							href={backHref}
							className='text-center text-sm text-gray-400 hover:text-gray-600 transition-colors'
						>
							← Back to Date &amp; Time
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}

export default function AddonsPageWrapper() {
	return (
		<Suspense
			fallback={
				<div className='min-h-screen flex items-center justify-center text-gray-400 text-sm'>
					Loading…
				</div>
			}
		>
			<AddonsPage />
		</Suspense>
	);
}
