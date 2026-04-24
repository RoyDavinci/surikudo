"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import {
	fetchStudioServices,
	fetchStudioPackages,
	fetchStudioBundles,
	StudioService,
	StudioPackage,
} from "../../lib/redux/slices/studioSlice";
import { setSelection } from "../../lib/redux/slices/bookingFlowSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

type SelectionMode = "service" | "package" | "bundle";

interface StudioMeta {
	name: string;
	description: string;
	capacity: string;
	rate: string;
	gearHighlights: string[];
	images: { src: string; alt: string }[];
}

// ─── Dummy studio meta — swap for real API data when available ────────────────

const STUDIO_META: StudioMeta = {
	name: "Studio Surikudo",
	description:
		"A world-class recording and production space, built for artists who refuse to compromise. SSL console, isolated vocal booth, and everything in between.",
	capacity: "Up to 8 Artists",
	rate: "₦15,000 / hr",
	gearHighlights: [
		"SSL AWS 924",
		"Pro Tools HDX",
		"Neve 1073",
		"API 512",
		"Neumann U87",
		"Isolation Booth",
		"Dolby Atmos Ready",
	],
	images: [
		{ src: "/images/studio-1.jpg", alt: "Control room" },
		{ src: "/images/studio-2.jpg", alt: "Mixing console" },
		{ src: "/images/studio-3.jpg", alt: "Isolation booth" },
	],
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

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({
	service,
	selected,
	onSelect,
}: {
	service: StudioService;
	selected: boolean;
	onSelect: () => void;
}) {
	return (
		<div
			onClick={onSelect}
			className={`relative rounded-xl border p-5 cursor-pointer transition-all duration-200 bg-white hover:shadow-md ${
				selected
					? "border-red-600 shadow-md ring-1 ring-red-600"
					: "border-gray-200 hover:border-gray-300"
			}`}
		>
			{selected && (
				<div className='absolute top-3 right-3 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center'>
					<svg
						className='w-3 h-3 text-white'
						fill='none'
						stroke='currentColor'
						strokeWidth={3}
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M5 13l4 4L19 7'
						/>
					</svg>
				</div>
			)}
			<p className='font-bold text-gray-900 mb-1 pr-6'>{service.name}</p>
			<div className='flex items-baseline gap-0.5 mb-3'>
				<span className='text-3xl font-black text-gray-900'>
					₦{service.basePrice.toLocaleString()}
				</span>
			</div>
			<hr className='border-gray-100 mb-3' />
			<p className='text-sm text-gray-500 leading-relaxed line-clamp-3'>
				{service.description}
			</p>
			<div className='mt-3 flex gap-2 flex-wrap'>
				<span className='text-xs text-gray-500 border border-gray-200 px-2 py-0.5 rounded'>
					{service.duration}h
				</span>
				{service.category && (
					<span className='text-xs text-gray-500 border border-gray-200 px-2 py-0.5 rounded'>
						{service.category}
					</span>
				)}
			</div>
		</div>
	);
}

// ─── Package Card ─────────────────────────────────────────────────────────────

function PackageCard({
	pkg,
	selected,
	disabled,
	onSelect,
}: {
	pkg: StudioPackage;
	selected: boolean;
	disabled?: boolean;
	onSelect: () => void;
}) {
	return (
		<div
			onClick={disabled ? undefined : onSelect}
			className={`relative rounded-xl border p-6 flex flex-col gap-4 transition-all duration-200 bg-white ${
				disabled
					? "opacity-50 cursor-not-allowed border-gray-200"
					: selected
						? "border-red-600 shadow-lg ring-1 ring-red-600 cursor-pointer"
						: pkg.highlighted
							? "border-red-200 hover:border-red-400 hover:shadow-sm cursor-pointer"
							: "border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer"
			}`}
		>
			{disabled && (
				<div className='absolute top-3 right-3 text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded'>
					Coming soon
				</div>
			)}

			{selected && !disabled && (
				<div className='absolute top-3 right-3 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center'>
					<svg
						className='w-3 h-3 text-white'
						fill='none'
						stroke='currentColor'
						strokeWidth={3}
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M5 13l4 4L19 7'
						/>
					</svg>
				</div>
			)}

			<div className='flex items-center gap-2 flex-wrap pr-6'>
				<span className='font-bold text-gray-900 text-base'>{pkg.name}</span>
				{pkg.highlighted && (
					<span className='text-xs font-medium px-2 py-0.5 rounded text-orange-500'>
						Popular
					</span>
				)}
			</div>

			<p className='text-gray-500 text-sm leading-relaxed'>{pkg.description}</p>

			<div className='flex items-baseline gap-1'>
				<span className='text-4xl font-black text-gray-900'>
					₦{pkg.price.toLocaleString()}
				</span>
				<span className='text-gray-400 text-sm'>total</span>
			</div>

			<hr className='border-gray-100' />

			{pkg.packageServices.length > 0 && (
				<div>
					<p className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-2'>
						Includes
					</p>
					<ul className='flex flex-col gap-1.5'>
						{pkg.packageServices.map((s, i) => (
							<li
								key={i}
								className='flex items-center gap-2 text-sm text-gray-700'
							>
								<svg
									className='w-4 h-4 text-green-500 shrink-0'
									fill='none'
									stroke='currentColor'
									strokeWidth={2.5}
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M5 13l4 4L19 7'
									/>
								</svg>
								<span>
									{s.service} × {s.quantity}
									{s.durationOverride ? ` (${s.durationOverride}h)` : ""}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{pkg.packageServices.length === 0 && pkg.features.length > 0 && (
				<ul className='flex flex-col gap-2'>
					{pkg.features.map((f) => (
						<li
							key={f}
							className='flex items-center gap-2 text-sm text-gray-700'
						>
							<svg
								className='w-4 h-4 text-green-500 shrink-0'
								fill='none'
								stroke='currentColor'
								strokeWidth={2.5}
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							{f}
						</li>
					))}
				</ul>
			)}

			{!disabled && (
				<button
					type='button'
					onClick={(e) => {
						e.stopPropagation();
						onSelect();
					}}
					className={`mt-auto w-full py-2.5 px-4 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
						selected
							? "bg-red-600 text-white"
							: "bg-gray-100 hover:bg-gray-200 text-gray-800"
					}`}
				>
					{selected ? "✓ Selected" : "Select & continue →"}
				</button>
			)}
		</div>
	);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudioDetailPage() {
	const params = useParams();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const slug = typeof params?.slug === "string" ? params.slug : "";

	const [selectionMode, setSelectionMode] = useState<SelectionMode>("service");
	const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
		null,
	);
	const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
		null,
	);
	const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null);

	const {
		services,
		servicesStatus,
		packages,
		packagesStatus,
		bundles,
		bundlesStatus,
	} = useAppSelector((state) => state.studio);

	const resolvedBundleId =
		selectedBundleId ?? (bundles.length > 0 ? bundles[0].id : null);

	const activeBundle = bundles.find((b) => b.id === resolvedBundleId) ?? null;
	const [activeImage, setActiveImage] = useState(0);

	useEffect(() => {
		if (servicesStatus === "idle") dispatch(fetchStudioServices());
		if (packagesStatus === "idle") dispatch(fetchStudioPackages());
		if (bundlesStatus === "idle") dispatch(fetchStudioBundles());
	}, [servicesStatus, packagesStatus, bundlesStatus, dispatch]);

	const resolvedServiceId =
		selectedServiceId ?? (services.length > 0 ? services[0].id : null);

	const resolvedPackageId =
		selectedPackageId ??
		(packages.length > 0
			? (packages.find((p) => p.highlighted) ?? packages[0])?.id
			: null);

	const isLoading =
		servicesStatus === "loading" || packagesStatus === "loading";

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center text-gray-400 text-sm'>
				Loading studio…
			</div>
		);
	}

	const activeService =
		services.find((s) => s.id === resolvedServiceId) ?? null;
	const activePackage =
		packages.find((p) => p.id === resolvedPackageId) ?? null;

	const canContinue =
		(selectionMode === "service" && activeService !== null) ||
		(selectionMode === "package" && activePackage !== null) ||
		(selectionMode === "bundle" && activeBundle !== null);

	const handleContinue = () => {
		if (selectionMode === "service" && activeService) {
			dispatch(
				setSelection({
					id: activeService.id,
					name: activeService.name,
					price: activeService.basePrice,
					unit: `${activeService.duration}h`,
					type: "service",
					serviceId: activeService.id,
					studioRoomId: activeService.studioRoomId || "ROOM-2602-0001",
					studioName: activeService.name,
					durationHours: activeService.duration,
				}),
			);
		} else if (selectionMode === "package" && activePackage) {
			dispatch(
				setSelection({
					id: activePackage.id,
					name: activePackage.name,
					price: activePackage.price,
					unit: `${activePackage.durationHours}h`,
					type: "package",
					serviceId: activePackage.serviceId,
					packageServices: activePackage.packageServices,
					studioRoomId: activePackage.studioRoomId || "ROOM-2602-0001",
					studioName: activePackage.name,
					durationHours: activePackage.durationHours,
				}),
			);
		} else if (selectionMode === "bundle" && activeBundle) {
			dispatch(
				setSelection({
					id: activeBundle.id,
					name: activeBundle.name,
					price: activeBundle.price,
					unit: `${activeBundle.durationHours}h`,
					type: "bundle",
					serviceId: activeBundle.serviceId,
					packageServices: activeBundle.packageServices,
					studioRoomId: activeBundle.studioRoomId || "ROOM-2602-0001",
					studioName: activeBundle.name,
					durationHours: activeBundle.durationHours,
				}),
			);
		}

		router.push("/book/date-time");
	};

	return (
		<main className='min-h-screen bg-gray-50'>
			{/* ── Nav ─────────────────────────────────────────────────── */}
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
							href='/#studios'
							className='hover:text-gray-900 transition-colors'
						>
							Studio
						</Link>
						<span>/</span>
						<span className='text-gray-900 font-medium'>
							{STUDIO_META.name}
						</span>
					</div>
					<StepBar step={1} />
				</div>
			</nav>

			<div className='max-w-5xl mx-auto px-6 py-10 flex flex-col gap-16'>
				{/* ── Studio Hero — images + info ──────────────────────── */}
				<section className='grid grid-cols-1 md:grid-cols-2 gap-10'>
					{/* Images */}
					<div className='flex flex-col gap-3'>
						<div className='relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-200'>
							<div className='absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center'>
								<span className='text-white/40 text-sm tracking-wide'>
									{STUDIO_META.images[activeImage]?.alt}
								</span>
							</div>
						</div>
						<div className='flex gap-2'>
							{STUDIO_META.images.map((img, i) => (
								<button
									key={i}
									onClick={() => setActiveImage(i)}
									className={`relative w-20 aspect-square rounded-lg overflow-hidden bg-gray-200 border-2 transition-colors ${
										i === activeImage
											? "border-red-600"
											: "border-transparent hover:border-gray-300"
									}`}
								>
									<div className='absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800' />
								</button>
							))}
						</div>
					</div>

					{/* Info */}
					<div className='flex flex-col gap-5'>
						<h1 className='text-2xl font-black text-gray-950'>
							{STUDIO_META.name}
						</h1>
						<p className='text-gray-600 text-sm leading-relaxed'>
							{STUDIO_META.description}
						</p>

						<div>
							<p className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-2'>
								Gear Highlights
							</p>
							<div className='flex flex-wrap gap-2'>
								{STUDIO_META.gearHighlights.map((gear) => (
									<span
										key={gear}
										className='text-xs text-gray-600 border border-gray-200 bg-white px-2.5 py-1 rounded'
									>
										{gear}
									</span>
								))}
							</div>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div className='border border-gray-200 rounded-lg p-4 bg-white'>
								<p className='text-xs text-gray-400 uppercase tracking-widest mb-1'>
									Capacity
								</p>
								<p className='font-bold text-gray-900 text-sm'>
									{STUDIO_META.capacity}
								</p>
							</div>
							<div className='border border-gray-200 rounded-lg p-4 bg-white'>
								<p className='text-xs text-gray-400 uppercase tracking-widest mb-1'>
									Starting Rate
								</p>
								<p className='font-bold text-gray-900 text-sm'>
									{STUDIO_META.rate}
								</p>
							</div>
						</div>

						<button
							onClick={handleContinue}
							disabled={!canContinue}
							className='w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded text-sm transition-colors flex items-center justify-center gap-2'
						>
							Continue →
						</button>
					</div>
				</section>

				{/* ── Mode Toggle ──────────────────────────────────────── */}
				<div className='flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit'>
					{(["service", "package", "bundle"] as SelectionMode[]).map((mode) => (
						<button
							key={mode}
							onClick={() => setSelectionMode(mode)}
							className={`px-5 py-2 rounded-md text-sm font-semibold transition-all capitalize ${
								selectionMode === mode
									? "bg-white shadow text-gray-900"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							{mode === "service"
								? "Services"
								: mode === "package"
									? "Packages"
									: "Bundles"}
						</button>
					))}
				</div>

				{/* ── Services ─────────────────────────────────────────── */}
				{selectionMode === "service" && (
					<section>
						<h2 className='text-2xl font-black text-gray-950 mb-6'>
							Choose a Service
						</h2>
						{services.length === 0 ? (
							<p className='text-gray-400 text-sm'>No services available.</p>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								{services.map((s) => (
									<ServiceCard
										key={s.id}
										service={s}
										selected={resolvedServiceId === s.id}
										onSelect={() => setSelectedServiceId(s.id)}
									/>
								))}
							</div>
						)}
					</section>
				)}

				{/* ── Packages ─────────────────────────────────────────── */}
				{selectionMode === "package" && (
					<section>
						<h2 className='text-2xl font-black text-gray-950 mb-2'>
							Choose a Package
						</h2>
						<p className='text-sm text-gray-400 mb-6'>
							Packages bundle multiple services at a combined price.
						</p>
						{packages.length === 0 ? (
							<p className='text-gray-400 text-sm'>No packages available.</p>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								{packages.map((pkg) => (
									<PackageCard
										key={pkg.id}
										pkg={pkg}
										selected={resolvedPackageId === pkg.id}
										onSelect={() => setSelectedPackageId(pkg.id)}
									/>
								))}
							</div>
						)}
					</section>
				)}

				{/* ── Bundles (disabled — API not ready) ───────────────── */}
				{selectionMode === "bundle" && (
					<section>
						<h2 className='text-2xl font-black text-gray-950 mb-2'>Bundles</h2>
						<p className='text-sm text-gray-400 mb-6'>
							Bundles combine multiple packages for groups or extended sessions.
						</p>
						{bundles.length === 0 ? (
							<p className='text-gray-400 text-sm'>No bundles available.</p>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								{bundles.map((b) => (
									<PackageCard
										key={b.id}
										pkg={b}
										selected={resolvedBundleId === b.id}
										onSelect={() => setSelectedBundleId(b.id)}
									/>
								))}
							</div>
						)}
					</section>
				)}

				{/* ── Sticky Continue Bar ───────────────────────────────── */}
				{canContinue && (
					<div className='sticky bottom-6 flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-md'>
						<div>
							<p className='text-xs text-gray-400 uppercase tracking-widest'>
								Selected
							</p>
							{selectionMode === "service" && activeService && (
								<p className='font-bold text-gray-900'>
									{activeService.name} —{" "}
									<span className='text-red-600'>
										₦{activeService.basePrice.toLocaleString()}
									</span>
									<span className='text-xs text-gray-400 ml-1'>
										· serviceId: {activeService.id}
									</span>
								</p>
							)}
							{selectionMode === "package" && activePackage && (
								<p className='font-bold text-gray-900'>
									{activePackage.name} —{" "}
									<span className='text-red-600'>
										₦{activePackage.price.toLocaleString()}
									</span>
									<span className='text-xs text-gray-400 ml-1'>
										· serviceId: {activePackage.serviceId}
									</span>
								</p>
							)}
							{selectionMode === "bundle" && activeBundle && (
								<p className='font-bold text-gray-900'>
									{activeBundle.name} —{" "}
									<span className='text-red-600'>
										₦{activeBundle.price.toLocaleString()}
									</span>
									<span className='text-xs text-gray-400 ml-1'>
										· {activeBundle.durationHours}h
									</span>
								</p>
							)}
						</div>
						<button
							onClick={handleContinue}
							className='bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded text-sm transition-colors flex items-center gap-2'
						>
							Continue to Date & Time →
						</button>
					</div>
				)}
			</div>
		</main>
	);
}
