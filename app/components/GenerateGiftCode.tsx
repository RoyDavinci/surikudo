"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";

function generateGiftCode(name: string): string {
	const num = Math.floor(1000 + Math.random() * 9000);
	const initials = name.split(" ")[0]?.toUpperCase().slice(0, 4) ?? "GIFT";
	return `GIFT-${num}-${initials}`;
}

function GiftConfirmPage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const recipientName = searchParams.get("recipientName") ?? "Recipient";
	const recipientEmail = searchParams.get("recipientEmail") ?? "";
	const studioName = searchParams.get("studioName") ?? "";
	const packageName = searchParams.get("packageName") ?? "";
	const total = searchParams.get("total") ?? "0";
	const sendDate = searchParams.get("sendDate") ?? "Immediate";
	const message = searchParams.get("message") ?? "";
	const senderName = searchParams.get("senderName") ?? "";

	const [giftCode] = useState(() => generateGiftCode(recipientName));
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(giftCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleDownloadPDF = () => {
		// Wire up real PDF generation here
		alert("Downloading PDF…");
	};

	return (
		<main className='min-h-screen bg-gray-50'>
			{/* Nav */}
			<nav className='bg-white border-b border-gray-100 px-6 py-3'>
				<div className='max-w-3xl mx-auto flex items-center gap-2 text-sm text-gray-500'>
					<span className='w-3 h-3 bg-red-600 rounded-full inline-block' />
					<span className='text-gray-900 font-medium'>Studio/{studioName}</span>
				</div>
			</nav>

			<div className='max-w-xl mx-auto px-6 py-14 flex flex-col items-center gap-6'>
				{/* Icon */}
				<div className='w-16 h-16 rounded-full border-2 border-green-400 flex items-center justify-center text-3xl bg-white'>
					🎁
				</div>

				{/* Heading */}
				<div className='text-center'>
					<p className='text-red-600 text-xs font-bold uppercase tracking-widest mb-2'>
						Gift Session Purchased
					</p>
					<h1 className='text-3xl font-black text-gray-950 mb-3'>
						Gift Code Generated!
					</h1>
					<p className='text-gray-500 text-sm leading-relaxed'>
						{recipientName} will receive an email with instructions to redeem
						and schedule their session.
					</p>
				</div>

				{/* Gift code card */}
				<div className='w-full bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-4'>
					<p className='text-xs text-gray-400 uppercase tracking-widest'>
						Gift Code
					</p>
					<p className='text-2xl font-black text-gray-950 tracking-wide'>
						{giftCode}
					</p>
					<p className='text-sm text-gray-500 text-center'>
						Valid for 12 months · {studioName} · {packageName}
					</p>
					<div className='flex gap-3 w-full'>
						<button
							onClick={handleCopy}
							className='flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded text-sm transition-colors flex items-center justify-center gap-2'
						>
							{copied ? (
								"Copied!"
							) : (
								<>
									Copy Code <span>⧉</span>
								</>
							)}
						</button>
						<button
							onClick={handleDownloadPDF}
							className='flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-4 rounded text-sm transition-colors flex items-center justify-center gap-2'
						>
							Download PDF <span>↓</span>
						</button>
					</div>
				</div>

				{/* Details card */}
				<div className='w-full bg-white border border-gray-200 rounded-xl p-6'>
					<div className='flex flex-col gap-3 text-sm'>
						{[
							{ label: "Recipient", value: recipientName, bold: true },
							{ label: "Delivery Email", value: recipientEmail, bold: true },
							{ label: "Send Date", value: sendDate, bold: true },
							{
								label: "Studio",
								value: `${studioName} (${packageName})`,
								bold: true,
							},
							{ label: "Paid By", value: `$${total}`, bold: true },
						].map(({ label, value, bold }) => (
							<div key={label} className='flex justify-between items-start'>
								<span className='text-gray-400'>{label}</span>
								<span
									className={`text-right ${bold ? "font-bold text-gray-900" : "text-gray-700"}`}
								>
									{value}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Personal message preview */}
				{message && (
					<div className='w-full bg-white border border-gray-200 rounded-xl p-5'>
						<p className='text-xs text-gray-400 mb-2'>
							Personal Message Preview
						</p>
						<p className='font-bold text-gray-900 text-sm'>{message}</p>
						{senderName && (
							<p className='text-gray-400 text-xs mt-1'>-{senderName}</p>
						)}
					</div>
				)}

				{/* CTAs */}
				<div className='flex gap-3 w-full'>
					<Link
						href='/#studios'
						className='flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded text-sm transition-colors flex items-center justify-center gap-2'
					>
						← Back to Studio
					</Link>
					<button
						onClick={() => router.push("/book/addons")}
						className='flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded text-sm transition-colors flex items-center justify-center gap-2'
					>
						Purchase Another Gift
					</button>
				</div>
			</div>
		</main>
	);
}

export default function GiftConfirmPageWrapper() {
	return (
		<Suspense
			fallback={
				<div className='min-h-screen flex items-center justify-center text-gray-400 text-sm'>
					Loading…
				</div>
			}
		>
			<GiftConfirmPage />
		</Suspense>
	);
}
