"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import {
	createDraftBooking,
	initializePayment,
} from "../../lib/redux/slices/bookingFlowSlice";
import {
	loginUser,
	registerUser,
	isAdminAccount,
	clearError,
} from "../../lib/redux/slices/authSlice";

// ── Auth Modal (same as addons) ───────────────────────────────────────────────
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

	const initialStatus = useRef(status);
	const initialRegisterStatus = useRef(registerStatus);

	const switchTab = (next: "login" | "register") => {
		setTab(next);
		dispatch(clearError());
		setLocalErr("");
	};

	useEffect(() => {
		dispatch(clearError());
	}, [dispatch]);

	useEffect(() => {
		const loginJustSucceeded =
			status === "succeeded" && initialStatus.current !== "succeeded";
		const registerJustSucceeded =
			registerStatus === "succeeded" &&
			initialRegisterStatus.current !== "succeeded";
		if (loginJustSucceeded || registerJustSucceeded) onSuccess();
	}, [status, registerStatus, onSuccess]);

	const isLoading = status === "loading" || registerStatus === "loading";
	const displayError = localErr || (tab === "login" ? error : registerError);

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4'>
			<div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative'>
				<button
					onClick={onClose}
					className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-light'
				>
					✕
				</button>
				<div className='text-center mb-6'>
					<span className='inline-block w-2 h-2 bg-red-600 rounded-full mb-3' />
					<h2 className='text-2xl font-black text-gray-950'>
						{tab === "login" ? "Welcome back" : "Create your account"}
					</h2>
					<p className='text-sm text-gray-400 mt-1'>
						{tab === "login"
							? "Log in to complete your gift booking"
							: "Register to complete your gift booking"}
					</p>
				</div>
				<div className='flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-6'>
					{(["login", "register"] as const).map((t) => (
						<button
							key={t}
							onClick={() => switchTab(t)}
							className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${tab === t ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
						>
							{t === "login" ? "Log In" : "Register"}
						</button>
					))}
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						setLocalErr("");
						if (tab === "login") {
							dispatch(loginUser({ email, password }));
						} else {
							if (password !== confirm)
								return setLocalErr("Passwords do not match");
							if (password.length < 8)
								return setLocalErr("Password must be at least 8 characters");
							dispatch(registerUser({ email, password, full_name: fullName }));
						}
					}}
					className='flex flex-col gap-4'
				>
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
							className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-400 disabled:opacity-50 transition-colors'
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
								placeholder='Your Name'
								disabled={isLoading}
								className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-400 disabled:opacity-50 transition-colors'
							/>
						</div>
					)}
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
								className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-400 disabled:opacity-50 pr-10 transition-colors'
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
								className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-400 disabled:opacity-50 transition-colors'
							/>
						</div>
					)}
					{displayError && (
						<p className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3'>
							{displayError}
						</p>
					)}
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

// ── Gift Page ─────────────────────────────────────────────────────────────────
function GiftPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const dispatch = useAppDispatch();

	const { user } = useAppSelector((s) => s.auth);
	const {
		selection,
		selectedDate,
		selectedSlot,
		addons,
		selectedAddonIds,
		promoCode,
		promoDiscount,
		draftBookingId,
		createStatus,
		createError,
		initPayStatus,
		initPayError,
		paystackUrl,
	} = useAppSelector((state) => state.bookingFlow);

	const backParams = searchParams.toString();

	// Compute totals (same logic as addons page)
	const selectedAddons = addons.filter((a) => selectedAddonIds.includes(a.id));
	const addonsTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
	const subtotal = (selection?.price ?? 0) + addonsTotal;
	const discountAmount = Math.round(subtotal * promoDiscount);
	const total = subtotal - discountAmount;

	// Gift-specific fields
	const [recipientName, setRecipientName] = useState("");
	const [recipientEmail, setRecipientEmail] = useState("");
	const [message, setMessage] = useState("");
	const [senderName, setSenderName] = useState("");
	const [sendDate, setSendDate] = useState(
		new Date().toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		}),
	);
	const [showAuthModal, setShowAuthModal] = useState(false);

	const canSubmit = recipientName.trim() !== "" && recipientEmail.trim() !== "";
	const isLoading = createStatus === "loading" || initPayStatus === "loading";

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

	// Save to session then redirect
	useEffect(() => {
		if (initPayStatus === "succeeded" && paystackUrl) {
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
					addons: selectedAddons.map((a) => a.name),
					promo_code: promoCode || null,
					total_amount: total,
					// Gift fields
					is_gift: true,
					gift_recipient_name: recipientName,
					gift_recipient_email: recipientEmail,
					gift_message: message,
					gift_sender_name: senderName,
					gift_send_date: sendDate,
				}),
			);
			window.location.href = paystackUrl;
		}
	}, [initPayStatus, paystackUrl]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleConfirmAndPay = () => {
		if (isAdminAccount(user)) {
			setShowAuthModal(true);
			return;
		}
		proceedToPayment();
	};

	const proceedToPayment = () => {
		setShowAuthModal(false);
		dispatch(createDraftBooking());
	};

	const formattedDate = selectedDate
		? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			})
		: null;

	return (
		<main className='min-h-screen bg-gray-50'>
			{showAuthModal && (
				<AuthModal
					onClose={() => setShowAuthModal(false)}
					onSuccess={proceedToPayment}
				/>
			)}

			{/* Nav */}
			<nav className='bg-white border-b border-gray-100 px-6 py-3'>
				<div className='max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500'>
					<IconButton
						onClick={() => router.back()}
						size='small'
						className='!p-0'
					>
						<ArrowBackIcon fontSize='small' sx={{ color: "#dc2626" }} />
					</IconButton>
					<Link
						href={`/book/addons?${backParams}`}
						className='hover:text-gray-900 transition-colors'
					>
						Add-ons
					</Link>
					<span>/</span>
					<span className='text-gray-900 font-medium'>Book as a Gift</span>
				</div>
			</nav>

			<div className='max-w-5xl mx-auto px-6 py-10'>
				<h1 className='text-3xl font-black text-gray-950 mb-2'>
					Book as a gift 🎁
				</h1>
				<p className='text-gray-500 text-sm mb-10'>
					Purchase this session as a gift. The recipient will receive a gift
					code by email to schedule at their convenience.
				</p>

				<div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8'>
					{/* ── Left — only gifter info ── */}
					<section className='bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5'>
						<h2 className='font-bold text-gray-900'>Recipient Details</h2>

						{[
							{
								label: "Recipient Name",
								value: recipientName,
								set: setRecipientName,
								type: "text",
								placeholder: "e.g. Anny Andrea",
								required: true,
							},
							{
								label: "Recipient Email",
								value: recipientEmail,
								set: setRecipientEmail,
								type: "email",
								placeholder: "anny@email.com",
								required: true,
							},
							{
								label: "Your Name",
								value: senderName,
								set: setSenderName,
								type: "text",
								placeholder: "e.g. Roy Mathias",
								required: false,
							},
						].map(({ label, value, set, type, placeholder, required }) => (
							<div key={label}>
								<label className='block text-sm text-gray-600 mb-1'>
									{label} {required && <span className='text-red-500'>*</span>}
								</label>
								<input
									type={type}
									value={value}
									onChange={(e) => set(e.target.value)}
									placeholder={placeholder}
									className='w-full border-b border-gray-200 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-red-400 transition-colors bg-transparent'
								/>
							</div>
						))}

						<div>
							<label className='block text-sm text-gray-600 mb-1'>
								Personal Message
							</label>
							<textarea
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder='e.g. Happy Birthday! Enjoy your session at Surikudo'
								rows={3}
								className='w-full border-b border-gray-200 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-red-400 transition-colors bg-transparent resize-none'
							/>
						</div>

						<div>
							<label className='block text-sm text-gray-600 mb-1'>
								Send Gift on
							</label>
							<div className='flex items-center justify-between border-b border-gray-200 py-2'>
								<input
									type='text'
									value={sendDate}
									onChange={(e) => setSendDate(e.target.value)}
									className='flex-1 text-sm text-gray-900 focus:outline-none bg-transparent'
								/>
								<span className='text-red-600'>📅</span>
							</div>
						</div>
					</section>

					{/* ── Right — read-only order summary ── */}
					<div className='flex flex-col gap-4'>
						<div className='bg-white border border-gray-200 rounded-xl p-6'>
							<h3 className='font-black text-gray-900 text-lg mb-5'>
								Order Summary
							</h3>
							<div className='flex flex-col gap-3 text-sm'>
								<div className='flex justify-between'>
									<span className='text-gray-500'>Gift for</span>
									<span className='font-bold text-gray-900'>
										{recipientName || "—"}
									</span>
								</div>

								<hr className='border-gray-100' />

								<div className='flex justify-between'>
									<span className='text-gray-500'>{selection?.studioName}</span>
									<span className='font-semibold'>
										₦{selection?.price?.toLocaleString()}
									</span>
								</div>

								{selectedAddons.map((a) => (
									<div key={a.id} className='flex justify-between'>
										<span className='text-gray-500'>{a.name} add-on</span>
										<span className='font-semibold'>
											₦{a.price.toLocaleString()}
										</span>
									</div>
								))}

								{promoCode && (
									<div className='flex justify-between'>
										<span className='text-green-600'>Promo ({promoCode})</span>
										<span className='font-semibold text-green-600'>
											-₦{discountAmount.toLocaleString()}
										</span>
									</div>
								)}

								<hr className='border-gray-100' />

								<div className='flex justify-between'>
									<span className='font-semibold text-gray-700'>Total</span>
									<span className='font-black text-gray-900'>
										₦{total.toLocaleString()}
									</span>
								</div>
							</div>
						</div>

						{/* Date/time read-only summary */}
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

						{createError && (
							<p className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3'>
								{createError}
							</p>
						)}
						{initPayError && (
							<p className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3'>
								{initPayError}
							</p>
						)}

						<button
							onClick={handleConfirmAndPay}
							disabled={!canSubmit || isLoading}
							className='w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-6 rounded text-sm transition-colors flex items-center justify-center gap-2'
						>
							{createStatus === "loading"
								? "Creating booking…"
								: initPayStatus === "loading"
									? "Redirecting to payment…"
									: `Confirm and Pay ₦${total.toLocaleString()} →`}
						</button>

						<Link
							href={`/book/addons?${backParams}`}
							className='text-center text-sm text-gray-400 hover:text-gray-600 transition-colors'
						>
							← Back to Add-ons
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}

export default function GiftPageWrapper() {
	return (
		<Suspense
			fallback={
				<div className='min-h-screen flex items-center justify-center text-gray-400 text-sm'>
					Loading…
				</div>
			}
		>
			<GiftPage />
		</Suspense>
	);
}
