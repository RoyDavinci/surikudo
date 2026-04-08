"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const STUDIO_OPTIONS = ["Digital Room", "Dolby Room", "Podcast"];
const PACKAGE_OPTIONS = [
	{ label: "Starter $160", value: 160 },
	{ label: "Pro $280", value: 280 },
	{ label: "Full Day $2,080", value: 2080 },
];

function GiftPage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	// Pre-filled from addons page
	const studioName = searchParams.get("studioName") ?? "Digital Room";
	const packageName = searchParams.get("packageName") ?? "";
	const total = searchParams.get("total") ?? "0";
	const backParams = searchParams.toString();

	// Derive initial package selection from total
	const initialPackage =
		PACKAGE_OPTIONS.find((p) => p.value === Number(total)) ??
		PACKAGE_OPTIONS[0];

	const [selectedStudio, setSelectedStudio] = useState(studioName);
	const [selectedPackage, setSelectedPackage] = useState(initialPackage);
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

	const canSubmit = recipientName.trim() !== "" && recipientEmail.trim() !== "";

	const handleConfirm = () => {
		const params = new URLSearchParams({
			recipientName,
			recipientEmail,
			studioName: selectedStudio,
			packageName: selectedPackage.label.split(" ").slice(0, -1).join(" "),
			total: String(selectedPackage.value),
			sendDate: `${sendDate} (scheduled)`,
			message,
			senderName,
		});
		router.push(`/book/gift-confirm?${params.toString()}`);
	};

	return (
		<main className='min-h-screen bg-gray-50'>
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
					Book as a gift
				</h1>
				<p className='text-gray-500 text-sm mb-10'>
					Purchase as a gift for someone special. They&apos;ll receive a gift
					code by email to schedule their session at their convenience.
				</p>

				<div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8'>
					{/* ── Left ─────────────────────────────────────────── */}
					<div className='flex flex-col gap-6'>
						{/* Studio + package picker */}
						<section className='bg-white border border-gray-200 rounded-xl p-6'>
							<h2 className='font-bold text-gray-900 mb-4'>Studio Bundle</h2>
							<div className='flex flex-wrap gap-2 mb-3'>
								{STUDIO_OPTIONS.map((s) => (
									<button
										key={s}
										onClick={() => setSelectedStudio(s)}
										className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
											selectedStudio === s
												? "border-red-600 text-red-600 bg-red-50"
												: "border-gray-200 text-gray-600 hover:border-gray-400"
										}`}
									>
										{s}
									</button>
								))}
							</div>
							<div className='flex flex-wrap gap-2'>
								{PACKAGE_OPTIONS.map((p) => (
									<button
										key={p.label}
										onClick={() => setSelectedPackage(p)}
										className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
											selectedPackage.value === p.value
												? "border-red-600 text-red-600 bg-red-50"
												: "border-gray-200 text-gray-600 hover:border-gray-400"
										}`}
									>
										{p.label}
									</button>
								))}
							</div>
						</section>

						{/* Recipient details */}
						<section className='bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5'>
							<h2 className='font-bold text-gray-900'>Recipient Details</h2>

							<div>
								<label className='block text-sm text-gray-600 mb-1'>
									Recipient Name <span className='text-red-500'>*</span>
								</label>
								<input
									type='text'
									value={recipientName}
									onChange={(e) => setRecipientName(e.target.value)}
									placeholder='e.g. Anny Andrea'
									className='w-full border-b border-gray-200 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-red-400 transition-colors bg-transparent'
								/>
							</div>

							<div>
								<label className='block text-sm text-gray-600 mb-1'>
									Recipient Email <span className='text-red-500'>*</span>
								</label>
								<input
									type='email'
									value={recipientEmail}
									onChange={(e) => setRecipientEmail(e.target.value)}
									placeholder='anny@email.com'
									className='w-full border-b border-gray-200 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-red-400 transition-colors bg-transparent'
								/>
							</div>

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
									Your Name
								</label>
								<input
									type='text'
									value={senderName}
									onChange={(e) => setSenderName(e.target.value)}
									placeholder='e.g. Roy Mathias'
									className='w-full border-b border-gray-200 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-red-400 transition-colors bg-transparent'
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
					</div>

					{/* ── Right — Order Summary ─────────────────────────── */}
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
								<div className='flex justify-between'>
									<span className='text-gray-500'>Studio</span>
									<span className='font-bold text-gray-900'>
										{selectedStudio} · {selectedPackage.label.split(" ")[0]}
									</span>
								</div>
								<hr className='border-gray-100' />
								<div className='flex justify-between'>
									<span className='text-gray-700 font-semibold'>Total</span>
									<span className='font-black text-gray-900'>
										${selectedPackage.value.toLocaleString()}
									</span>
								</div>
							</div>
						</div>

						<button
							onClick={handleConfirm}
							disabled={!canSubmit}
							className='w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-6 rounded text-sm transition-colors flex items-center justify-center gap-2'
						>
							Confirm and Pay ${selectedPackage.value.toLocaleString()} →
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
