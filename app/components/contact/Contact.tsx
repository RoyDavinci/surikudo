"use client";
import { useState } from "react";

const COUNTRY_CODES = [
	{ flag: "🇳🇬", code: "NG", dial: "+234" },
	{ flag: "🇬🇧", code: "GB", dial: "+44" },
	{ flag: "🇺🇸", code: "US", dial: "+1" },
	{ flag: "🇿🇦", code: "ZA", dial: "+27" },
	{ flag: "🇬🇭", code: "GH", dial: "+233" },
	{ flag: "🇪🇸", code: "SP", dial: "+34" },
	{ flag: "🇫🇷", code: "FR", dial: "+33" },
];

export default function ContactForm() {
	const [form, setForm] = useState({
		firstName: "",
		email: "",
		phone: "",
		notes: "",
		countryCode: COUNTRY_CODES[0],
	});
	const [showCountryDrop, setShowCountryDrop] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validate = () => {
		const e: Record<string, string> = {};
		if (!form.firstName.trim()) e.firstName = "First name is required";
		if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
			e.email = "Valid email is required";
		if (!form.phone.trim()) e.phone = "Phone number is required";
		if (!form.notes.trim()) e.notes = "Please add a note";
		return e;
	};

	const handleSubmit = () => {
		const e = validate();
		if (Object.keys(e).length) {
			setErrors(e);
			return;
		}
		setErrors({});
		setSubmitted(true);
	};

	const inputClass = (field: string) =>
		`w-full border rounded px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${
			errors[field] ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
		}`;

	if (submitted) {
		return (
			<section className='pt-32 pb-24 bg-white min-h-[80vh] flex items-center justify-center'>
				<div className='text-center max-w-md mx-auto px-6'>
					<div className='text-6xl mb-6'>✅</div>
					<h2 className='text-3xl font-black text-gray-950 mb-3'>
						Message Sent!
					</h2>
					<p className='text-gray-500'>
						Thanks for reaching out. Our team will get back to you within 24
						hours.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section className='pt-32 pb-24 bg-white'>
			<div className='max-w-7xl mx-auto px-6'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-start'>
					{/* Left — Form */}
					<div>
						<span className='text-green-600 font-semibold text-xs bg-green-50 px-3 py-1 rounded-full inline-block mb-5'>
							Best value
						</span>
						<h1 className='text-5xl font-black text-gray-950 mb-4'>
							Get in touch
						</h1>
						<p className='text-gray-500 text-sm leading-relaxed mb-8 max-w-sm'>
							At Studio Surikudo, we pride ourselves on offering a range of
							essential features that set us apart. Explore what makes us your
							ideal studio partner.
						</p>

						<div className='space-y-5'>
							{/* First Name */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1.5'>
									First Name <span className='text-primary'>*</span>
								</label>
								<input
									type='text'
									placeholder='John Doe'
									value={form.firstName}
									onChange={(e) =>
										setForm({ ...form, firstName: e.target.value })
									}
									className={inputClass("firstName")}
								/>
								{errors.firstName && (
									<p className='text-red-500 text-xs mt-1'>
										{errors.firstName}
									</p>
								)}
							</div>

							{/* Email */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1.5'>
									Email <span className='text-primary'>*</span>
								</label>
								<input
									type='email'
									placeholder='john.doe@studiosurikudo.com'
									value={form.email}
									onChange={(e) => setForm({ ...form, email: e.target.value })}
									className={inputClass("email")}
								/>
								{errors.email && (
									<p className='text-red-500 text-xs mt-1'>{errors.email}</p>
								)}
							</div>

							{/* Phone */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1.5'>
									Phone Number <span className='text-primary'>*</span>
								</label>
								<div className='flex gap-2'>
									{/* Country code selector */}
									<div className='relative'>
										<button
											type='button'
											onClick={() => setShowCountryDrop(!showCountryDrop)}
											className='flex items-center gap-1.5 border border-gray-300 rounded px-3 py-2.5 text-sm bg-white hover:border-gray-400 transition-colors whitespace-nowrap'
										>
											<span>{form.countryCode.flag}</span>
											<span className='text-gray-600'>
												{form.countryCode.code} ({form.countryCode.dial})
											</span>
											<svg
												className='w-3 h-3 text-gray-400'
												fill='none'
												stroke='currentColor'
												strokeWidth={2}
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M19 9l-7 7-7-7'
												/>
											</svg>
										</button>
										{showCountryDrop && (
											<div className='absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px]'>
												{COUNTRY_CODES.map((c) => (
													<button
														key={c.code}
														type='button'
														onClick={() => {
															setForm({ ...form, countryCode: c });
															setShowCountryDrop(false);
														}}
														className='flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-left'
													>
														<span>{c.flag}</span>
														<span className='text-gray-600'>
															{c.code} {c.dial}
														</span>
													</button>
												))}
											</div>
										)}
									</div>
									<input
										type='tel'
										placeholder='234 567 8901'
										value={form.phone}
										onChange={(e) =>
											setForm({ ...form, phone: e.target.value })
										}
										className={`flex-1 ${inputClass("phone")}`}
									/>
								</div>
								{errors.phone && (
									<p className='text-red-500 text-xs mt-1'>{errors.phone}</p>
								)}
							</div>

							{/* Additional Notes */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1.5'>
									Additional Notes <span className='text-primary'>*</span>
								</label>
								<textarea
									rows={4}
									placeholder='E.g., Interested in early access to new features.'
									maxLength={500}
									value={form.notes}
									onChange={(e) => setForm({ ...form, notes: e.target.value })}
									className={`${inputClass("notes")} resize-none`}
								/>
								<p className='text-gray-400 text-xs mt-1'>
									Max length: 500 characters. ({form.notes.length}/500)
								</p>
								{errors.notes && (
									<p className='text-red-500 text-xs mt-1'>{errors.notes}</p>
								)}
							</div>

							<button
								onClick={handleSubmit}
								className='bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 text-sm transition-colors'
							>
								Send message
							</button>
						</div>
					</div>

					{/* Right — Map + Contact info */}
					<div>
						{/* Map placeholder */}
						<div className='rounded-xl overflow-hidden mb-8 aspect-[4/3] bg-gray-100 relative border border-gray-200'>
							{/* SVG map mockup */}
							<svg
								viewBox='0 0 600 450'
								className='w-full h-full'
								xmlns='http://www.w3.org/2000/svg'
							>
								<rect width='600' height='450' fill='#e8e8e8' />
								{/* Grid lines */}
								{Array.from({ length: 12 }).map((_, i) => (
									<line
										key={`h${i}`}
										x1='0'
										y1={i * 38}
										x2='600'
										y2={i * 38}
										stroke='#d0d0d0'
										strokeWidth='1'
									/>
								))}
								{Array.from({ length: 16 }).map((_, i) => (
									<line
										key={`v${i}`}
										x1={i * 40}
										y1='0'
										x2={i * 40}
										y2='450'
										stroke='#d0d0d0'
										strokeWidth='1'
									/>
								))}
								{/* Road blocks */}
								<rect
									x='80'
									y='60'
									width='120'
									height='40'
									fill='#fff'
									rx='2'
								/>
								<rect
									x='250'
									y='30'
									width='80'
									height='60'
									fill='#fff'
									rx='2'
								/>
								<rect
									x='380'
									y='80'
									width='140'
									height='50'
									fill='#fff'
									rx='2'
								/>
								<rect
									x='60'
									y='160'
									width='100'
									height='80'
									fill='#fff'
									rx='2'
								/>
								<rect
									x='200'
									y='150'
									width='160'
									height='60'
									fill='#fff'
									rx='2'
								/>
								<rect
									x='400'
									y='160'
									width='120'
									height='70'
									fill='#fff'
									rx='2'
								/>
								<rect
									x='80'
									y='280'
									width='180'
									height='60'
									fill='#fff'
									rx='2'
								/>
								<rect
									x='300'
									y='260'
									width='100'
									height='80'
									fill='#fff'
									rx='2'
								/>
								<rect
									x='430'
									y='270'
									width='130'
									height='50'
									fill='#fff'
									rx='2'
								/>
								{/* Roads */}
								<rect x='0' y='115' width='600' height='12' fill='#f5f5f5' />
								<rect x='0' y='240' width='600' height='12' fill='#f5f5f5' />
								<rect x='175' y='0' width='12' height='450' fill='#f5f5f5' />
								<rect x='370' y='0' width='12' height='450' fill='#f5f5f5' />
								{/* Pin ripple */}
								<circle
									cx='280'
									cy='210'
									r='40'
									fill='#E60000'
									fillOpacity='0.08'
								/>
								<circle
									cx='280'
									cy='210'
									r='25'
									fill='#E60000'
									fillOpacity='0.12'
								/>
								<circle cx='280' cy='210' r='8' fill='#E60000' />
								<circle cx='280' cy='210' r='4' fill='white' />
							</svg>
						</div>

						{/* Contact details */}
						<div className='grid grid-cols-3 gap-6'>
							<div>
								<p className='font-bold text-gray-900 text-sm mb-2'>Address</p>
								<p className='text-gray-500 text-sm leading-relaxed'>
									456 Fake Street, London
									<br />
									W1X 0XX, United Kingdom.
								</p>
							</div>
							<div>
								<p className='font-bold text-gray-900 text-sm mb-2'>Phone</p>
								<p className='text-gray-500 text-sm leading-relaxed'>
									23340985412,
									<br />
									23340985412,
								</p>
							</div>
							<div>
								<p className='font-bold text-gray-900 text-sm mb-2'>
									Email Address
								</p>
								<a
									href='mailto:info@studiosurikudo.com'
									className='text-gray-500 text-sm hover:text-primary transition-colors'
								>
									info@studiosurikudo.com
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
