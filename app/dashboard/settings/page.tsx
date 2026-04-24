"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";

type NotifChannel = "EMAIL" | "SMS" | "BOTH";

const baseUrl = "https://dev.studiosurikudo.com/api/v2";

export default function AccountSettingsPage() {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((s) => s.auth);

	const customer = user?.customer;

	// Split full_name into first/last for display
	const nameParts = (customer?.full_name ?? "").split(" ");
	const [fullName, setFullName] = useState(customer?.full_name ?? "");
	const [email, setEmail] = useState(customer?.email ?? "");
	const [phone, setPhone] = useState(customer?.phone_number ?? "");

	const [saveStatus, setSaveStatus] = useState<
		"idle" | "loading" | "saved" | "error"
	>("idle");
	const [saveError, setSaveError] = useState("");

	const [notifs, setNotifs] = useState<Record<string, NotifChannel>>({
		"Content Ready": "EMAIL",
		"Booking Reminders": "EMAIL",
		"Marketing & Promos": "EMAIL",
	});

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		setSaveStatus("loading");
		setSaveError("");

		try {
			const res = await fetch(`${baseUrl}/document/Studio%20Customer`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Token ${user.token}`,
				},
				body: JSON.stringify({
					"First Name": fullName,
					email,
					phone_number: phone,
				}),
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				const msg = err._server_messages
					? JSON.parse(err._server_messages)[0]?.message
					: (err.message ?? "Update failed");
				setSaveError(msg);
				setSaveStatus("error");
				return;
			}

			setSaveStatus("saved");
			setTimeout(() => setSaveStatus("idle"), 2500);
		} catch {
			setSaveError("Network error — please try again");
			setSaveStatus("error");
		}
	};

	const setNotifChannel = (key: string, channel: NotifChannel) => {
		setNotifs((prev) => ({ ...prev, [key]: channel }));
	};

	const inputCls =
		"w-full px-4 py-3 border border-gray-200 rounded-md text-sm text-gray-800 outline-none focus:border-red-400 transition-colors bg-white";
	const labelCls = "text-xs font-semibold text-gray-700 block mb-2";

	return (
		<div className='px-12 py-10'>
			{/* Title */}
			<div className='flex items-center gap-2.5 mb-9'>
				<div className='w-1.5 h-1.5 rounded-full bg-red-600' />
				<h1 className='text-xl font-bold text-gray-900'>Account Settings</h1>
			</div>

			{/* Profile form */}
			<div className='bg-white border border-gray-100 rounded-xl p-8 max-w-lg mb-7'>
				<form onSubmit={handleSave} className='flex flex-col gap-5'>
					{/* Full Name */}
					<div>
						<label className={labelCls}>Full Name</label>
						<input
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							className={inputCls}
							placeholder='Your full name'
						/>
					</div>

					{/* Email */}
					<div>
						<label className={labelCls}>Email</label>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={inputCls}
							placeholder='your@email.com'
						/>
					</div>

					{/* Phone */}
					<div>
						<label className={labelCls}>Phone Number</label>
						<div className='flex items-center border border-gray-200 rounded-md overflow-hidden focus-within:border-red-400 transition-colors'>
							<span className='px-4 py-3 text-sm font-semibold text-red-600 border-r border-gray-200 bg-white whitespace-nowrap'>
								+234
							</span>
							<input
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className='flex-1 px-4 py-3 text-sm text-gray-800 outline-none bg-white'
								placeholder='8000000000'
							/>
						</div>
					</div>

					{/* Error */}
					{saveStatus === "error" && (
						<p className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3'>
							{saveError}
						</p>
					)}

					{/* Save button */}
					<button
						type='submit'
						disabled={saveStatus === "loading"}
						className='w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-md text-sm transition-colors mt-1'
					>
						{saveStatus === "loading"
							? "Saving…"
							: saveStatus === "saved"
								? "Saved ✓"
								: "Save Profile"}
					</button>
				</form>
			</div>

			{/* Notification preferences — UI only, API not ready */}
			<div className='bg-white border border-gray-100 rounded-xl p-7 max-w-lg'>
				<p className='text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5'>
					Notification Preferences
				</p>
				{Object.entries(notifs).map(([key, active], i, arr) => (
					<div
						key={key}
						className={`flex items-center justify-between ${
							i < arr.length - 1 ? "pb-5 mb-5 border-b border-gray-50" : ""
						}`}
					>
						<span className='text-sm font-medium text-gray-800'>{key}</span>
						<div className='flex gap-1'>
							{(["EMAIL", "SMS", "BOTH"] as NotifChannel[]).map((ch) => (
								<button
									key={ch}
									onClick={() => setNotifChannel(key, ch)}
									className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
										active === ch
											? "bg-red-600 text-white"
											: "text-gray-400 hover:text-gray-600"
									}`}
								>
									{ch}
								</button>
							))}
						</div>
					</div>
				))}
				<p className='text-xs text-gray-300 mt-4'>
					Notification API coming soon
				</p>
			</div>
		</div>
	);
}
