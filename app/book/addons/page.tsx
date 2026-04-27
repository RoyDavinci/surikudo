"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense, useRef } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import {
	fetchAddons,
	toggleAddon,
	setPromo,
	clearPromo,
	setSpecialNote,
	createDraftBooking,
	initializePayment,
} from "../../lib/redux/slices/bookingFlowSlice";
import {
	loginUser,
	registerUser,
	isAdminAccount,
	clearError,
} from "../../lib/redux/slices/authSlice";

function stripHtml(html: string) {
	if (typeof window === "undefined") return html;
	const doc = new DOMParser().parseFromString(html, "text/html");
	return doc.body.textContent || "";
}

// ─── StepBar ──────────────────────────────────────────────────────────────────

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
							className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
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

// ─── Auth Gate Modal ──────────────────────────────────────────────────────────

function AuthModal({
	onSuccess,
	onClose,
}: {
	onSuccess: () => void;
	onClose: () => void;
}) {
	const dispatch = useAppDispatch();
	const { status, error, registerStatus, registerError } = useAppSelector(
		(s) => s.auth,
	);

	const [tab, setTab] = useState<"login" | "register">("login");
	const [email, setEmail] = useState("");
	const [password, setPass] = useState("");
	const [confirm, setConfirm] = useState("");
	const [fullName, setFullName] = useState("");
	const [localErr, setLocalErr] = useState("");
	const [showPw, setShowPw] = useState(false);

	const switchTab = (next: "login" | "register") => {
		setTab(next);
		dispatch(clearError());
		setLocalErr("");
	};

	// Capture the status values at the moment the modal mounted
	const initialStatus = useRef(status);
	const initialRegisterStatus = useRef(registerStatus);

	// Clear stale errors when modal first opens
	useEffect(() => {
		dispatch(clearError());
	}, [dispatch]);

	// Only call onSuccess if auth succeeded AFTER this modal was shown
	useEffect(() => {
		const loginJustSucceeded =
			status === "succeeded" && initialStatus.current !== "succeeded";
		const registerJustSucceeded =
			registerStatus === "succeeded" &&
			initialRegisterStatus.current !== "succeeded";

		if (loginJustSucceeded || registerJustSucceeded) {
			onSuccess();
		}
	}, [status, registerStatus, onSuccess]);

	// ... rest of modal unchanged

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		setLocalErr("");
		dispatch(loginUser({ email, password }));
	};

	const handleRegister = (e: React.FormEvent) => {
		e.preventDefault();
		setLocalErr("");
		if (password !== confirm) {
			setLocalErr("Passwords do not match");
			return;
		}
		if (password.length < 8) {
			setLocalErr("Password must be at least 8 characters");
			return;
		}
		dispatch(registerUser({ email, password, full_name: fullName }));
	};

	const isLoading = status === "loading" || registerStatus === "loading";
	const sliceError = tab === "login" ? error : registerError;
	const displayError = localErr || sliceError;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4'>
			<div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-8'>
				<button
					onClick={onClose}
					className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none font-light'
				>
					✕
				</button>
				{/* Header */}
				<div className='text-center mb-6'>
					<span className='inline-block w-2 h-2 bg-red-600 rounded-full mb-3' />
					<h2 className='text-2xl font-black text-gray-950'>
						{tab === "login" ? "Welcome back" : "Create your account"}
					</h2>
					<p className='text-sm text-gray-400 mt-1'>
						{tab === "login"
							? "Log in to complete your booking"
							: "Register to complete your booking"}
					</p>
				</div>

				{/* Tab toggle */}
				<div className='flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-6'>
					<button
						onClick={() => switchTab("login")}
						className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
							tab === "login"
								? "bg-white shadow text-gray-900"
								: "text-gray-500"
						}`}
					>
						Log In
					</button>
					<button
						onClick={() => switchTab("register")}
						className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
							tab === "register"
								? "bg-white shadow text-gray-900"
								: "text-gray-500"
						}`}
					>
						Register
					</button>
				</div>

				{/* Form */}
				<form
					onSubmit={tab === "login" ? handleLogin : handleRegister}
					className='flex flex-col gap-4'
				>
					{/* Email */}
					<div>
						<label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'>
							Email
						</label>
						<input
							type='email'
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='your@email.com'
							disabled={isLoading}
							className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-red-400 disabled:opacity-50 transition-colors'
						/>
					</div>
					{tab === "register" && (
						<div>
							<label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'>
								Full Name
							</label>
							<input
								type='text'
								required
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								placeholder='ysurikido'
								disabled={isLoading}
								className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-red-400 disabled:opacity-50 transition-colors'
							/>
						</div>
					)}

					{/* Password */}
					<div>
						<label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'>
							Password
						</label>
						<div className='relative'>
							<input
								type={showPw ? "text" : "password"}
								required
								value={password}
								onChange={(e) => setPass(e.target.value)}
								placeholder='••••••••'
								disabled={isLoading}
								className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-red-400 disabled:opacity-50 pr-10 transition-colors'
							/>
							<button
								type='button'
								onClick={() => setShowPw((v) => !v)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs'
							>
								{showPw ? "Hide" : "Show"}
							</button>
						</div>
					</div>

					{/* Confirm password — register only */}
					{tab === "register" && (
						<div>
							<label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'>
								Confirm Password
							</label>
							<input
								type={showPw ? "text" : "password"}
								required
								value={confirm}
								onChange={(e) => setConfirm(e.target.value)}
								placeholder='••••••••'
								disabled={isLoading}
								className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-red-400 disabled:opacity-50 transition-colors'
							/>
						</div>
					)}

					{/* Error */}
					{displayError && (
						<p className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3'>
							{displayError}
						</p>
					)}

					{/* Submit */}
					<button
						type='submit'
						disabled={isLoading}
						className='w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-sm transition-colors mt-1'
					>
						{isLoading
							? tab === "login"
								? "Logging in…"
								: "Creating account…"
							: tab === "login"
								? "Log In & Continue →"
								: "Create Account & Continue →"}
					</button>
				</form>
			</div>
		</div>
	);
}

// ─── Main page ────────────────────────────────────────────────────────────────

function AddonsPageInner() {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const {
		selection,
		selectedDate,
		selectedSlot,
		addons,
		addonsStatus,
		selectedAddonIds,
		promoCode,
		promoDiscount,
		specialNote,
		draftBookingId,
		createStatus,
		createError,
		submitError,
		paystackUrl,
		initPayStatus,
		initPayError,
	} = useAppSelector((state) => state.bookingFlow);

	const baseUrl = "https://dev.studiosurikudo.com/api/v2";

	const { user } = useAppSelector((s) => s.auth);
	const [promoLoading, setPromoLoading] = useState(false);

	// Whether to show the auth gate modal
	const [showAuthModal, setShowAuthModal] = useState(false);

	const [promoInput, setPromoInput] = useState("");
	const [promoStatus, setPromoStatus] = useState<"idle" | "valid" | "invalid">(
		"idle",
	);

	// Guard — redirect if no selection
	useEffect(() => {
		if (!selection) router.replace("/#studios");
	}, [selection, router]);

	// Fetch addons on mount
	useEffect(() => {
		if (addonsStatus === "idle") dispatch(fetchAddons());
	}, [addonsStatus, dispatch]);

	// After draft created → initialize payment
	useEffect(() => {
		if (
			createStatus === "succeeded" &&
			draftBookingId &&
			initPayStatus === "idle"
		) {
			dispatch(initializePayment(draftBookingId));
		}
	}, [createStatus, draftBookingId, initPayStatus, dispatch]);

	useEffect(() => {
		if (initPayStatus === "succeeded" && paystackUrl) {
			if (typeof window === "undefined") return; // SSR guard

			sessionStorage.setItem(
				"bookingSummary",
				JSON.stringify({
					booking_id: draftBookingId,
					studio_name: selection?.studioName,
					service_name: `${selection?.name} (${selection?.unit})`,
					start_datetime:
						selectedDate && selectedSlot
							? `${selectedDate} ${selectedSlot.start_time}`
							: "",
					duration: selection?.durationHours,
					addons: addons
						.filter((a) => selectedAddonIds.includes(a.id))
						.map((a) => a.name),
					promo_code: promoCode || null,
				}),
			);

			window.location.href = paystackUrl;
		}
	}, [
		addons,
		draftBookingId,
		initPayStatus,
		paystackUrl,
		promoCode,
		selectedAddonIds,
		selectedDate,
		selectedSlot,
		selection?.durationHours,
		selection?.name,
		selection?.studioName,
		selection?.unit,
	]);

	const handleApplyPromo = async () => {
		if (!promoInput.trim()) return;

		setPromoLoading(true);
		setPromoStatus("idle");
		dispatch(clearPromo());

		try {
			const res = await fetch(
				`${baseUrl}/method/studio_app.api.bookings.validate_discount_code`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Token ab7528f977f3a64:bfa2f842eca1082",
					},
					body: JSON.stringify({
						code: promoInput.trim().toUpperCase(),
						subtotal,
					}),
				},
			);

			const data = await res.json();
			console.log("promos", data);

			// Frappe method endpoints return data inside data.message
			const result = data.data;

			if (!res.ok || result.valid === false) {
				setPromoStatus("invalid");
				dispatch(clearPromo());
				return;
			}

			const discountPercent =
				result.discount_percentage ??
				(result.discount_amount ? result.discount_amount / subtotal : 0);

			dispatch(
				setPromo({
					code: promoInput.trim().toUpperCase(),
					discount: discountPercent,
				}),
			);
			setPromoStatus("valid");
		} catch {
			setPromoStatus("invalid");
			dispatch(clearPromo());
		} finally {
			setPromoLoading(false);
		}
	};

	// Called when user clicks "Confirm and Pay"
	const handleConfirmAndPay = () => {
		// If the current auth user is the admin account (or no user),
		// show the auth modal first so a real customer logs in / registers.
		if (isAdminAccount(user)) {
			setShowAuthModal(true);
			return;
		}
		// Real user already logged in — proceed directly
		proceedToPayment();
	};

	// Called after successful auth (or if already a real user)
	const proceedToPayment = () => {
		setShowAuthModal(false);
		dispatch(createDraftBooking());
	};

	const selectedAddons = addons.filter((a) => selectedAddonIds.includes(a.id));
	const addonsTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
	const subtotal = (selection?.price ?? 0) + addonsTotal;
	const discountAmount = Math.round(subtotal * promoDiscount);
	const total = subtotal - discountAmount;
	const isLoading = createStatus === "loading" || initPayStatus === "loading";

	const formattedDate = selectedDate
		? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			})
		: null;

	return (
		<main className='min-h-screen bg-gray-50'>
			{/* Auth Gate Modal */}
			{showAuthModal && (
				<AuthModal
					onClose={() => setShowAuthModal(false)}
					onSuccess={proceedToPayment}
				/>
			)}

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
						<Link href='/#studios'>Studio</Link>
						<span>/</span>
						<span className='text-gray-900 font-medium'>
							{selection?.studioName}
						</span>
					</div>
					<StepBar step={3} />
				</div>
			</nav>

			<div className='max-w-5xl mx-auto px-6 py-10'>
				<h1 className='text-3xl font-black text-gray-950 mb-10'>
					Add-ons & Payment
				</h1>

				<div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8'>
					{/* ── Left ─────────────────────────────────────────────── */}
					<div className='flex flex-col gap-8'>
						{/* Add-ons */}
						<section>
							<h2 className='font-bold text-gray-900 mb-4'>Optional Add-ons</h2>
							{addonsStatus === "loading" && (
								<p className='text-sm text-gray-400 animate-pulse'>
									Loading add-ons…
								</p>
							)}
							<div className='flex flex-col gap-3'>
								{addons.map((addon) => {
									const added = selectedAddonIds.includes(addon.id);
									return (
										<div
											key={addon.id}
											className={`bg-white border rounded-xl p-4 flex items-center justify-between transition-all ${
												added
													? "border-red-200 bg-red-50/30"
													: "border-gray-200"
											}`}
										>
											<div>
												<p className='font-semibold text-gray-900 text-sm'>
													{addon.name}
												</p>
												<p className='text-gray-500 text-xs mt-0.5'>
													{stripHtml(addon.description)}
												</p>
											</div>
											<div className='flex items-center gap-3 shrink-0 ml-4'>
												<span className='text-sm text-gray-600 font-medium'>
													₦{addon.price}/{addon.unit}
												</span>
												<button
													onClick={() => dispatch(toggleAddon(addon.id))}
													className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition-all ${
														added
															? "bg-gray-900 text-white"
															: "bg-red-600 hover:bg-red-700 text-white"
													}`}
												>
													{added ? "✓ Added" : "+ Add"}
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
								onChange={(e) => dispatch(setSpecialNote(e.target.value))}
								placeholder='e.g Vintage plate reverb, two vocal mics, low monitor volume...'
								rows={4}
								className='w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-red-400 transition-colors resize-none'
							/>
						</section>

						{/* Promo */}
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
									onKeyDown={(e) => {
										if (e.key === "Enter") handleApplyPromo();
									}}
									placeholder='Enter promo code'
									disabled={promoLoading}
									className='flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-red-400 disabled:opacity-50'
								/>
								<button
									onClick={handleApplyPromo}
									disabled={promoLoading || !promoInput.trim()}
									className='bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors min-w-[80px]'
								>
									{promoLoading ? (
										<span className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
									) : (
										"Apply"
									)}
								</button>
							</div>

							{promoStatus === "valid" && (
								<p className='mt-2 text-xs text-green-600 flex items-center gap-1'>
									✓ Code applied — {Math.round(promoDiscount * 100)}% off (−₦
									{discountAmount.toLocaleString()})
								</p>
							)}
							{promoStatus === "invalid" && (
								<p className='mt-2 text-xs text-red-500'>
									✕ Invalid or expired promo code
								</p>
							)}

							{/* Show applied code with remove option */}
							{promoCode && promoStatus === "valid" && (
								<div className='mt-2 flex items-center gap-2'>
									<span className='text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded font-mono'>
										{promoCode}
									</span>
									<button
										onClick={() => {
											dispatch(clearPromo());
											setPromoInput("");
											setPromoStatus("idle");
										}}
										className='text-xs text-gray-400 hover:text-red-500 transition-colors'
									>
										Remove
									</button>
								</div>
							)}
						</section>

						{/* Errors */}
						{createError && (
							<p className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3'>
								{createError}
							</p>
						)}
						{submitError && (
							<p className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3'>
								{submitError}
							</p>
						)}
					</div>

					{/* ── Right — Order Summary ────────────────────────────── */}
					<div className='flex flex-col gap-4'>
						<div className='bg-white border border-gray-200 rounded-xl p-6'>
							<h3 className='font-black text-gray-900 text-lg mb-5'>
								Order Summary
							</h3>
							<div className='flex flex-col gap-3 text-sm'>
								<div className='flex justify-between'>
									<span className='text-gray-500'>
										{selection?.studioName} ({selection?.name})
									</span>
									<span className='font-semibold'>₦{selection?.price}</span>
								</div>
								{selectedAddons.map((a) => (
									<div key={a.id} className='flex justify-between'>
										<span className='text-gray-500'>{a.name} add-on</span>
										<span className='font-semibold'>₦{a.price}</span>
									</div>
								))}
								{promoCode && (
									<div className='flex justify-between'>
										<button
											onClick={() => {
												dispatch(clearPromo());
												setPromoStatus("idle");
											}}
											className='text-green-600 hover:underline text-left'
										>
											Promo ({promoCode})
										</button>
										<span className='font-semibold text-green-600'>
											-₦{discountAmount}
										</span>
									</div>
								)}
								<hr className='border-gray-100' />
								<div className='flex justify-between'>
									<span className='font-semibold text-gray-700'>Total</span>
									<span className='font-black text-gray-900'>₦{total}</span>
								</div>
							</div>
						</div>
						{/* Date/time summary */}
						{selectedDate && (
							<div className='bg-white border border-gray-100 rounded-xl p-4 text-xs text-gray-500 flex flex-col gap-1.5'>
								<div className='flex justify-between'>
									<span>Date</span>
									<span className='font-semibold text-gray-700'>
										{formattedDate}
									</span>
								</div>
								<div className='flex justify-between'>
									<span>Time</span>
									<span className='font-semibold text-red-600'>
										{selectedSlot?.label}
									</span>
								</div>
								<div className='flex justify-between'>
									<span>Duration</span>
									<span className='font-semibold text-gray-700'>
										{selection?.unit}
									</span>
								</div>
							</div>
						)}
						{/* CTA */}
						<button
							onClick={handleConfirmAndPay}
							disabled={isLoading}
							className='w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded text-sm transition-colors'
						>
							{createStatus === "loading"
								? "Creating booking…"
								: initPayStatus === "loading"
									? "Redirecting to payment…"
									: `Confirm and Pay ₦${total} →`}
						</button>
						<button
							onClick={() => {
								const params = new URLSearchParams({
									studioName: selection?.studioName ?? "",
									packageName: selection?.name ?? "",
									total: String(total),
								});
								router.push(`/book/gift?${params.toString()}`);
							}}
							className='w-full border border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-500 font-semibold py-3 px-6 rounded text-sm transition-colors flex items-center justify-center gap-2'
						>
							🎁 Give as a Gift
						</button>
						{initPayError && (
							<p className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3'>
								{initPayError}
							</p>
						)}
						<button
							onClick={() => router.back()}
							className='text-center text-sm text-gray-400 hover:text-gray-600'
						>
							← Back to Date & Time
						</button>
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
			<AddonsPageInner />
		</Suspense>
	);
}
