/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { makeAuthenticatedFetch } from "./authSlice";

const baseUrl = "https://dev.studiosurikudo.com";

const authHeaders = (token: string) => ({
	Authorization: `Token ${token}`,
	"Content-Type": "application/json",
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudioService {
	id: string; // = name field (e.g. "SERV-2602-0001")
	slug: string;
	name: string; // = service_name
	description: string;
	basePrice: number;
	pricePerHour: number;
	duration: number;
	category: string;
	studioRoomId: string;
}

export interface PackageServiceItem {
	service: string; // e.g. "SERV-2602-0001"
	durationOverride: number;
	quantity: number;
	priceOverride: number;
}

export interface StudioPackage {
	id: string; // = name field (e.g. "PACK-2602-0001")
	name: string; // = package_name
	description: string;
	price: number;
	durationHours: number;
	features: string[];
	highlighted: boolean;
	package_name?: string;
	// The primary serviceId — taken from services[0].service in the full detail
	serviceId: string;
	// All services inside this package (populated after fetchPackageDetail)
	packageServices: PackageServiceItem[];
	studioRoomId: string;
	type: "package" | "bundle";
}

interface StudioState {
	services: StudioService[];
	servicesStatus: "idle" | "loading" | "succeeded" | "failed";
	servicesError: string | null;

	packages: StudioPackage[];
	packagesStatus: "idle" | "loading" | "succeeded" | "failed";
	packagesError: string | null;

	bundles: StudioPackage[];
	bundlesStatus: "idle" | "loading" | "succeeded" | "failed";
	bundlesError: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, "").trim();
}

function getToken(getState: () => unknown): string {
	const state = getState() as { auth: { user: { token: string } | null } };
	return state.auth.user?.token ?? "";
}

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchStudioServices = createAsyncThunk<
	StudioService[],
	void,
	{ rejectValue: string }
>("studio/fetchServices", async (_, { rejectWithValue, getState }) => {
	try {
		const params = new URLSearchParams({
			fields: JSON.stringify([
				"name",
				"service_name",
				"description",
				"base_price",
				"price_per_hour",
				"duration",
				"maximum_participants",
				"service_category",
				"requires_engineer",
				"delivery_format",
			]),
			start: "0",
			limit: "50",
		});

		const token = getToken(getState);
		const url = `${baseUrl}/api/v2/document/Studio Service?${params.toString()}`;
		const red = await makeAuthenticatedFetch(url, token);

		if (!red.ok) return rejectWithValue("Failed to fetch");
		const res = await fetch(
			`${baseUrl}/api/v2/document/Studio Service?${params.toString()}`,
			{ headers: authHeaders(token) },
		);

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return rejectWithValue(err.message ?? "Failed to fetch services");
		}

		const data = await res.json();

		return (data.data ?? []).map(
			(s: any): StudioService => ({
				id: s.name, // "SERV-2602-0001" — this IS the serviceId
				slug: toSlug(s.service_name ?? s.name),
				name: s.service_name ?? s.name,
				description: stripHtml(s.description ?? ""),
				basePrice: s.base_price ?? 0,
				pricePerHour: s.price_per_hour ?? 0,
				duration: s.duration ?? 1,
				category: s.service_category ?? "",
				studioRoomId: s.studio_room ?? "",
			}),
		);
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

// Fetches the package list, then fetches each package's full detail
// so we can extract the services[] array and get the real serviceId.
export const fetchStudioPackages = createAsyncThunk<
	StudioPackage[],
	void,
	{ rejectValue: string }
>("studio/fetchPackages", async (_, { rejectWithValue, getState }) => {
	try {
		const token = getToken(getState);

		// Step 1 — get list
		const listParams = new URLSearchParams({
			fields: JSON.stringify([
				"name",
				"package_name",
				"description",
				"total_duration",
				"package_price",
				"is_active",
				"discount",
			]),
			start: "0",
			limit: "50",
		});

		const listRes = await fetch(
			`${baseUrl}/api/v2/document/Service Package?${listParams.toString()}`,
			{ headers: authHeaders(token) },
		);

		if (!listRes.ok) {
			const err = await listRes.json().catch(() => ({}));
			return rejectWithValue(err.message ?? "Failed to fetch packages");
		}

		const listData = await listRes.json();
		const packageList: any[] = listData.data ?? [];

		// Step 2 — fetch full detail for each package to get services[]
		const detailed = await Promise.all(
			packageList.map(async (p: any) => {
				try {
					const detailRes = await fetch(
						`${baseUrl}/api/v2/document/Service Package/${p.name}`,
						{ headers: authHeaders(token) },
					);
					if (!detailRes.ok) return { ...p, services: [] };
					const detailData = await detailRes.json();
					return detailData.data ?? p;
				} catch {
					return { ...p, services: [] };
				}
			}),
		);

		return detailed.map((p: any): StudioPackage => {
			const packageServices: PackageServiceItem[] = (p.services ?? []).map(
				(item: any) => ({
					service: item.service,
					durationOverride: item.duration_override ?? 0,
					quantity: item.quantity ?? 1,
					priceOverride: item.price_override ?? 0,
				}),
			);

			// The primary serviceId = first service in the package's services list
			const primaryServiceId = packageServices[0]?.service ?? "";

			return {
				id: p.name,
				name: p.package_name ?? p.name,
				description: stripHtml(p.description ?? ""),
				price: p.package_price ?? p.price ?? 0,
				durationHours: p.total_duration ?? p.duration ?? 1,
				features: packageServices.map(
					(s) => `${s.service} × ${s.quantity} (${s.durationOverride}h)`,
				),
				highlighted: Boolean(p.is_highlighted),
				serviceId: primaryServiceId,
				packageServices,
				studioRoomId: p.studio_room ?? "",
				type: "package" as const,
				package_name: p.package_name,
			};
		});
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

export const fetchStudioBundles = createAsyncThunk<
	StudioPackage[],
	void,
	{ rejectValue: string }
>("studio/fetchBundles", async (_, { rejectWithValue, getState }) => {
	try {
		const token = getToken(getState);

		const params = new URLSearchParams({
			fields: JSON.stringify([
				"name",
				"bundle_name",
				"description",
				"bundle_price",
				"total_duration",
				"discount",
				"is_active",
				"packages", // child table — returns the packages[] array
			]),
			start: "0",
			limit: "50",
		});

		const res = await fetch(
			`${baseUrl}/api/v2/document/Service Bundle?${params.toString()}`,
			{ headers: authHeaders(token) },
		);

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return rejectWithValue(err.message ?? "Failed to fetch bundles");
		}

		const data = await res.json();

		return (data.data ?? []).map((b: any): StudioPackage => {
			const bundlePackages: PackageServiceItem[] = (b.packages ?? []).map(
				(item: any) => ({
					service: item.package, // "PACK-2602-0001"
					durationOverride: 0,
					quantity: item.quantity ?? 1,
					priceOverride: item.price_override ?? 0,
				}),
			);

			const primaryServiceId = bundlePackages[0]?.service ?? "";

			return {
				id: b.name,
				name: b.bundle_name ?? b.name,
				description: stripHtml(b.description ?? ""),
				price: b.bundle_price ?? 0,
				durationHours: b.total_duration ?? 1,
				features: bundlePackages.map((p) => `${p.service} × ${p.quantity}`),
				highlighted: false,
				serviceId: primaryServiceId,
				packageServices: bundlePackages,
				studioRoomId: b.studio_room ?? "",
				type: "bundle" as const,
			};
		});
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState: StudioState = {
	services: [],
	servicesStatus: "idle",
	servicesError: null,
	packages: [],
	packagesStatus: "idle",
	packagesError: null,
	bundles: [],
	bundlesStatus: "idle",
	bundlesError: null,
};

const studioSlice = createSlice({
	name: "studio",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Services
			.addCase(fetchStudioServices.pending, (state) => {
				state.servicesStatus = "loading";
				state.servicesError = null;
			})
			.addCase(
				fetchStudioServices.fulfilled,
				(state, action: PayloadAction<StudioService[]>) => {
					state.servicesStatus = "succeeded";
					state.services = action.payload;
				},
			)
			.addCase(fetchStudioServices.rejected, (state, action) => {
				state.servicesStatus = "failed";
				state.servicesError = action.payload ?? "Unknown error";
			})

			// Packages
			.addCase(fetchStudioPackages.pending, (state) => {
				state.packagesStatus = "loading";
				state.packagesError = null;
			})
			.addCase(
				fetchStudioPackages.fulfilled,
				(state, action: PayloadAction<StudioPackage[]>) => {
					state.packagesStatus = "succeeded";
					state.packages = action.payload;
				},
			)
			.addCase(fetchStudioPackages.rejected, (state, action) => {
				state.packagesStatus = "failed";
				state.packagesError = action.payload ?? "Unknown error";
			})

			// Bundles
			.addCase(fetchStudioBundles.pending, (state) => {
				state.bundlesStatus = "loading";
				state.bundlesError = null;
			})
			.addCase(
				fetchStudioBundles.fulfilled,
				(state, action: PayloadAction<StudioPackage[]>) => {
					state.bundlesStatus = "succeeded";
					state.bundles = action.payload;
				},
			)
			.addCase(fetchStudioBundles.rejected, (state, action) => {
				state.bundlesStatus = "failed";
				state.bundlesError = action.payload ?? "Unknown error";
			});
	},
});

export default studioSlice.reducer;
