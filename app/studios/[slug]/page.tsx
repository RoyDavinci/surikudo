"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Package {
	id: string;
	name: string;
	badge?: { label: string; color: "orange" | "red" };
	description: string;
	price: number;
	unit: string;
	features: string[];
	highlighted?: boolean;
}

interface StudioData {
	slug: string;
	name: string;
	description: string;
	price: number;
	unit: string;
	capacity: string;
	gearHighlights: string[];
	images: { src: string; alt: string }[];
	packages: Package[];
	bundles: Package[];
}

// ─── Mock API — replace with real fetch ───────────────────────────────────────

async function fetchStudio(slug: string): Promise<StudioData | null> {
	const studios: Record<string, StudioData> = {
		"digital-production": {
			slug: "digital-production",
			name: "Digital Production Room",
			description:
				"A world-class SSL console environment, ideal for band recording, mixing and mastering. Accommodates up to 8 musicians with a dedicated isolation booth.",
			price: 80,
			unit: "hr",
			capacity: "Up to 8 Musicians",
			gearHighlights: [
				"SSL AWS 924",
				"Pro Tools HDX",
				"Neve 1073",
				"API 512",
				"Neumann U87",
				"Isolation Booth",
			],
			images: [
				{ src: "/images/studio-digital-1.jpg", alt: "Control room" },
				{ src: "/images/studio-digital-2.jpg", alt: "Mixing console" },
				{ src: "/images/studio-digital-3.jpg", alt: "Isolation booth" },
			],
			packages: [
				{
					id: "starter",
					name: "Starter Pack",
					badge: { label: "Most popular", color: "orange" },
					description:
						"A perfect starter package for those looking to get started.",
					price: 160,
					unit: "2hrs",
					features: [
						"Basic mixing included",
						"1 final export (WAV)",
						"1 revision round",
					],
				},
				{
					id: "pro",
					name: "Pro Session",
					badge: { label: "Best for Veterans", color: "red" },
					description: "A complete solution for transforming your project.",
					price: 700,
					unit: "5hrs",
					features: [
						"Advanced mixed + mastering",
						"3 export formats",
						"2 revision rounds",
					],
					highlighted: true,
				},
				{
					id: "full-day",
					name: "Full Day",
					description: "Our all-inclusive package for a full production day.",
					price: 2080,
					unit: "",
					features: [
						"Full production site",
						"All stems and project files",
						"Unlimited revisions",
					],
				},
			],
			bundles: [
				{
					id: "starter-bundle",
					name: "Starter Pack",
					badge: { label: "Most popular", color: "orange" },
					description:
						"A perfect starter bundle for those looking to get started.",
					price: 160,
					unit: "2hrs",
					features: [
						"Basic mixing included",
						"1 final export (WAV)",
						"1 revision round",
					],
				},
				{
					id: "pro-bundle",
					name: "Pro Session",
					badge: { label: "Best for Veterans", color: "red" },
					description: "A complete bundle solution for your project.",
					price: 700,
					unit: "5hrs",
					features: [
						"Advanced mixed + mastering",
						"3 export formats",
						"2 revision rounds",
					],
					highlighted: true,
				},
				{
					id: "full-day-bundle",
					name: "Full Day",
					description: "Full day bundle for complete production.",
					price: 2080,
					unit: "",
					features: [
						"Full production site",
						"All stems and project files",
						"Unlimited revisions",
					],
				},
			],
		},
		"dolby-atmos": {
			slug: "dolby-atmos",
			name: "Dolby Atmos Studio",
			description:
				"Certified 7.1.4 immersive mixing suite for spatial audio experiences. Perfect for music, film, and immersive content creation.",
			price: 120,
			unit: "hr",
			capacity: "Up to 4 Engineers",
			gearHighlights: [
				"Dolby Certified",
				"7.1.4 Setup",
				"Pro Tools HDX",
				"Genelec Monitors",
				"Avid S6",
			],
			images: [
				{ src: "/images/studio-atmos-1.jpg", alt: "Atmos room" },
				{ src: "/images/studio-atmos-2.jpg", alt: "Monitor array" },
				{ src: "/images/studio-atmos-3.jpg", alt: "Control desk" },
			],
			packages: [
				{
					id: "starter",
					name: "Starter Pack",
					badge: { label: "Most popular", color: "orange" },
					description: "Ideal for single-track spatial conversion projects.",
					price: 240,
					unit: "2hrs",
					features: ["Stereo to Atmos upmix", "1 export format", "1 revision"],
				},
				{
					id: "pro",
					name: "Pro Session",
					badge: { label: "Best for Veterans", color: "red" },
					description: "Full immersive mix session with full stem access.",
					price: 900,
					unit: "5hrs",
					features: [
						"Full Atmos mix",
						"Binaural + 7.1.4 export",
						"2 revision rounds",
					],
					highlighted: true,
				},
				{
					id: "full-day",
					name: "Full Day",
					description: "Complete album or film mix in full Dolby Atmos.",
					price: 2400,
					unit: "",
					features: [
						"Full project mixing",
						"All export formats",
						"Unlimited revisions",
					],
				},
			],
			bundles: [
				{
					id: "starter-bundle",
					name: "Starter Pack",
					badge: { label: "Most popular", color: "orange" },
					description: "Ideal for single-track spatial conversion projects.",
					price: 240,
					unit: "2hrs",
					features: ["Stereo to Atmos upmix", "1 export format", "1 revision"],
				},
				{
					id: "pro-bundle",
					name: "Pro Session",
					badge: { label: "Best for Veterans", color: "red" },
					description: "Full immersive mix session with full stem access.",
					price: 900,
					unit: "5hrs",
					features: [
						"Full Atmos mix",
						"Binaural + 7.1.4 export",
						"2 revision rounds",
					],
					highlighted: true,
				},
				{
					id: "full-day-bundle",
					name: "Full Day",
					description: "Complete album or film mix in full Dolby Atmos.",
					price: 2400,
					unit: "",
					features: [
						"Full project mixing",
						"All export formats",
						"Unlimited revisions",
					],
				},
			],
		},
		"podcast-studio": {
			slug: "podcast-studio",
			name: "Podcast Studio Room",
			description:
				"Acoustically treated podcast studio ready for 4 hosts, multitrack recording, and live streaming.",
			price: 50,
			unit: "hr",
			capacity: "Up to 4 Hosts",
			gearHighlights: [
				"Rode PodMic",
				"RØDECaster Pro II",
				"4 Host Setup",
				"Livestream Ready",
				"Multitrack Recording",
			],
			images: [
				{ src: "/images/studio-podcast-1.jpg", alt: "Podcast room" },
				{ src: "/images/studio-podcast-2.jpg", alt: "Microphone setup" },
				{ src: "/images/studio-podcast-3.jpg", alt: "Recording console" },
			],
			packages: [
				{
					id: "starter",
					name: "Starter Pack",
					badge: { label: "Most popular", color: "orange" },
					description:
						"Perfect for first-time podcasters or short-form content.",
					price: 100,
					unit: "2hrs",
					features: [
						"Basic audio cleanup",
						"1 final export (MP3/WAV)",
						"1 revision round",
					],
				},
				{
					id: "pro",
					name: "Pro Session",
					badge: { label: "Best for Veterans", color: "red" },
					description: "Full podcast production for regular creators.",
					price: 350,
					unit: "5hrs",
					features: [
						"Advanced audio processing",
						"Video + audio export",
						"2 revision rounds",
					],
					highlighted: true,
				},
				{
					id: "full-day",
					name: "Full Day",
					description: "Batch record a full season of episodes in one sitting.",
					price: 1200,
					unit: "",
					features: [
						"Full season production",
						"All stems and files",
						"Unlimited revisions",
					],
				},
			],
			bundles: [
				{
					id: "starter-bundle",
					name: "Starter Pack",
					badge: { label: "Most popular", color: "orange" },
					description:
						"Perfect for first-time podcasters or short-form content.",
					price: 100,
					unit: "2hrs",
					features: [
						"Basic audio cleanup",
						"1 final export (MP3/WAV)",
						"1 revision round",
					],
				},
				{
					id: "pro-bundle",
					name: "Pro Session",
					badge: { label: "Best for Veterans", color: "red" },
					description: "Full podcast production for regular creators.",
					price: 350,
					unit: "5hrs",
					features: [
						"Advanced audio processing",
						"Video + audio export",
						"2 revision rounds",
					],
					highlighted: true,
				},
				{
					id: "full-day-bundle",
					name: "Full Day",
					description: "Batch record a full season of episodes in one sitting.",
					price: 1200,
					unit: "",
					features: [
						"Full season production",
						"All stems and files",
						"Unlimited revisions",
					],
				},
			],
		},
	};
	return studios[slug] ?? null;
}

// ─── Service Selector ─────────────────────────────────────────────────────────

const SERVICE_STUBS = [
	{
		slug: "digital-production",
		name: "Digital Production",
		price: 80,
		unit: "hr",
		description:
			"SSL Console recording suite. Up to 8 musician. Full mixing & mastering",
	},
	{
		slug: "dolby-atmos",
		name: "Dolby Atmos",
		price: 120,
		unit: "hr",
		description:
			"Certified 7.1.4 immersive mixing. Spatial audio for music, & film.",
		badge: "Most popular",
	},
	{
		slug: "podcast-studio",
		name: "Podcast Studio",
		price: 50,
		unit: "hr",
		description:
			"Acoustically treated. 4 hosts. Multitrack recording + live stream ready",
	},
];

// ─── Package Card ─────────────────────────────────────────────────────────────

function PackageCard({
	pkg,
	selected,
	onSelect,
}: {
	pkg: Package;
	selected: boolean;
	onSelect: () => void;
}) {
	return (
		<div
			onClick={onSelect}
			className={`relative rounded-xl border p-6 flex flex-col gap-4 cursor-pointer transition-all duration-200 ${
				selected
					? "border-red-600 shadow-lg ring-1 ring-red-600"
					: pkg.highlighted
						? "border-red-200 hover:border-red-400 hover:shadow-sm"
						: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
			} bg-white`}
		>
			{/* Selected indicator */}
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

			{/* Name + badge */}
			<div className='flex items-center gap-2 flex-wrap pr-6'>
				<span className='font-bold text-gray-900 text-base'>{pkg.name}</span>
				{pkg.badge && (
					<span
						className={`text-xs font-medium px-2 py-0.5 rounded ${pkg.badge.color === "orange" ? "text-orange-500" : "text-red-600"}`}
					>
						{pkg.badge.label}
					</span>
				)}
			</div>

			<p className='text-gray-500 text-sm leading-relaxed'>{pkg.description}</p>

			<div className='flex items-baseline gap-1'>
				<span className='text-4xl font-black text-gray-900'>
					${pkg.price.toLocaleString()}
				</span>
				{pkg.unit && <span className='text-gray-400 text-sm'>/{pkg.unit}</span>}
			</div>

			<hr className='border-gray-100' />

			<ul className='flex flex-col gap-2'>
				{pkg.features.map((f) => (
					<li key={f} className='flex items-center gap-2 text-sm text-gray-700'>
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
		</div>
	);
}

// ─── Step progress bar ────────────────────────────────────────────────────────

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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudioDetailPage() {
	const params = useParams();
	const router = useRouter();
	const slug = typeof params?.slug === "string" ? params.slug : "";

	const [studio, setStudio] = useState<StudioData | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeImage, setActiveImage] = useState(0);

	// Selection state
	const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
	const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
	const [selectionMode, setSelectionMode] = useState<"package" | "bundle">(
		"package",
	);

	useEffect(() => {
		if (!slug) return;

		let isMounted = true;

		(async () => {
			setLoading(true);

			const data = await fetchStudio(slug);

			if (!isMounted || !data) return;

			setStudio(data);

			// Pre-select highlighted ones
			const defaultPkg =
				data.packages.find((p) => p.highlighted) ?? data.packages[0];

			const defaultBundle =
				data.bundles.find((b) => b.highlighted) ?? data.bundles[0];

			setSelectedPackage(defaultPkg?.id ?? null);
			setSelectedBundle(defaultBundle?.id ?? null);

			setLoading(false);
		})();

		return () => {
			isMounted = false;
		};
	}, [slug]);

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center text-gray-400 text-sm'>
				Loading studio…
			</div>
		);
	}

	if (!studio) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center gap-4'>
				<p className='text-gray-500'>Studio not found.</p>
				<Link href='/#studios' className='text-red-600 text-sm underline'>
					← Back to studios
				</Link>
			</div>
		);
	}

	// Determine what's currently selected for the Continue button
	const activeSelection =
		selectionMode === "package"
			? studio.packages.find((p) => p.id === selectedPackage)
			: studio.bundles.find((b) => b.id === selectedBundle);

	const handleContinue = () => {
		if (!activeSelection) return;
		// Pass selection via query params to the booking flow
		const params = new URLSearchParams({
			studio: studio.slug,
			studioName: studio.name,
			type: selectionMode,
			packageId: activeSelection.id,
			packageName: activeSelection.name,
			price: String(activeSelection.price),
			unit: activeSelection.unit,
		});
		router.push(`/book/date-time?${params.toString()}`);
	};

	return (
		<main className='min-h-screen bg-gray-50'>
			{/* Nav */}
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
							href='/#studios'
							className='hover:text-gray-900 transition-colors'
						>
							Studio
						</Link>

						<span>/</span>

						<span className='text-gray-900 font-medium'>{studio.name}</span>
					</div>

					<StepBar step={1} />
				</div>
			</nav>

			<div className='max-w-5xl mx-auto px-6 py-10 flex flex-col gap-16'>
				{/* ── Service Selector ──────────────────────────────── */}
				<section>
					<h2 className='text-2xl font-black text-gray-950 mb-6'>
						Choose a Service
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						{SERVICE_STUBS.map((s) => {
							const isActive = s.slug === studio.slug;
							return (
								<Link
									key={s.slug}
									href={`/studios/${s.slug}`}
									className={`relative block rounded-xl border p-5 transition-all duration-200 bg-white hover:shadow-md ${isActive ? "border-red-600 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
								>
									{s.badge && (
										<span className='absolute top-3 right-3 text-xs text-gray-500 border border-gray-200 px-2 py-0.5 rounded'>
											{s.badge}
										</span>
									)}
									<p className='font-bold text-gray-900 mb-1'>{s.name}</p>
									<div className='flex items-baseline gap-0.5 mb-3'>
										<span className='text-4xl font-black text-gray-900'>
											{s.price}
										</span>
										<span className='text-gray-400 text-xs self-end mb-1'>
											${s.unit}
										</span>
									</div>
									<hr className='border-gray-100 mb-3' />
									<p className='text-sm text-gray-500 leading-relaxed'>
										{s.description}
									</p>
								</Link>
							);
						})}
					</div>
				</section>

				{/* ── Studio Detail ─────────────────────────────────── */}
				<section className='grid grid-cols-1 md:grid-cols-2 gap-10'>
					<div className='flex flex-col gap-3'>
						<div className='relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-200'>
							<div className='absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white/30 text-sm'>
								{studio.images[activeImage]?.alt}
							</div>
						</div>
						<div className='flex gap-2'>
							{studio.images.map((img, i) => (
								<button
									key={i}
									onClick={() => setActiveImage(i)}
									className={`relative w-20 aspect-square rounded-lg overflow-hidden bg-gray-200 border-2 transition-colors ${i === activeImage ? "border-red-600" : "border-transparent hover:border-gray-300"}`}
								>
									<div className='absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800' />
								</button>
							))}
						</div>
					</div>

					<div className='flex flex-col gap-5'>
						<h3 className='text-2xl font-black text-gray-950'>{studio.name}</h3>
						<p className='text-gray-600 text-sm leading-relaxed'>
							{studio.description}
						</p>
						<div>
							<p className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-2'>
								Gear Highlights
							</p>
							<div className='flex flex-wrap gap-2'>
								{studio.gearHighlights.map((gear) => (
									<span
										key={gear}
										className='text-xs text-gray-600 border border-gray-200 bg-white px-2.5 py-1 rounded'
									>
										{gear}
									</span>
								))}
							</div>
						</div>
						<div className='grid grid-cols-2 gap-4 mt-2'>
							<div className='border border-gray-200 rounded-lg p-4 bg-white'>
								<p className='text-xs text-gray-400 uppercase tracking-widest mb-1'>
									Capacity
								</p>
								<p className='font-bold text-gray-900 text-sm'>
									{studio.capacity}
								</p>
							</div>
							<div className='border border-gray-200 rounded-lg p-4 bg-white'>
								<p className='text-xs text-gray-400 uppercase tracking-widest mb-1'>
									Rate
								</p>
								<p className='font-bold text-gray-900 text-sm'>
									{studio.price}$/{studio.unit}
								</p>
							</div>
						</div>
						<button
							onClick={handleContinue}
							disabled={!activeSelection}
							className='w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded text-sm transition-colors flex items-center justify-center gap-2'
						>
							Continue →
						</button>
					</div>
				</section>

				{/* ── Package / Bundle Toggle ───────────────────────── */}
				<section>
					<div className='flex items-center gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit'>
						<button
							onClick={() => setSelectionMode("package")}
							className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${selectionMode === "package" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
						>
							Packages
						</button>
						<button
							onClick={() => setSelectionMode("bundle")}
							className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${selectionMode === "bundle" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
						>
							Bundles
						</button>
					</div>

					{selectionMode === "package" && (
						<>
							<h2 className='text-2xl font-black text-gray-950 mb-6'>
								Choose a Package
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								{studio.packages.map((pkg) => (
									<PackageCard
										key={pkg.id}
										pkg={pkg}
										selected={selectedPackage === pkg.id}
										onSelect={() => {
											setSelectedPackage(pkg.id);
											setSelectionMode("package");
										}}
									/>
								))}
							</div>
						</>
					)}

					{selectionMode === "bundle" && (
						<>
							<h2 className='text-2xl font-black text-gray-950 mb-6'>
								Choose a Bundle
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								{studio.bundles.map((bundle) => (
									<PackageCard
										key={bundle.id}
										pkg={bundle}
										selected={selectedBundle === bundle.id}
										onSelect={() => {
											setSelectedBundle(bundle.id);
											setSelectionMode("bundle");
										}}
									/>
								))}
							</div>
						</>
					)}

					{/* Sticky bottom CTA */}
					{activeSelection && (
						<div className='mt-8 flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm'>
							<div>
								<p className='text-xs text-gray-400 uppercase tracking-widest'>
									Selected
								</p>
								<p className='font-bold text-gray-900'>
									{activeSelection.name} —{" "}
									<span className='text-red-600'>
										${activeSelection.price}
										{activeSelection.unit ? `/${activeSelection.unit}` : ""}
									</span>
								</p>
							</div>
							<button
								onClick={handleContinue}
								className='bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded text-sm transition-colors flex items-center gap-2'
							>
								Continue to Date & Time →
							</button>
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
